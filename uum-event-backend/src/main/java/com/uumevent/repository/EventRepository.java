// uum-event-backend/src/main/java/com/uumevent/repository/EventRepository.java
package com.uumevent.repository;

import com.uumevent.entity.Event;
import com.uumevent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);

    Optional<Event> findByTitleAndDateAndLocation(String title, LocalDate date, String location);

    // This method is essential for the update functionality to work correctly.
    Optional<Event> findByTitleAndDateAndLocationAndIdNot(String title, LocalDate date, String location, Long id);
}