package com.techlabs.app.controller;

import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.service.TransactionService;
import com.techlabs.app.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    @Operation(summary = "Make a new transaction")
    @PostMapping("/{senderAccount}/{receiverAccount}")
    public ResponseEntity<TransactionResponseDTO> newTransaction(@PathVariable(name = "senderAccount") long senderAccount,
                                                                 @PathVariable(name = "receiverAccount") long receiverAccount,
                                                                 @RequestParam(name = "amount") double amount) {
        logger.info("Making a transaction from account {} to account {} for amount {}", senderAccount, receiverAccount, amount);
        TransactionResponseDTO transactionResponseDTO = transactionService.makeTransaction(senderAccount, receiverAccount, amount);
        return new ResponseEntity<>(transactionResponseDTO, HttpStatus.CREATED);
    }

    @Operation(summary = "Get transactions of the current user based on various criteria with pagination")
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<TransactionResponseDTO>> getTransactions(
            @RequestParam(name = "transactionId", required = false) Long transactionId,
            @RequestParam(name = "accountNumber", required = false) Long accountNumber,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "minAmount", required = false) Double minAmount,
            @RequestParam(name = "maxAmount", required = false) Double maxAmount,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "transactionTimestamp") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Fetching transactions for user {} with criteria: accountNumber={}, startDate={}, endDate={}, minAmount={}, maxAmount={}",
                currentUsername, accountNumber, startDate, endDate, minAmount, maxAmount);

        // Convert LocalDate to LocalDateTime at the start and end of the day
        LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = (endDate != null) ? endDate.atTime(LocalTime.MAX) : null;

        PagedResponse<TransactionResponseDTO> pagedTransactions = transactionService.searchTransactions(
                currentUsername, transactionId, accountNumber, startDateTime, endDateTime, minAmount, maxAmount, page, size, sortBy, direction);

        return new ResponseEntity<>(pagedTransactions, HttpStatus.OK);
    }


}
