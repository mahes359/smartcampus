package com.smartcampus.helpdesk.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "support_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private String ticketNumber;
    private String requesterName;
    private String category;
    private String subject;
    private String description;
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private String status;   // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    private String createdAt;
}
