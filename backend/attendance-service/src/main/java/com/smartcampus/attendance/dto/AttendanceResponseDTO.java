package com.smartcampus.attendance.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponseDTO {

    private Long id;
    private Long collegeId;
    private String attendanceCode;
    private Long studentId;
    private Long courseId;
    private LocalDate attendanceDate;
    private String status;
    private Integer semester;
    private String academicYear;
    private String attendanceType;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
