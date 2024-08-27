package com.techlabs.app.service;

import com.techlabs.app.dto.BankRequestDTO;
import com.techlabs.app.dto.BankResponseDTO;
import com.techlabs.app.util.PagedResponse;

import java.util.List;

public interface BankService {
    PagedResponse<BankResponseDTO> getAllBanks(int page, int size, String sortBy, String direction);

    BankResponseDTO getBankById(long bankId);

    BankResponseDTO addNewBank(BankRequestDTO bankRequestDTO);

    BankResponseDTO updateBank(BankRequestDTO bankRequestDTO);

    void deleteBankById(long bankId);

    BankResponseDTO activateBank(long bankId);

    PagedResponse<BankResponseDTO> searchBanks(Long bankId, String fullName, String abbreviation, Boolean active, int page, int size, String sortBy, String direction);
}
