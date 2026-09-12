package com.smartcampus.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequestDTO {

    private Long collegeId;
    private Long departmentId;

    @NotBlank(message = "Student number is required")
    private String studentNumber;

    private String admissionNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String bloodGroup;
    private String parentGuardianInfo;
    private String emergencyContact;

    @NotBlank(message = "Department is required")
    private String department;

    private String program;

    @NotNull(message = "Year is required")
    private Integer year;

    private Integer semester;
    private String section;
    private LocalDate admissionDate;
    private String studentStatus;
    private String profileInformation;
}
