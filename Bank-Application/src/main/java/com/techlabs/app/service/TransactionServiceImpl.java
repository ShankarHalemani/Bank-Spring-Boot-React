package com.techlabs.app.service;

import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.entity.Account;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.Transaction;
import com.techlabs.app.entity.User;
import com.techlabs.app.exception.AccountRelatedException;
import com.techlabs.app.exception.BankRealtedException;
import com.techlabs.app.exception.UserRelatedException;
import com.techlabs.app.mapper.Mapper;
import com.techlabs.app.repository.AccountRepository;
import com.techlabs.app.repository.TransactionRepository;
import com.techlabs.app.repository.UserRepository;
import com.techlabs.app.util.PagedResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Mapper mapper;



    @Override
    public TransactionResponseDTO makeTransaction(long senderAccount, long receiverAccount, double amount) {
        logger.info("Making transaction from sender account: {} to receiver account: {} with amount: {}", senderAccount, receiverAccount, amount);

        Account sender = accountRepository.findById(senderAccount).orElseThrow(() -> new AccountRelatedException("Account with account number : " + senderAccount + " is not available"));

        if (!sender.getBank().isActive()) {
            throw new BankRealtedException("Bank with ID : "
                    + sender.getBank().getBankId() + " is not active");
        }

        if (!sender.isActive()) {
            throw new AccountRelatedException("Account with account number : " + senderAccount + " is not active");
        }


        Account receiver = accountRepository.findById(receiverAccount).orElseThrow(() ->
                new AccountRelatedException("Account with account number : "
                        + receiverAccount + " is not available"));

        if (!receiver.getBank().isActive()) {
            throw new BankRealtedException("Bank with ID : "
                    + receiver.getBank().getBankId() + " is not active");
        }

        if (!receiver.isActive()) {
            throw new AccountRelatedException("Account with account number : "
                    + receiverAccount + " is not active");
        }

        if (sender.getBalance() < amount) {
            throw new AccountRelatedException("Insufficient Balance in sender account : "
                    + senderAccount);
        }

        Transaction transaction = new Transaction();
        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        transaction.setTransactionTimestamp(LocalDateTime.now());
        transaction.setAmount(amount);
        transaction.setSenderAccountNumber(sender);
        transaction.setReceiverAccountNumber(receiver);

        sender.getSentTransactions().add(transaction);
        receiver.getReceivedTransactions().add(transaction);

        Customer sendingCustomer = sender.getCustomer();
        Customer receivingCustomer = receiver.getCustomer();

        double sendingCustomerTotalBalance = sendingCustomer.getAccounts().stream().mapToDouble(Account::getBalance).sum();
        sendingCustomer.setTotalBalance(sendingCustomerTotalBalance);

        double receivingCustomerTotalBalance = receivingCustomer.getAccounts().stream().mapToDouble(Account::getBalance).sum();
        receivingCustomer.setTotalBalance(receivingCustomerTotalBalance);

        transactionRepository.save(transaction);
        accountRepository.save(sender);
        accountRepository.save(receiver);

        logger.info("Transaction from account: {} to account: {} completed successfully", senderAccount, receiverAccount);
        return mapper.transactionEntityToResponse(transaction);
    }

    @Override
    public PagedResponse<TransactionResponseDTO> searchTransactions(
            String username, Long transactionId, Long accountNumber,
            LocalDateTime startDate, LocalDateTime endDate,
            Double minAmount, Double maxAmount,
            int page, int size, String sortBy, String direction) {

        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UserRelatedException("User with username: " + username + " not found"));

        Customer customer = user.getCustomer();
        List<Account> accounts = customer.getAccounts();

        // Check if the accountNumber is provided and belongs to the customer
        if (accountNumber != null) {
            accounts = accounts.stream()
                    .filter(account -> account.getAccountNumber() == accountNumber)
                    .collect(Collectors.toList());

            if (accounts.isEmpty()) {
                throw new AccountRelatedException("Unauthorized access or account not found.");
            }
        }

        Set<Transaction> allTransactions = new HashSet<>();
        for (Account account : accounts) {
            allTransactions.addAll(transactionRepository.searchTransactions(
                    transactionId, account.getAccountNumber(), null, startDate, endDate, minAmount, maxAmount, Pageable.unpaged()).getContent());
            allTransactions.addAll(transactionRepository.searchTransactions(
                    transactionId, null, account.getAccountNumber(), startDate, endDate, minAmount, maxAmount, Pageable.unpaged()).getContent());
        }

        List<Transaction> transactionsList = new ArrayList<>(allTransactions);
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), transactionsList.size());
        Page<Transaction> transactionsPage = new PageImpl<>(transactionsList.subList(start, end), pageable, transactionsList.size());

        List<TransactionResponseDTO> transactionResponseDTOS = mapper.getTransactionResponseList(transactionsPage.getContent());
        return new PagedResponse<>(transactionResponseDTOS, transactionsPage.getNumber(), transactionsPage.getNumberOfElements(),
                transactionsPage.getTotalElements(), transactionsPage.getTotalPages(), transactionsPage.isLast());
    }

}