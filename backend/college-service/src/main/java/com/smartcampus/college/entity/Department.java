package com.smartcampus.college.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "departments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"college_id", "department_code"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "College ID is required")
    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @NotBlank(message = "Department code is required")
    @Column(name = "department_code", nullable = false, length = 30)
    private String departmentCode;

    @NotBlank(message = "Department name is required")
    @Column(name = "department_name", nullable = false, length = 150)
    private String departmentName;

    @Column(name = "hod_faculty_id")
    private Long hodFacultyId;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
