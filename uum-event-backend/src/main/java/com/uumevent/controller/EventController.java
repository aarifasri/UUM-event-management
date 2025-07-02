// uum-event-backend/src/main/java/com/uumevent/controller/EventController.java
package com.uumevent.controller;

import com.uumevent.dto.EventDto;
import com.uumevent.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventDto eventDto, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            EventDto createdEvent = eventService.createEvent(eventDto, userDetails.getUsername());
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        List<EventDto> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/my-organized")
    public ResponseEntity<List<EventDto>> getMyOrganizedEvents(@AuthenticationPrincipal UserDetails userDetails) {
        List<EventDto> events = eventService.getEventsByOrganizer(userDetails.getUsername());
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody EventDto eventDto, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            EventDto updatedEvent = eventService.updateEvent(id, eventDto, userDetails.getUsername());
            return ResponseEntity.ok(updatedEvent);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        eventService.deleteEvent(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}