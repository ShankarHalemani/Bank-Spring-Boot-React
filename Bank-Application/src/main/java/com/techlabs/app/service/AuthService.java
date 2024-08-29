package com.techlabs.app.service;

import com.techlabs.app.dto.JWTAuthResponse;
import com.techlabs.app.dto.LoginDTO;
import com.techlabs.app.dto.RegisterDTO;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    JWTAuthResponse login(LoginDTO loginDTO);

    String register(RegisterDTO registerDTO, java.lang.String role, MultipartFile file);

    Boolean validateAdminToken(String token);

    Boolean validateCustomerToken(String token);
}
