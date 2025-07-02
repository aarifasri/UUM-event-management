package com.uumevent.repository;

import com.uumevent.entity.Ticket;
import com.uumevent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // A query to find tickets belonging to a specific user by joining through the registration
    @Query("SELECT t FROM Ticket t WHERE t.registration.user = :user")
    List<Ticket> findByUser(User user);
}
