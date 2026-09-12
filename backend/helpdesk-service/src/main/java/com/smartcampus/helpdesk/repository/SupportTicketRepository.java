package com.smartcampus.helpdesk.repository;

import com.smartcampus.helpdesk.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByCollegeId(Long collegeId);
}
