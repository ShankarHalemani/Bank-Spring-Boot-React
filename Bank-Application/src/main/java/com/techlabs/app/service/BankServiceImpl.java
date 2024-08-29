package com.techlabs.app.service;

import com.techlabs.app.dto.BankRequestDTO;
import com.techlabs.app.dto.BankResponseDTO;
import com.techlabs.app.entity.Account;
import com.techlabs.app.entity.Bank;
import com.techlabs.app.entity.Customer;
import com.techlabs.app.exception.BankRealtedException;
import com.techlabs.app.mapper.Mapper;
import com.techlabs.app.repository.AccountRepository;
import com.techlabs.app.repository.BankRepository;
import com.techlabs.app.repository.CustomerRepository;
import com.techlabs.app.util.PagedResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BankServiceImpl implements BankService {
    private static final Logger logger = LoggerFactory.getLogger(BankServiceImpl.class);

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private Mapper mapper;

    @Override
    public PagedResponse<BankResponseDTO> getAllBanks(int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Bank> banks = bankRepository.findAll(pageable);
        if (banks.getContent().isEmpty()) {

            throw new BankRealtedException("No Banks Found");
        }
        List<BankResponseDTO> bankResponseList = mapper.getBankResponseList(banks.getContent());
        return new PagedResponse<>(bankResponseList, banks.getNumber(), banks.getNumberOfElements(),
                banks.getTotalElements(), banks.getTotalPages(), banks.isLast());

    }

    @Override
    public BankResponseDTO getBankById(long bankId) {
        logger.info("Fetching bank with ID: {}", bankId);
        Bank bank = bankRepository.findById(bankId).orElseThrow(() ->
                new BankRealtedException("Bank with ID : " + bankId + " is not found"));

        if (!bank.isActive()) {
            throw new BankRealtedException("Bank with ID : " + bank.getBankId() + " is not active");
        }

        return mapper.bankEntityToResponse(bank);
    }

    @Override
    public BankResponseDTO addNewBank(BankRequestDTO bankRequestDTO) {
        logger.info("Adding new bank with name: {}", bankRequestDTO.getFullName());
        Bank bank = new Bank();
        bank.setFullName(bankRequestDTO.getFullName());
        bank.setAbbreviation(bankRequestDTO.getAbbreviation());
        bank.setActive(true);
        List<Account> accounts = new ArrayList<>();
        bank.setAccounts(accounts);
        bankRepository.save(bank);
        logger.info("Bank with name: {} added successfully", bankRequestDTO.getFullName());
        return mapper.bankEntityToResponse(bank);
    }

    @Override
    public BankResponseDTO updateBank(BankRequestDTO bankRequestDTO) {
        logger.info("Updating bank with ID: {}", bankRequestDTO.getBankId());
        Bank bank = bankRepository.findById(bankRequestDTO.getBankId()).orElseThrow(() ->
                new BankRealtedException("Bank with ID : "
                        + bankRequestDTO.getBankId() + " is not found"));

        if (!bank.isActive()) {
            
            throw new BankRealtedException("Bank with ID : " + bankRequestDTO.getBankId() + " is not active");
        }

        bank.setFullName(bankRequestDTO.getFullName());
        bank.setAbbreviation(bankRequestDTO.getAbbreviation());
        bankRepository.save(bank);
        logger.info("Bank with ID: {} updated successfully", bankRequestDTO.getBankId());
        return mapper.bankEntityToResponse(bank);
    }

    @Override
    public BankResponseDTO activateBank(long bankId) {
        logger.info("Activating bank with ID: {}", bankId);
        Bank bank = bankRepository.findById(bankId).orElseThrow(() ->
                new BankRealtedException("Bank with ID : " + bankId + " is not found"));

        if (bank.isActive()) {
            throw new BankRealtedException("Bank with ID : " + bankId + " is already active");
        }

        bank.setActive(true);
        Bank updatedBank = bankRepository.save(bank);
        logger.info("Bank with ID: {} activated successfully", bankId);
        return mapper.bankEntityToResponse(updatedBank);
    }

    @Override
    public void deleteBankById(long bankId) {
        logger.info("Deleting bank with ID: {}", bankId);
        Bank bank = bankRepository.findById(bankId).orElseThrow(() ->
                new BankRealtedException("Bank with ID : " + bankId + " is not found"));

        if (!bank.isActive()) {
            throw new BankRealtedException("Bank with ID : " + bankId + " is already deleted");
        }

        bank.setActive(false);
        bank.getAccounts().forEach(account -> {
            Customer customer = account.getCustomer();
            double totalBalance = customer.getAccounts().stream()
                    .filter(singleAccount -> singleAccount.getBank().isActive() && singleAccount.isActive())
                    .mapToDouble(Account::getBalance)
                    .sum();
            customer.setTotalBalance(totalBalance);


            customerRepository.save(customer);
        });

        bankRepository.save(bank);
        logger.info("Bank with ID: {} deleted successfully", bankId);
    }

    @Override
    public PagedResponse<BankResponseDTO> searchBanks(Long bankId, String fullName, String abbreviation, Boolean active, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Bank> banks;

        if (bankId != null) {
            banks = bankRepository.findByBankId(bankId, pageable);
        } else {
            banks = bankRepository.findByCriteria(fullName, abbreviation, active, pageable);
        }

        if (banks.getContent().isEmpty()) {
            throw new BankRealtedException("No Banks Found");
        }

        List<BankResponseDTO> bankResponseDTOS = mapper.getBankResponseList(banks.getContent());
        return new PagedResponse<>(bankResponseDTOS, banks.getNumber(), banks.getNumberOfElements(),
                banks.getTotalElements(), banks.getTotalPages(), banks.isLast());
    }

}
