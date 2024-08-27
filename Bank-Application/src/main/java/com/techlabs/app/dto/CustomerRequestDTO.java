package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequestDTO {
    private Long customerId;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String username;

    private String password;

    private boolean active;

//    private List<Long> accountNumbers;
}
