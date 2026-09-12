package com.smartcampus.enrollment.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponseDTO {

    private Long id;
    private Long collegeId;
    private String enrollmentCode;
    private Long studentId;
    private Long courseId;
    private Integer semester;
    private String status;
    private LocalDate enrollmentDate;
    private String academicYear;
    private String enrollmentType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
