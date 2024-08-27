package com.techlabs.app.service;

import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.util.PagedResponse;

import java.time.LocalDateTime;

public interface TransactionService {
    TransactionResponseDTO makeTransaction(long senderAccount, long receiverAccount, double amount);

    PagedResponse<TransactionResponseDTO> searchTransactions(String currentUsername, Long transactionId, Long accountNumber, LocalDateTime startDateTime, LocalDateTime endDateTime, Double minAmount, Double maxAmount, int page, int size, String sortBy, String direction);
}
