package com.techlabs.app.repository;

import com.techlabs.app.entity.Bank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BankRepository extends JpaRepository<Bank,Long> {
    @Query("SELECT b FROM Bank b WHERE "
            + "(LOWER(b.abbreviation) LIKE LOWER(CONCAT('%', :abbreviation, '%')) OR :abbreviation IS NULL) AND "
            + "(LOWER(b.fullName) LIKE LOWER(CONCAT('%', :fullName, '%')) OR :fullName IS NULL) AND "
            + "(b.active = :active OR :active IS NULL)")
    Page<Bank> findByCriteria(@Param("fullName") String fullName,
                              @Param("abbreviation") String abbreviation,
                              @Param("active") Boolean active,
                              Pageable pageable);

    Page<Bank> findByBankId(Long bankId, Pageable pageable);

}
