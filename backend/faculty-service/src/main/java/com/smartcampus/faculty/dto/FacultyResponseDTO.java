package com.smartcampus.faculty.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyResponseDTO {

    private Long id;
    private Long collegeId;
    private Long departmentId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private String qualification;
    private String specialization;
    private LocalDate joiningDate;
    private String facultyStatus;
    private String officeRoom;
    private String facultyRole;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
