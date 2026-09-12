package com.smartcampus.event.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campus_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampusEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private String title;
    private String eventType; // TECH, ACADEMIC, SPORTS, CULTURAL
    private String eventDate;
    private String venue;
    private String organizer;
    private String description;
}
