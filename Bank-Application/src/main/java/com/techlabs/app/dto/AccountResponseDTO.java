package com.techlabs.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponseDTO {

    private Long accountNumber;

    private double balance;

    private BankResponseDTO bankResponseDTO;

//    private List<TransactionResponseDTO> sentTransactions;
//
//    private List<TransactionResponseDTO> receivedTransactions;

    private boolean active;
}
