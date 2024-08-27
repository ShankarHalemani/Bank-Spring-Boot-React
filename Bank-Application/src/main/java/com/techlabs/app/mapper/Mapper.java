package com.techlabs.app.mapper;

import com.techlabs.app.dto.AccountResponseDTO;
import com.techlabs.app.dto.BankResponseDTO;
import com.techlabs.app.dto.CustomerResponseDTO;
import com.techlabs.app.dto.TransactionResponseDTO;
import com.techlabs.app.entity.Account;
import com.techlabs.app.entity.Bank;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.Transaction;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class Mapper {
    public CustomerResponseDTO customerEntityToResponse(Customer customer){
        CustomerResponseDTO customerResponseDTO = new CustomerResponseDTO();
        customerResponseDTO.setId(customer.getCustomerId());
        customerResponseDTO.setFirstName(customer.getFirstName());
        customerResponseDTO.setLastName(customer.getLastName());
        customerResponseDTO.setTotalBalance(customer.getTotalBalance());
        customerResponseDTO.setUsername(customer.getUser().getUsername());
        customerResponseDTO.setActive(customer.isActive());

        List<AccountResponseDTO> accountResponseDTOS = customer.getAccounts().stream()
                .map(account -> accountEntityToResponse(account)).toList();

        customerResponseDTO.setAccounts(accountResponseDTOS);
        return customerResponseDTO;
    }


    public AccountResponseDTO accountEntityToResponse(Account account){
        AccountResponseDTO accountResponseDTO = new AccountResponseDTO();
        accountResponseDTO.setAccountNumber(account.getAccountNumber());
        accountResponseDTO.setBalance(account.getBalance());
        accountResponseDTO.setActive(account.isActive());
        BankResponseDTO bankResponseDTO = bankEntityToResponse(account.getBank());
        accountResponseDTO.setBankResponseDTO(bankResponseDTO);

//        List<TransactionResponseDTO> sentTransactions = account.getSentTransactions().stream()
//                .map(transaction -> transactionEntityToResponse(transaction)).toList();
//        List<TransactionResponseDTO> receivedTransactions = account.getReceivedTransactions().stream()
//                .map(transaction -> transactionEntityToResponse(transaction)).toList();
//
//        accountResponseDTO.setSentTransactions(sentTransactions);
//        accountResponseDTO.setReceivedTransactions(receivedTransactions);

        return accountResponseDTO;
    }

    public TransactionResponseDTO transactionEntityToResponse(Transaction transaction){
        TransactionResponseDTO transactionResponseDTO = new TransactionResponseDTO();
        transactionResponseDTO.setTransactionId(transaction.getTransactionId());
        transactionResponseDTO.setTransactionTimestamp(transaction.getTransactionTimestamp());
        transactionResponseDTO.setAmount(transaction.getAmount());
        transactionResponseDTO.setSenderAccountNumber(transaction.getSenderAccountNumber().getAccountNumber());
        transactionResponseDTO.setReceiverAccountNumber(transaction.getReceiverAccountNumber().getAccountNumber());

        return transactionResponseDTO;
    }

    public BankResponseDTO bankEntityToResponse(Bank bank){
        BankResponseDTO bankResponseDTO = new BankResponseDTO();
        bankResponseDTO.setBankId(bank.getBankId());
        bankResponseDTO.setFullName(bank.getFullName());
        bankResponseDTO.setAbbreviation(bank.getAbbreviation());
        bankResponseDTO.setActive(bank.isActive());

        return bankResponseDTO;
    }

    public List<BankResponseDTO> getBankResponseList(List<Bank> banks){
        List<BankResponseDTO> bankResponseDTOS = new ArrayList<>();
        for (Bank bank : banks){
            bankResponseDTOS.add(bankEntityToResponse(bank));
        }

        return bankResponseDTOS;
    }

    public List<CustomerResponseDTO> getCustomerResponseList(List<Customer> customers){
        List<CustomerResponseDTO> customerResponseDTOS = new ArrayList<>();
        for (Customer customer : customers){
            customerResponseDTOS.add(customerEntityToResponse(customer));
        }

        return customerResponseDTOS;
    }

    public List<AccountResponseDTO> getAccountResponseList(List<Account> accounts){
        List<AccountResponseDTO> accountResponseDTOS = new ArrayList<>();
        for (Account account : accounts){
            accountResponseDTOS.add(accountEntityToResponse(account));
        }

        return accountResponseDTOS;
    }

    public List<TransactionResponseDTO> getTransactionResponseList(List<Transaction> transactions){
        List<TransactionResponseDTO> transactionResponseDTOS = new ArrayList<>();
        for (Transaction transaction : transactions){
            transactionResponseDTOS.add(transactionEntityToResponse(transaction));
        }

        return transactionResponseDTOS;
    }

}
