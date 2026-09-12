package com.smartcampus.placement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "placement_drives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private String companyName;
    private String roleTitle;
    private Double packageLPA;
    private String eligibilityCriteria;
    private String driveDate;
    private Integer totalOpenings;
    private String status; // UPCOMING, ACTIVE, COMPLETED
}
