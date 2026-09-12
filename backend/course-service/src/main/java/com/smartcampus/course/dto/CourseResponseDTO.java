package com.smartcampus.course.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponseDTO {

    private Long id;
    private Long collegeId;
    private Long departmentId;
    private String courseCode;
    private String courseName;
    private String description;
    private String department;
    private String program;
    private Integer credits;
    private Integer semester;
    private String academicYear;
    private String theoryPractical;
    private String courseType;
    private Integer capacity;
    private String prerequisites;
    private String assignedFaculty;
    private String courseStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
