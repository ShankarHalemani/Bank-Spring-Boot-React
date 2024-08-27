package com.techlabs.app.service;

import com.techlabs.app.dto.JWTAuthResponse;
import com.techlabs.app.dto.LoginDTO;
import com.techlabs.app.dto.RegisterDTO;
import com.techlabs.app.entity.*;
import com.techlabs.app.exception.AdminRelatedException;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.exception.ResourceNotFoundException;
import com.techlabs.app.exception.UserRelatedException;
import com.techlabs.app.repository.AdminRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.repository.RoleRepository;
import com.techlabs.app.repository.UserRepository;
import com.techlabs.app.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private FileService fileService;

    @Override
    public JWTAuthResponse login(LoginDTO loginDTO) {
        logger.info("Attempting login for username: {}", loginDTO.getUsername());
        User user = userRepository.findUserByUsername(loginDTO.getUsername()).orElseThrow(() ->
                new UsernameNotFoundException("User with username : " + loginDTO.getUsername() + " not found"));
        if (!user.isActive()) {
            throw new UserRelatedException("Current user is not active");
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.getUsername(), loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
        jwtAuthResponse.setAccessToken(token);
        jwtAuthResponse.setFirstName(user.getFirstName());
        for (Role role : user.getRoles()) {
            jwtAuthResponse.setRole(role.getName());
            break;
        }
        if (jwtAuthResponse.getRole().equals("ROLE_CUSTOMER")) {
            jwtAuthResponse.setUserId(user.getUserId());
        }

        logger.info("Login successful for username: {}", loginDTO.getUsername());
        return jwtAuthResponse;
    }

    @Override
    public String register(RegisterDTO registerDTO, String role, MultipartFile file) {
        logger.info("Attempting registration for username: {} with role: {}", registerDTO.getUsername(), role);
        if (userRepository.existsUserByUsername(registerDTO.getUsername()) && role.equals("ROLE_CUSTOMER")) {

            throw new CustomerRelatedException("Customer with the Username : " + registerDTO.getUsername() + " already exists");
        }

        if (userRepository.existsUserByUsername(registerDTO.getUsername()) && role.equals("ROLE_ADMIN")) {

            throw new AdminRelatedException("Admin with the Username : " + registerDTO.getUsername() + " already exists");
        }

        User user = new User();
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setUsername(registerDTO.getUsername());
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        Customer customer = new Customer();
        Admin admin = new Admin();

        if (role.equals("ROLE_ADMIN")) {
            admin.setFirstName(registerDTO.getFirstName());
            admin.setLastName(registerDTO.getLastName());
            admin.setUser(user);
            user.setAdmin(admin);
        } else {
            customer.setFirstName(registerDTO.getFirstName());
            customer.setLastName(registerDTO.getLastName());
            customer.setUser(user);
            List<Account> accounts = new ArrayList<>();
            customer.setAccounts(accounts);
            customer.setTotalBalance(0);
            customer.setActive(user.isActive());
            user.setCustomer(customer);
        }

        Set<Role> roles = new HashSet<>();
        Role newRole = roleRepository.findByName(role).orElseThrow(() ->
                new RuntimeException("Role Not Found"));
        roles.add(newRole);
        user.setRoles(roles);

        userRepository.save(user);

        if (role.equals("ROLE_ADMIN")) {
            adminRepository.save(admin);
            logger.info("Registration successful for Admin with username: {}", registerDTO.getUsername());
        }
        if (role.equals("ROLE_CUSTOMER")) {
            customerRepository.save(customer);
            try {
                fileService.saveFile(file, customer);
            } catch (IOException e) {
                throw new ResourceNotFoundException(e.getMessage());
            }
            logger.info("Registration successful for Customer with username: {}", registerDTO.getUsername());
        }

        return "Registration successful for role : " + role.substring(5);
    }

    @Override
    public Boolean validateAdminToken(String token) {
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> byUsername = userRepository.findUserByUsername(username);
        if (byUsername.isEmpty())
            return false;
        Set<Role> roles = byUsername.get().getRoles();
        for (Role role : roles) {
            if (role.getName().equalsIgnoreCase("ROLE_ADMIN"))
                return true;
        }

        return false;

    }

    @Override
    public Boolean validateCustomerToken(String token) {
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> byUsername = userRepository.findUserByUsername(username);
        if (byUsername.isEmpty())
            return false;
        Set<Role> roles = byUsername.get().getRoles();
        for (Role role : roles) {
            if (role.getName().equalsIgnoreCase("ROLE_CUSTOMER"))
                return true;
        }

        return false;

    }

}
