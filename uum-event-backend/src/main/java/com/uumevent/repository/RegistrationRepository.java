package com.uumevent.repository;

import com.uumevent.entity.Event;
import com.uumevent.entity.Registration;
import com.uumevent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    // Check if a user is already registered for an event
    boolean existsByUserAndEvent(User user, Event event);
}