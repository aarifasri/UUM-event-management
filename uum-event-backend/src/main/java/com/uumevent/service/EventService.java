// uum-event-backend/src/main/java/com/uumevent/service/EventService.java
package com.uumevent.service;

import com.uumevent.dto.EventDto;
import com.uumevent.dto.UserDto;
import com.uumevent.entity.Event;
import com.uumevent.entity.Tag;
import com.uumevent.entity.User;
import com.uumevent.repository.EventRepository;
import com.uumevent.repository.TagRepository;
import com.uumevent.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository, TagRepository tagRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional
    public EventDto createEvent(EventDto eventDto, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Organizer not found with email: " + organizerEmail));

        eventRepository.findByTitleAndDateAndLocation(eventDto.getTitle(), eventDto.getDate(), eventDto.getLocation())
                .ifPresent(e -> {
                    throw new IllegalStateException("An event with the same title, date, and location already exists.");
                });

        Event event = new Event();
        mapDtoToEntity(eventDto, event, organizer);

        Event savedEvent = eventRepository.save(event);
        return mapEntityToDto(savedEvent);
    }

    @Transactional
    public EventDto updateEvent(Long id, EventDto eventDto, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Organizer not found with email: " + organizerEmail));

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            throw new AccessDeniedException("You are not the organizer of this event.");
        }

        eventRepository.findByTitleAndDateAndLocationAndIdNot(eventDto.getTitle(), eventDto.getDate(), eventDto.getLocation(), id)
                .ifPresent(e -> {
                    throw new IllegalStateException("An event with the same title, date, and location already exists.");
                });

        mapDtoToEntity(eventDto, event, organizer);
        Event updatedEvent = eventRepository.save(event);
        return mapEntityToDto(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Organizer not found with email: " + organizerEmail));

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            throw new AccessDeniedException("You are not the organizer of this event.");
        }

        eventRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto> getEventsByOrganizer(String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Organizer not found: " + organizerEmail));

        return eventRepository.findByOrganizer(organizer).stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    private void mapDtoToEntity(EventDto eventDto, Event event, User organizer) {
        event.setTitle(eventDto.getTitle());
        event.setShortDescription(eventDto.getShortDescription());
        event.setDescription(eventDto.getDescription());
        event.setDate(eventDto.getDate());
        event.setTime(eventDto.getTime());
        event.setLocation(eventDto.getLocation());
        event.setVenue(eventDto.getVenue());
        event.setCategory(eventDto.getCategory());
        event.setPrice(eventDto.getPrice());
        event.setMaxAttendees(eventDto.getMaxAttendees());
        event.setImageUrl(eventDto.getImageUrl());
        event.setStatus("upcoming");
        event.setOrganizer(organizer);

        Set<Tag> tags = new HashSet<>();
        if(eventDto.getTags() != null) {
            for (String tagName : eventDto.getTags()) {
                if(tagName == null || tagName.isBlank()) continue;
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return newTag;
                        });
                tags.add(tag);
            }
        }
        event.setTags(tags);
    }

    private EventDto mapEntityToDto(Event event) {
        EventDto eventDto = new EventDto();
        eventDto.setId(event.getId());
        eventDto.setTitle(event.getTitle());
        eventDto.setShortDescription(event.getShortDescription());
        eventDto.setDescription(event.getDescription());
        eventDto.setDate(event.getDate());
        eventDto.setTime(event.getTime());
        eventDto.setLocation(event.getLocation());
        eventDto.setVenue(event.getVenue());
        eventDto.setCategory(event.getCategory());
        eventDto.setPrice(event.getPrice());
        eventDto.setMaxAttendees(event.getMaxAttendees());
        eventDto.setCurrentAttendees(event.getCurrentAttendees());
        eventDto.setImageUrl(event.getImageUrl());
        eventDto.setStatus(event.getStatus());

        if (event.getTags() != null) {
            eventDto.setTags(event.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
        } else {
            eventDto.setTags(Collections.emptyList());
        }

        User organizer = event.getOrganizer();
        if (organizer != null) {
            UserDto organizerDto = UserDto.builder()
                    .id(organizer.getId())
                    .name(organizer.getName())
                    .email(organizer.getEmail())
                    .role(organizer.getRole())
                    .build();
            eventDto.setOrganizer(organizerDto);
        }

        return eventDto;
    }
}