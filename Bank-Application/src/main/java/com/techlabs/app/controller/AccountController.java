package com.techlabs.app.controller;

import com.techlabs.app.dto.AccountResponseDTO;
import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.service.AccountService;
import com.techlabs.app.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private AccountService accountService;

    @Operation(summary = "Get All Accounts")
    @GetMapping()
    public ResponseEntity<PagedResponse<AccountResponseDTO>> getAllAccounts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "2") int size,
            @RequestParam(name = "sortBy", defaultValue = "accountNumber") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {
        logger.info("Fetching All The Accounts");
        PagedResponse<AccountResponseDTO> accountResponseDTOS = accountService.getAllAccounts(page, size, sortBy, direction);

        return new ResponseEntity<>(accountResponseDTOS, HttpStatus.OK);
    }

    @Operation(summary = "Get account by account number")
    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponseDTO> getAccountByAccountNumber(@PathVariable(name = "accountNumber") long accountNumber) {
        logger.info("Fetching account with account number: {}", accountNumber);
        AccountResponseDTO accountResponseDTO = accountService.getAccountByAccountNumber(accountNumber);
        return new ResponseEntity<>(accountResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Create a new account")
    @PostMapping("/{customerId}/{bankId}")
    public ResponseEntity<AccountResponseDTO> createNewAccount(@PathVariable(name = "customerId") long customerId,
                                                               @PathVariable(name = "bankId") long bankId) {
        logger.info("Creating new account for customerId: {} and bankId: {}", customerId, bankId);
        AccountResponseDTO accountResponseDTO = accountService.createNewAccount(customerId, bankId);
        return new ResponseEntity<>(accountResponseDTO, HttpStatus.CREATED);
    }

    @Operation(summary = "Add balance to an account")
    @PostMapping("/{accountNumber}")
    public ResponseEntity<AccountResponseDTO> addAccountBalance(@PathVariable(name = "accountNumber") long accountNumber,
                                                                @RequestParam(name = "amount") double amount) {
        logger.info("Adding balance to account number: {}", accountNumber);
        AccountResponseDTO accountResponseDTO = accountService.updateAccountBalance(accountNumber, amount);
        return new ResponseEntity<>(accountResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Activate an account")
    @PutMapping("/activate/{accountNumber}")
    public ResponseEntity<AccountResponseDTO> activateAccount(@PathVariable(name = "accountNumber") long accountNumber) {
        logger.info("Activating account with account number: {}", accountNumber);
        AccountResponseDTO accountResponseDTO = accountService.activateAccount(accountNumber);
        return new ResponseEntity<>(accountResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Delete an account by account number")
    @DeleteMapping("/{accountNumber}")
    public ResponseEntity<Object> deleteAccount(@PathVariable(name = "accountNumber") long accountNumber) {
        logger.info("Deleting account with account number: {}", accountNumber);
        accountService.deleteAccount(accountNumber);
        return ResponseEntity.ok("Account with account number: " + accountNumber + " deleted successfully");
    }


    @Operation(summary = "Get transactions based on various criteria with pagination")
    @GetMapping("/transactions/search")
    public ResponseEntity<PagedResponse<TransactionResponseDTO>> getTransactions(
            @RequestParam(name = "transactionId", required = false) Long transactionId,
            @RequestParam(name = "senderAccountNumber", required = false) Long senderAccountNumber,
            @RequestParam(name = "receiverAccountNumber", required = false) Long receiverAccountNumber,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "minAmount", required = false) Double minAmount,
            @RequestParam(name = "maxAmount", required = false) Double maxAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        // Convert LocalDate to LocalDateTime at the start of the day
        LocalDateTime startDateTime = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = (endDate != null) ? endDate.atTime(LocalTime.MAX) : null;

        PagedResponse<TransactionResponseDTO> pagedTransactions = accountService.searchTransactions(
                transactionId, senderAccountNumber, receiverAccountNumber, startDateTime, endDateTime, minAmount, maxAmount, page, size, sortBy, direction);

        return new ResponseEntity<>(pagedTransactions, HttpStatus.OK);
    }

    @Operation(summary = "Get accounts based on criteria with pagination")
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<AccountResponseDTO>> getAccounts(
            @RequestParam(name = "accountNumber", required = false) Long accountNumber,
            @RequestParam(name = "minBalance", required = false) Double minBalance,
            @RequestParam(name = "maxBalance", required = false) Double maxBalance,
            @RequestParam(name = "bankName", required = false) String bankName,
            @RequestParam(name = "activeStatus", required = false) Boolean activeStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "accountNumber") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<AccountResponseDTO> pagedAccounts = accountService.searchAccounts(
                accountNumber, minBalance, maxBalance, bankName, activeStatus, page, size, sortBy, direction);

        return new ResponseEntity<>(pagedAccounts, HttpStatus.OK);
    }



}
