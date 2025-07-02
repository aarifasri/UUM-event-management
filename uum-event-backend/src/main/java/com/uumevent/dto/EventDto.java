package com.uumevent.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventDto {
    private Long id;
    private String title;
    private String shortDescription;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private String venue;
    private String category;
    private BigDecimal price;
    private Integer maxAttendees;
    private Integer currentAttendees;
    private String imageUrl;
    private String status;
    private UserDto organizer;
    private List<String> tags;
}