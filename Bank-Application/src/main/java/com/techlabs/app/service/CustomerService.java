package com.techlabs.app.service;

import com.techlabs.app.dto.CustomerRequestDTO;
import com.techlabs.app.dto.CustomerResponseDTO;
import com.techlabs.app.dto.RegisterDTO;
import com.techlabs.app.util.PagedResponse;

import java.util.List;

public interface CustomerService {
    PagedResponse<CustomerResponseDTO> getAllCustomers(int page, int size, String sortBy, String direction);

    CustomerResponseDTO getCustomerById(long customerId);

    CustomerResponseDTO addNewCustomer(CustomerRequestDTO customerRequestDTO);

    CustomerResponseDTO updateCustomer(CustomerRequestDTO customerRequestDTO);

    void deleteCustomer(long customerId);

    CustomerResponseDTO activateCustomer(long customerId);

    PagedResponse<CustomerResponseDTO> searchCustomers(Long customerId, String firstName, String lastName,
                                                       Boolean active, int page, int size, String sortBy, String direction);

    PagedResponse<CustomerResponseDTO> getActiveCustomersWithNoAccounts(int page, int size, String sortBy, String direction);
}
