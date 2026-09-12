package com.smartcampus.college.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "programs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "College ID is required")
    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @NotNull(message = "Department ID is required")
    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @NotBlank(message = "Program code is required")
    @Column(name = "program_code", nullable = false, length = 30)
    private String programCode;

    @NotBlank(message = "Program name is required")
    @Column(name = "program_name", nullable = false, length = 150)
    private String programName;

    @Column(name = "duration_years")
    private Integer durationYears;

    @Column(name = "total_semesters")
    private Integer totalSemesters;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
