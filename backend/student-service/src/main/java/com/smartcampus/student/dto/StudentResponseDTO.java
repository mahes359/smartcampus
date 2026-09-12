package com.smartcampus.student.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDTO {

    private Long id;
    private Long collegeId;
    private Long departmentId;
    private String studentNumber;
    private String admissionNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String bloodGroup;
    private String parentGuardianInfo;
    private String emergencyContact;
    private String department;
    private String program;
    private Integer year;
    private Integer semester;
    private String section;
    private LocalDate admissionDate;
    private String studentStatus;
    private String profileInformation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
