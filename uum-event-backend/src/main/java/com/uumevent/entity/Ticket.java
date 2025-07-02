package com.uumevent.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @Column(nullable = false, unique = true)
    private String qrCode;

    private String status; // e.g., "active", "used"
    private BigDecimal price;
    private String ticketType; // e.g., "regular", "vip"
    private Instant purchaseDate;

    @PrePersist
    protected void onCreate() {
        purchaseDate = Instant.now();
    }
}