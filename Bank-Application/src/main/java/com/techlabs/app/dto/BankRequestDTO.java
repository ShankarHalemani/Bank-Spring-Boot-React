package com.techlabs.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BankRequestDTO {
    private Long bankId;

    @NotBlank
    private String fullName;

    @NotBlank
    private String abbreviation;

    private boolean active;
}
