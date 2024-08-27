package com.techlabs.app.repository;

import com.techlabs.app.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Page<Account> findAllByBankActive(boolean active, Pageable pageable);

    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    Page<Account> findByAccountNumber(@Param("accountNumber") Long accountNumber, Pageable pageable);

    @Query("SELECT a FROM Account a WHERE " +
            "(:minBalance IS NULL OR a.balance >= :minBalance) AND " +
            "(:maxBalance IS NULL OR a.balance <= :maxBalance) AND " +
            "(:bankName IS NULL OR LOWER (a.bank.fullName) LIKE LOWER(CONCAT('%', :bankName, '%'))) AND " +
            "(:activeStatus IS NULL OR a.active = :activeStatus)")
    Page<Account> findByCriteria(@Param("minBalance") Double minBalance,
                                 @Param("maxBalance") Double maxBalance,
                                 @Param("bankName") String bankName,
                                 @Param("activeStatus") Boolean activeStatus,
                                 Pageable pageable);

}
