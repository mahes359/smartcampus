package com.smartcampus.college.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "semesters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "College ID is required")
    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @NotNull(message = "Program ID is required")
    @Column(name = "program_id", nullable = false)
    private Long programId;

    @NotNull(message = "Academic year ID is required")
    @Column(name = "academic_year_id", nullable = false)
    private Long academicYearId;

    @NotNull(message = "Semester number is required")
    @Column(name = "semester_number", nullable = false)
    private Integer semesterNumber;

    @Column(length = 20)
    private String term; // ODD, EVEN, SUMMER
}
