package com.smartcampus.enrollment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Multi-tenant institution identifier
    @Column(name = "college_id")
    private Long collegeId;

    @NotBlank(message = "Enrollment code is required")
    @Size(min = 3, max = 30, message = "Enrollment code must be between 3 and 30 characters")
    @Column(name = "enrollment_code", nullable = false, unique = true, length = 30)
    private String enrollmentCode;

    @NotNull(message = "Student ID is required")
    @Min(value = 1, message = "Student ID must be positive")
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @NotNull(message = "Course ID is required")
    @Min(value = 1, message = "Course ID must be positive")
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 8, message = "Semester cannot exceed 8")
    @Column(nullable = false)
    private Integer semester;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status cannot exceed 20 characters")
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Column(name = "academic_year", length = 20)
    private String academicYear;

    @Column(name = "enrollment_type", length = 50)
    private String enrollmentType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (enrollmentDate == null) {
            enrollmentDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
