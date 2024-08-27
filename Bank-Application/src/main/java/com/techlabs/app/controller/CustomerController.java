package com.techlabs.app.controller;

import com.techlabs.app.dto.CustomerRequestDTO;
import com.techlabs.app.dto.CustomerResponseDTO;
import com.techlabs.app.service.CustomerService;
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
@RequestMapping("/api/customers")
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService customerService;

    @Operation(summary = "Get all customers")
    @GetMapping()
    public ResponseEntity<PagedResponse<CustomerResponseDTO>> getAllCustomers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "customerId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {
        logger.info("Fetching All The Customers");
        PagedResponse<CustomerResponseDTO> customerResponseDTOS = customerService.getAllCustomers(page, size, sortBy, direction);

        return new ResponseEntity<>(customerResponseDTOS, HttpStatus.OK);
    }

    @Operation(summary = "Get customer by ID")
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable(name = "customerId") long customerId) {
        logger.info("Fetching customer with ID: {}", customerId);
        CustomerResponseDTO customerResponseDTO = customerService.getCustomerById(customerId);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Add a new customer")
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> addNewCustomer(@Valid @RequestBody CustomerRequestDTO customerRequestDTO) {
        logger.info("Adding new customer");
        CustomerResponseDTO customerResponseDTO = customerService.addNewCustomer(customerRequestDTO);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.CREATED);
    }

    @Operation(summary = "Update customer details")
    @PutMapping
    public ResponseEntity<CustomerResponseDTO> updateCustomer(@Valid @RequestBody CustomerRequestDTO customerRequestDTO) {
        logger.info("Updating customer details");
        CustomerResponseDTO customerResponseDTO = customerService.updateCustomer(customerRequestDTO);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Activate a customer")
    @PutMapping("/activate/{customerId}")
    public ResponseEntity<CustomerResponseDTO> activateCustomer(@PathVariable(name = "customerId") long customerId) {
        logger.info("Activating customer");
        CustomerResponseDTO customerResponseDTO = customerService.activateCustomer(customerId);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }

    @Operation(summary = "Delete a customer by ID")
    @DeleteMapping("/{customerId}")
    public ResponseEntity<Object> deleteCustomer(@PathVariable(name = "customerId") long customerId) {
        logger.info("Deleting customer with ID: {}", customerId);
        customerService.deleteCustomer(customerId);
        return ResponseEntity.ok("Customer with ID: " + customerId + " deleted successfully");
    }

    @Operation(summary = "Searching based on ID, FirstName, LastName, activeStatus")
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<CustomerResponseDTO>> searchCustomers(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "customerId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction
    )
    {

        PagedResponse<CustomerResponseDTO> customers = customerService.searchCustomers(customerId, firstName,
                lastName, active, page, size,sortBy, direction);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @Operation(summary = "Get all active customers with no accounts")
    @GetMapping("/active-no-accounts")
    public ResponseEntity<PagedResponse<CustomerResponseDTO>> getActiveCustomersWithNoAccounts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "customerId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {
        logger.info("Fetching all active customers with no accounts");
        PagedResponse<CustomerResponseDTO> customerResponseDTOS = customerService.getActiveCustomersWithNoAccounts(page, size, sortBy, direction);
        return new ResponseEntity<>(customerResponseDTOS, HttpStatus.OK);
    }


}
