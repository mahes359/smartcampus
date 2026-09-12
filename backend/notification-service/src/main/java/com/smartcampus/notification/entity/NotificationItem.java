package com.smartcampus.notification.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private String title;
    private String message;
    private String type; // ANNOUNCEMENT, EXAM, FEE, ATTENDANCE, SYSTEM
    private String timestamp;
    private Boolean isRead;
}
