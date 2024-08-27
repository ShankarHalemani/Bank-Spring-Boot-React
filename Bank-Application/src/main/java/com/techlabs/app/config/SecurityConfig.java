package com.techlabs.app.config;

import com.techlabs.app.security.JwtAuthenticationEntryPoint;
import com.techlabs.app.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private JwtAuthenticationEntryPoint authenticationEntryPoint;
    private JwtAuthenticationFilter authenticationFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint, JwtAuthenticationFilter authenticationFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.authenticationFilter = authenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                                // Swagger UI and API docs
                                .requestMatchers(HttpMethod.GET,
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/swagger-resources/**",
                                        "/swagger-ui.html",
                                        "/webjars/**").permitAll()

                                // Authentication endpoints
                                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/signin").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/signup").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/file/view/**").permitAll()

                                // Customer Endpoints
                                .requestMatchers(HttpMethod.GET, "/api/customers").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/customers").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/customers").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/customers/activate").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.GET, "/api/customers/{customerId}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/customers/{customerId}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/customers/search").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/customers/active-no-accounts").hasRole("ADMIN")

                                // Bank Endpoints
                                .requestMatchers(HttpMethod.GET, "/api/banks").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/banks").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/banks").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/banks/activate/{bankId}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/banks/{bankId}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/banks/{bankId}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/banks/search").hasRole("ADMIN")

                                // Account Endpoints
                                .requestMatchers(HttpMethod.PUT, "/api/accounts/activate/{accountNumber}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/accounts/{customerId}/{bankId}").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.GET, "/api/accounts/{accountNumber}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/accounts/{accountNumber}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/accounts/{accountNumber}").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/accounts").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/accounts/search").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/accounts/transactions/search").hasRole("ADMIN")

                                // Transaction Endpoints
                                .requestMatchers(HttpMethod.POST, "/api/transactions/{senderAccount}/{receiverAccount}").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/transactions").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/transactions/{accountNumber}").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/transactions/{accountNumber}/dates").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/transactions/totalBalance").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/transactions/dates").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/transactions/balance/{accountNumber}").hasRole("CUSTOMER")

                                // Any other request must be authenticated
                                .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
