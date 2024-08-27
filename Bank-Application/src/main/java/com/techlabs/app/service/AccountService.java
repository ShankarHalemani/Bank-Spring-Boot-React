package com.techlabs.app.service;

import com.techlabs.app.dto.AccountResponseDTO;
import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.util.PagedResponse;

import java.time.LocalDateTime;

public interface AccountService {
    PagedResponse<AccountResponseDTO> getAllAccounts(int page, int size, String sortBy, String direction);

    AccountResponseDTO getAccountByAccountNumber(long accountNumber);

    AccountResponseDTO createNewAccount(long customerId, long bankId);

    AccountResponseDTO updateAccountBalance(long accountNumber, double amount);

    void deleteAccount(long accountNumber);

    AccountResponseDTO activateAccount(long accountNumber);

    PagedResponse<AccountResponseDTO> searchAccounts(Long accountNumber, Double minBalance, Double maxBalance, String bankName, Boolean activeStatus, int page, int size, String sortBy, String direction);

    PagedResponse<TransactionResponseDTO> searchTransactions(Long transactionId, Long senderAccountNumber, Long receiverAccountNumber, LocalDateTime startDateTime, LocalDateTime endDateTime, Double minAmount, Double maxAmount, int page, int size, String sortBy, String direction);
}
