package com.techlabs.app.service;

import com.techlabs.app.config.EmailSender;
import com.techlabs.app.dto.AccountResponseDTO;
import com.techlabs.app.dto.EmailDTO;
import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.entity.Account;
import com.techlabs.app.entity.Bank;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.Transaction;
import com.techlabs.app.exception.AccountRelatedException;
import com.techlabs.app.exception.BankRealtedException;
import com.techlabs.app.exception.CustomerRelatedException;
import com.techlabs.app.exception.TransactionRelatedException;
import com.techlabs.app.mapper.Mapper;
import com.techlabs.app.repository.AccountRepository;
import com.techlabs.app.repository.BankRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.repository.TransactionRepository;
import com.techlabs.app.util.PagedResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private Mapper mapper;

    @Override
    public PagedResponse<AccountResponseDTO> getAllAccounts(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Account> accounts = accountRepository.findAllByBankActive(true, pageable);

        if (accounts.getContent().isEmpty()) {
            throw new AccountRelatedException("No Accounts Found");
        }

        List<AccountResponseDTO> accountResponseList = mapper.getAccountResponseList(accounts.getContent());
        return new PagedResponse<>(accountResponseList, accounts.getNumber(), accounts.getNumberOfElements(),
                accounts.getTotalElements(), accounts.getTotalPages(), accounts.isLast());

    }

    @Override
    public AccountResponseDTO getAccountByAccountNumber(long accountNumber) {
        logger.info("Fetching account with account number: {}", accountNumber);
        Account account = accountRepository.findById(accountNumber).orElseThrow(() ->
                new AccountRelatedException("Account with account number : "
                        + accountNumber + " is not available"));

        Bank bank = account.getBank();
        if (!bank.isActive()) {
            throw new BankRealtedException("Bank with ID : " + bank.getBankId() + " is not active");
        }

        return mapper.accountEntityToResponse(account);
    }

    @Override
    public AccountResponseDTO createNewAccount(long customerId, long bankId) {
        logger.info("Creating new account for customer ID: {} in bank ID: {}", customerId, bankId);
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new CustomerRelatedException(
                "Customer with ID : " + customerId + " is not found"));
        if (!customer.isActive()) {
            throw new CustomerRelatedException("Customer with ID : " + customerId + " is not active");
        }

        Bank bank = bankRepository.findById(bankId).orElseThrow(() ->
                new BankRealtedException("Bank with ID : " + bankId + " is not found"));
        if (!bank.isActive()) {
            throw new BankRealtedException("Bank with ID : " + bankId + " is not active");
        }

        Account account = new Account();
        account.setBank(bank);
        account.setCustomer(customer);
        account.setBalance(1000);
        account.setActive(true);
        account.setSentTransactions(new ArrayList<>());
        account.setReceivedTransactions(new ArrayList<>());
        accountRepository.save(account);

        bank.getAccounts().add(account);
        bankRepository.save(bank);
        customer.setTotalBalance(1000 + customer.getTotalBalance());
        customer.getAccounts().add(account);
        customerRepository.save(customer);

        logger.info("New account created with account number: {}", account.getAccountNumber());

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(customer.getUser().getUsername());
        emailDTO.setSubject("Regarding new Account Creation");
        String body = "Welcome to " + bank.getFullName() + ". Your account created with account number "
                + account.getAccountNumber();
        emailDTO.setBody(body);

        emailSender.sendMailWithAttachement(emailDTO);
        return mapper.accountEntityToResponse(account);
    }

    @Override
    public AccountResponseDTO updateAccountBalance(long accountNumber, double amount) {
        logger.info("Updating balance for account number: {} by amount: {}", accountNumber, amount);
        Account account = accountRepository.findById(accountNumber).orElseThrow(() ->
                new AccountRelatedException("Account with account number : "
                        + accountNumber + " is not available"));

        if (!account.isActive()) {
            logger.error("Account with account number: {} is not active", accountNumber);
            throw new AccountRelatedException("Account with account number : " + accountNumber + " is not active");
        }

        if (!account.getBank().isActive()) {
            throw new BankRealtedException("Bank with ID : "
                    + account.getBank().getBankId() + " is not active");
        }

        double currentBalance = account.getBalance();
        double updatedBalance = currentBalance + amount;
        account.setBalance(updatedBalance);

        Customer customer = account.getCustomer();
        double totalBalance = customer.getAccounts().stream()
                .filter(singleAccount -> singleAccount.getBank().isActive() && singleAccount.isActive())
                .mapToDouble(Account::getBalance)
                .sum();
        customer.setTotalBalance(totalBalance);

        customerRepository.save(customer);
        accountRepository.save(account);

        Bank bank = account.getBank();
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(customer.getUser().getUsername());
        emailDTO.setSubject("Account Balance Updated");
        String body = "Welcome to " + bank.getFullName() + ". Your account credited with amount "
                + amount;
        emailDTO.setBody(body);

        emailSender.sendMailWithAttachement(emailDTO);

        logger.info("Account number: {} updated with new balance: {}", accountNumber, updatedBalance);
        return mapper.accountEntityToResponse(account);
    }

    @Override
    public void deleteAccount(long accountNumber) {
        logger.info("Deleting account with account number: {}", accountNumber);
        Account account = accountRepository.findById(accountNumber).orElseThrow(() ->
                new AccountRelatedException("Account with account number : "
                        + accountNumber + " is not available"));

        if (!account.getBank().isActive()) {
            throw new BankRealtedException("Bank with ID : "
                    + account.getBank().getBankId() + " is not active");
        }

        account.setActive(false);
        Customer customer = account.getCustomer();
        double totalBalance = customer.getAccounts().stream()
                .filter(singleAccount -> singleAccount.getBank().isActive() && singleAccount.isActive())
                .mapToDouble(Account::getBalance)
                .sum();
        customer.setTotalBalance(totalBalance);

        customerRepository.save(customer);
        accountRepository.save(account);

        Bank bank = account.getBank();
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(customer.getUser().getUsername());
        emailDTO.setSubject("Account Closing Update");
        String body = "Your account in the " + bank.getFullName() + " has been deleted successfully";
        emailDTO.setBody(body);

        emailSender.sendMailWithAttachement(emailDTO);

        logger.info("Account with account number: {} has been deleted", accountNumber);
    }

    @Override
    public AccountResponseDTO activateAccount(long accountNumber) {
        logger.info("Activating account with account number: {}", accountNumber);
        Account account = accountRepository.findById(accountNumber).orElseThrow(() ->
                new AccountRelatedException("Account with account number : "
                        + accountNumber + " is not available"));

        if (account.isActive()) {
            throw new AccountRelatedException("Account with account number : "
                    + accountNumber + " is already activated");
        }

        Bank bank = account.getBank();
        if (!bank.isActive()) {
            throw new BankRealtedException("Bank with ID : " + bank.getBankId() + " is not active");
        }

        Customer customer = account.getCustomer();
        if (!customer.isActive()) {
            throw new CustomerRelatedException("Customer with ID : " + customer.getCustomerId() + " is not active");
        }

        account.setActive(true);
        customer = account.getCustomer();
        double totalBalance = customer.getAccounts().stream()
                .filter(singleAccount -> singleAccount.getBank().isActive() && singleAccount.isActive())
                .mapToDouble(Account::getBalance)
                .sum();
        customer.setTotalBalance(totalBalance);

        customerRepository.save(customer);
        accountRepository.save(account);


        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setTo(customer.getUser().getUsername());
        emailDTO.setSubject("Account Closing Update");
        String body = "Your account in the " + bank.getFullName() + " has been activated successfully";
        emailDTO.setBody(body);

        emailSender.sendMailWithAttachement(emailDTO);

        logger.info("Account with account number: {} has been activated", accountNumber);
        return mapper.accountEntityToResponse(account);
    }


    @Override
    public PagedResponse<TransactionResponseDTO> searchTransactions(
            Long transactionId, Long senderAccountNumber, Long receiverAccountNumber,
            LocalDateTime startDate, LocalDateTime endDate,
            Double minAmount, Double maxAmount,
            int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Transaction> transactions = transactionRepository.searchTransactions(
                transactionId, senderAccountNumber, receiverAccountNumber, startDate, endDate, minAmount, maxAmount, pageable);

        if (transactions.isEmpty()) {
            throw new TransactionRelatedException("No transactions found for the given criteria.");
        }

        List<TransactionResponseDTO> transactionResponseDTOS = mapper.getTransactionResponseList(transactions.getContent());

        return new PagedResponse<>(transactionResponseDTOS, transactions.getNumber(), transactions.getNumberOfElements(),
                transactions.getTotalElements(), transactions.getTotalPages(), transactions.isLast());
    }



    @Override
    public PagedResponse<AccountResponseDTO> searchAccounts(Long accountNumber, Double minBalance, Double maxBalance,
                                                            String bankName, Boolean activeStatus, int page, int size,
                                                            String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Account> accounts;

        if (accountNumber != null) {
            accounts = accountRepository.findByAccountNumber(accountNumber, pageable);
        } else {
            accounts = accountRepository.findByCriteria(minBalance, maxBalance, bankName, activeStatus, pageable);
        }

        if (accounts.isEmpty()) {
            throw new AccountRelatedException("No accounts found for the given criteria.");
        }

        List<AccountResponseDTO> accountResponseDTOS = mapper.getAccountResponseList(accounts.getContent());

        return new PagedResponse<>(accountResponseDTOS, accounts.getNumber(), accounts.getNumberOfElements(),
                accounts.getTotalElements(), accounts.getTotalPages(), accounts.isLast());
    }

}
