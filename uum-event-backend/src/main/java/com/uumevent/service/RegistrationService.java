package com.uumevent.service;

import com.uumevent.dto.RegistrationRequestDto;
import com.uumevent.dto.TicketDto;
import com.uumevent.entity.*;
import com.uumevent.repository.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final TicketRepository ticketRepository;

    public RegistrationService(EventRepository eventRepository, UserRepository userRepository, RegistrationRepository registrationRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public TicketDto registerUserForEvent(Long eventId, String userEmail, RegistrationRequestDto requestDto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (registrationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalStateException("User already registered for this event.");
        }

        if (event.getCurrentAttendees() >= event.getMaxAttendees()) {
            throw new IllegalStateException("Event is sold out.");
        }

        // 1. Create the registration record
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus("confirmed");
        // You could also save the other requestDto details here if needed in the Registration entity
        Registration savedRegistration = registrationRepository.save(registration);

        // 2. Create the ticket
        Ticket ticket = new Ticket();
        ticket.setRegistration(savedRegistration);
        ticket.setQrCode(UUID.randomUUID().toString());
        ticket.setStatus("active");
        ticket.setPrice(event.getPrice());
        ticket.setTicketType("regular");
        Ticket savedTicket = ticketRepository.save(ticket);

        // 3. Update the event's attendee count
        event.setCurrentAttendees(event.getCurrentAttendees() + 1);
        eventRepository.save(event);

        return mapTicketToDto(savedTicket);
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getTicketsForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));
        return ticketRepository.findByUser(user).stream()
                .map(this::mapTicketToDto)
                .collect(Collectors.toList());
    }

     private TicketDto mapTicketToDto(Ticket ticket) {
        Event event = ticket.getRegistration().getEvent();
        return TicketDto.builder()
                .id(ticket.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate().toString())
                .eventLocation(event.getLocation())
                .purchaseDate(ticket.getPurchaseDate())
                .status(ticket.getStatus())
                .qrCode(ticket.getQrCode())
                .price(ticket.getPrice())
                .ticketType(ticket.getTicketType())
                // --- ADD THE FOLLOWING MAPPINGS ---
                .eventVenue(event.getVenue())
                .eventImageUrl(event.getImageUrl())
                .eventTime(event.getTime())
                .build();
    }
}