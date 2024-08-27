package com.techlabs.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private LocalDateTime transactionTimestamp;

    @NotNull
    @Column(nullable = false)
    private double amount;

    @ManyToOne
    @JoinColumn(name = "sender_account")
    private Account senderAccountNumber;

    @ManyToOne
    @JoinColumn(name = "receiver_account")
    private Account receiverAccountNumber;
}