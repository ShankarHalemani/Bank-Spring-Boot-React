package com.techlabs.app.controller;

import com.techlabs.app.dto.BankRequestDTO;
import com.techlabs.app.dto.BankResponseDTO;
import com.techlabs.app.service.BankService;
import com.techlabs.app.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/banks")
public class BankController {

    private static final Logger logger = LoggerFactory.getLogger(BankController.class);

    @Autowired
    private BankService bankService;

    @Operation(summary = "Fetch All Banks")
    @GetMapping()
    public ResponseEntity<PagedResponse<BankResponseDTO>> getAllBanks(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "2") int size,
            @RequestParam(name = "sortBy", defaultValue = "bankId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction){
        logger.info("Getting All Bank Details");
        PagedResponse<BankResponseDTO> bankResponseDTOS= bankService.getAllBanks(page, size, sortBy, direction);

        return new ResponseEntity<>(bankResponseDTOS,HttpStatus.OK);
    }

    @Operation(summary = "Get bank by ID")
    @GetMapping("/{bankId}")
    public ResponseEntity<BankResponseDTO> getBankById(@PathVariable(name = "bankId") long bankId) {
        logger.info("Fetching bank with ID: {}", bankId);
        BankResponseDTO bankResponseDTO = bankService.getBankById(bankId);
        return new ResponseEntity<>(bankResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Add a new bank")
    @PostMapping
    public ResponseEntity<BankResponseDTO> addNewBank(@Valid @RequestBody BankRequestDTO bankRequestDTO) {
        logger.info("Adding new bank");
        BankResponseDTO bankResponseDTO = bankService.addNewBank(bankRequestDTO);
        return new ResponseEntity<>(bankResponseDTO, HttpStatus.CREATED);
    }

    @Operation(summary = "Update bank details")
    @PutMapping
    public ResponseEntity<BankResponseDTO> updateBank(@Valid @RequestBody BankRequestDTO bankRequestDTO) {
        logger.info("Updating bank details");
        BankResponseDTO bankResponseDTO = bankService.updateBank(bankRequestDTO);
        return new ResponseEntity<>(bankResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Activate a bank by ID")
    @PutMapping("/activate/{bankId}")
    public ResponseEntity<BankResponseDTO> activateBank(@PathVariable(name = "bankId") long bankId) {
        logger.info("Activating bank with ID: {}", bankId);
        BankResponseDTO bankResponseDTO = bankService.activateBank(bankId);
        return new ResponseEntity<>(bankResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Delete a bank by ID")
    @DeleteMapping("/{bankId}")
    public ResponseEntity<Object> deleteBankById(@PathVariable(name = "bankId") long bankId) {
        logger.info("Deleting bank with ID: {}", bankId);
        bankService.deleteBankById(bankId);
        return ResponseEntity.ok("Bank with ID: " + bankId + " deleted successfully");
    }

    @Operation(summary = "Search Banks based on ID, fullName, abbreviation, and active status")
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<BankResponseDTO>> searchBanks(
            @RequestParam(required = false) Long bankId,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String abbreviation,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "bankId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction
    ) {
        logger.info("Searching banks with criteria - bankId: {}, fullName: {}, abbreviation: {}, active: {}",
                bankId, fullName, abbreviation, active);

        PagedResponse<BankResponseDTO> banks = bankService.searchBanks(bankId, fullName, abbreviation, active, page, size, sortBy, direction);
        return new ResponseEntity<>(banks, HttpStatus.OK);
    }

}
