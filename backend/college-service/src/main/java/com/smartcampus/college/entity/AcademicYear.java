package com.smartcampus.college.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "academic_years")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "College ID is required")
    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @NotBlank(message = "Year name is required (e.g. 2026-2027)")
    @Column(name = "year_name", nullable = false, length = 30)
    private String yearName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Builder.Default
    @Column(name = "is_current", nullable = false)
    private Boolean isCurrent = false;
}
