package com.techlabs.app.repository;

import com.techlabs.app.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByTransactionTimestampBetween(LocalDateTime startDateTimestamp, LocalDateTime endDateTimestamp);

    List<Transaction> findBySenderAccountNumber_AccountNumberAndTransactionTimestampBetween(
            long accountNumber, LocalDateTime startDate, LocalDateTime endDate);

    List<Transaction> findByReceiverAccountNumber_AccountNumberAndTransactionTimestampBetween(
            long accountNumber, LocalDateTime startDate, LocalDateTime endDate);


    @Query("SELECT t FROM Transaction t " +
            "WHERE (:transactionId IS NULL OR t.transactionId = :transactionId) " +
            "AND (:senderAccountNumber IS NULL OR t.senderAccountNumber.accountNumber = :senderAccountNumber) " +
            "AND (:receiverAccountNumber IS NULL OR t.receiverAccountNumber.accountNumber = :receiverAccountNumber) " +
            "AND (:startDate IS NULL OR :endDate IS NULL OR t.transactionTimestamp BETWEEN :startDate AND :endDate) " +
            "AND (:minAmount IS NULL OR t.amount >= :minAmount) " +
            "AND (:maxAmount IS NULL OR t.amount <= :maxAmount) " +
            "ORDER BY t.transactionId ASC")
    Page<Transaction> searchTransactions(
            @Param("transactionId") Long transactionId,
            @Param("senderAccountNumber") Long senderAccountNumber,
            @Param("receiverAccountNumber") Long receiverAccountNumber,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            Pageable pageable);

    Page<Transaction> findAll(Pageable pageable);

}
