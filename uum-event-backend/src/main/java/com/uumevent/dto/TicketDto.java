// PATH: src/main/java/com/uumevent/dto/TicketDto.java

package com.uumevent.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime; // Import LocalTime

@Data
@Builder
public class TicketDto {
    private Long id;
    private String eventTitle;
    private String eventDate;
    private String eventLocation;
    private Instant purchaseDate;
    private String status;
    private String qrCode;
    private BigDecimal price;
    private String ticketType;

    // --- ADD THE FOLLOWING FIELDS ---
    private String eventVenue;
    private String eventImageUrl;
    private LocalTime eventTime;
}