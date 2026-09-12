package com.smartcampus.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequestDTO {

    private Long collegeId;

    @NotBlank(message = "Attendance code is required")
    private String attendanceCode;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private LocalDate attendanceDate;

    @NotBlank(message = "Attendance status is required")
    private String status;

    private Integer semester;
    private String academicYear;
    private String attendanceType;
    private String remarks;
}
