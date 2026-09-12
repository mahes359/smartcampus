package com.smartcampus.hostel.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hostel_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private String blockName;
    private String roomNumber;
    private Integer capacity;
    private Integer occupied;
    private Double monthlyFee;
}
