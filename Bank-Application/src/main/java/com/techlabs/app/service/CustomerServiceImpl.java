package com.techlabs.app.service;

import com.techlabs.app.dto.CustomerRequestDTO;
import com.techlabs.app.dto.CustomerResponseDTO;
import com.techlabs.app.entity.Account;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.Role;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.mapper.Mapper;
import com.techlabs.app.repository.AccountRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.repository.RoleRepository;
import com.techlabs.app.repository.UserRepository;
import com.techlabs.app.util.PagedResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CustomerServiceImpl implements CustomerService {
    private static final Logger logger = LoggerFactory.getLogger(CustomerServiceImpl.class);

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Mapper mapper;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public PagedResponse<CustomerResponseDTO> getAllCustomers(int page, int size, String sortBy, String direction) {
        logger.info("Fetching all customers");
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Customer> all = customerRepository.findAll(pageable);

        if (all.getContent().isEmpty()) {
            throw new CustomerRelatedException("No Customers Found");
        }

        List<CustomerResponseDTO> customerResponseDTOS = mapper.getCustomerResponseList(all.getContent());

        return new PagedResponse<>(customerResponseDTOS, all.getNumber(), all.getNumberOfElements(),
                all.getTotalElements(), all.getTotalPages(), all.isLast());

    }

    @Override
    public CustomerResponseDTO getCustomerById(long customerId) {
        logger.info("Fetching customer with ID: {}", customerId);
        Customer customer = customerRepository.findById(customerId).orElseThrow(() ->
                new CustomerRelatedException("Customer with ID : " + customerId + " is not found"));

        return mapper.customerEntityToResponse(customer);
    }

    @Override
    public CustomerResponseDTO addNewCustomer(CustomerRequestDTO customerRequestDTO) {
        logger.info("Adding new customer with username: {}", customerRequestDTO.getUsername());
        if (userRepository.existsUserByUsername(customerRequestDTO.getUsername())) {
            throw new CustomerRelatedException("Customer with username : "
                    + customerRequestDTO.getUsername() + " already exists");
        }

        User user = new User();
        user.setFirstName(customerRequestDTO.getFirstName());
        user.setLastName(customerRequestDTO.getLastName());
        user.setUsername(customerRequestDTO.getUsername());
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(customerRequestDTO.getPassword()));

        Customer customer = new Customer();
        customer.setFirstName(customerRequestDTO.getFirstName());
        customer.setLastName(customerRequestDTO.getLastName());
        customer.setActive(user.isActive());
        customer.setUser(user);
        List<Account> accounts = new ArrayList<>();
        customer.setAccounts(accounts);
        customer.setTotalBalance(0);
        user.setCustomer(customer);

        Set<Role> roles = new HashSet<>();
        Role newRole = roleRepository.findByName("ROLE_CUSTOMER").orElseThrow(() ->
                new RuntimeException("Role Not Found"));

        roles.add(newRole);
        user.setRoles(roles);

        userRepository.save(user);
        customerRepository.save(customer);
        logger.info("Customer with username: {} added successfully", customerRequestDTO.getUsername());
        return mapper.customerEntityToResponse(customer);
    }

    @Override
    public CustomerResponseDTO updateCustomer(CustomerRequestDTO customerRequestDTO) {
        logger.info("Updating customer with ID: {}", customerRequestDTO.getCustomerId());
        Customer customer = customerRepository.findById(customerRequestDTO.getCustomerId())
                .orElseThrow(() -> new CustomerRelatedException("Customer with ID : "
                        + customerRequestDTO.getCustomerId() + " is not found"));

        if (!customer.isActive()) {
            throw new CustomerRelatedException("Customer with ID : "
                    + customerRequestDTO.getCustomerId() + " is not active");
        }
        customer.setFirstName(customerRequestDTO.getFirstName());
        customer.setLastName(customerRequestDTO.getLastName());

        User user = customer.getUser();
        user.setFirstName(customer.getFirstName());
        user.setLastName(customer.getLastName());
        customer.setUser(user);
        user.setCustomer(customer);

        userRepository.save(user);
        customerRepository.save(customer);

        logger.info("Customer with ID: {} updated successfully", customerRequestDTO.getCustomerId());
        return mapper.customerEntityToResponse(customer);
    }

    @Override
    public void deleteCustomer(long customerId) {
        logger.info("Deleting customer with ID: {}", customerId);
        Customer customer = customerRepository.findById(customerId).orElseThrow(() ->
                new CustomerRelatedException("Customer with ID : " + customerId + " is not found"));

        User user = customer.getUser();
        user.setActive(false);
        customer.setActive(false);
        customerRepository.save(customer);
        userRepository.save(user);

        logger.info("Customer with ID: {} deleted successfully", customerId);
    }

    @Override
    public CustomerResponseDTO activateCustomer(long customerId) {
        logger.info("Activating customer with ID: {}", customerId);
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerRelatedException("Customer with ID : "
                        + customerId + " is not found"));

        if (customer.isActive()) {
            throw new CustomerRelatedException("Customer with ID : "
                    + customerId + " is already active");
        }

        User user = customer.getUser();
        user.setActive(true);
        customer.setActive(true);

//        List<Long> accountNumbersToActivate = customerRequestDTO.getAccountNumbers();
//
//        customer.getAccounts().forEach(account -> {
//            if (accountNumbersToActivate.contains(account.getAccountNumber())) {
//                account.setActive(true);
//            }
//        });

        double totalBalance = customer.getAccounts().stream()
                .filter(singleAccount -> singleAccount.getBank().isActive() && singleAccount.isActive())
                .mapToDouble(Account::getBalance)
                .sum();

        customer.setTotalBalance(totalBalance);

        accountRepository.saveAll(customer.getAccounts());
        userRepository.save(user);
        customerRepository.save(customer);

        logger.info("Customer with ID: {} activated successfully", customerId);
        return mapper.customerEntityToResponse(customer);
    }

    @Override
    public PagedResponse<CustomerResponseDTO> searchCustomers(Long customerId, String firstName, String lastName,
                                                              Boolean active, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size,sort);
        Page<Customer> customers;

        if (customerId != null) {
            customers = customerRepository.findByCustomerId(customerId, pageable);
        } else {
            customers = customerRepository.findByCriteria(firstName, lastName, active, pageable);
        }

        if (customers.getContent().isEmpty()) {
            throw new CustomerRelatedException("No Customers Found");
        }

        List<CustomerResponseDTO> customerResponseDTOS = mapper.getCustomerResponseList(customers.getContent());

        return new PagedResponse<>(customerResponseDTOS, customers.getNumber(), customers.getNumberOfElements(),
                customers.getTotalElements(), customers.getTotalPages(), customers.isLast());
    }


    @Override
    public PagedResponse<CustomerResponseDTO> getActiveCustomersWithNoAccounts(int page, int size, String sortBy, String direction) {
        logger.info("Fetching all active customers with no accounts");

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Customer> customers = customerRepository.findByActiveTrueAndAccountsIsEmpty(pageable);

        if (customers.getContent().isEmpty()) {
            throw new CustomerRelatedException("No active customers without accounts found");
        }

        List<CustomerResponseDTO> customerResponseDTOS = mapper.getCustomerResponseList(customers.getContent());

        return new PagedResponse<>(customerResponseDTOS, customers.getNumber(), customers.getNumberOfElements(),
                customers.getTotalElements(), customers.getTotalPages(), customers.isLast());
    }

}
