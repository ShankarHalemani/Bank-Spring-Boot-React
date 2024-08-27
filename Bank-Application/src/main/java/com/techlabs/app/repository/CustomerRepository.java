package com.techlabs.app.repository;

import com.techlabs.app.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Page<Customer> findByCustomerId(Long customerId, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE "
            + "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) OR :firstName IS NULL) AND "
            + "(LOWER(c.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')) OR :lastName IS NULL) AND "
            + "(c.active = :active OR :active IS NULL)")
    Page<Customer> findByCriteria(@Param("firstName") String firstName,
                                  @Param("lastName") String lastName,
                                  @Param("active") Boolean active,
                                  Pageable pageable);

    Page<Customer> findByActiveTrueAndAccountsIsEmpty(Pageable pageable);
}
