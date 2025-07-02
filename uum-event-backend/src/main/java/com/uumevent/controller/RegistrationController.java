package com.uumevent.controller;

import com.uumevent.dto.RegistrationRequestDto;
import com.uumevent.dto.TicketDto;
import com.uumevent.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long eventId,
                                                @RequestBody RegistrationRequestDto requestDto,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        try {
            TicketDto ticket = registrationService.registerUserForEvent(eventId, userDetails.getUsername(), requestDto);
            return new ResponseEntity<>(ticket, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketDto>> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        List<TicketDto> tickets = registrationService.getTicketsForUser(userDetails.getUsername());
        return ResponseEntity.ok(tickets);
    }
}
