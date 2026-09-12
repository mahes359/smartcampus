package com.smartcampus.student.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Multi-tenant institution identifier
    @Column(name = "college_id")
    private Long collegeId;

    @Column(name = "department_id")
    private Long departmentId;

    @NotBlank(message = "Student number is required")
    @Column(name = "student_number", nullable = false, unique = true)
    private String studentNumber;

    @Column(name = "admission_number")
    private String admissionNumber;

    @NotBlank(message = "First name is required")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    
    @Column(name = "blood_group")
    private String bloodGroup;
    
    @Column(name = "parent_guardian_info")
    private String parentGuardianInfo;
    
    @Column(name = "emergency_contact")
    private String emergencyContact;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    private String program;

    @NotNull(message = "Year is required")
    @Column(nullable = false)
    private Integer year;

    private Integer semester;
    private String section;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "student_status")
    private String studentStatus;

    @Column(name = "profile_information", columnDefinition = "TEXT")
    private String profileInformation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
