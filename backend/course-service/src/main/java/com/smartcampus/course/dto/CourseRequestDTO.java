package com.smartcampus.course.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequestDTO {

    private Long collegeId;
    private Long departmentId;

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    private String courseName;

    private String description;

    @NotBlank(message = "Department is required")
    private String department;

    private String program;

    @NotNull(message = "Credits must be specified")
    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 6, message = "Credits cannot exceed 6")
    private Integer credits;

    @NotNull(message = "Semester must be specified")
    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 8, message = "Semester cannot exceed 8")
    private Integer semester;

    private String academicYear;
    private String theoryPractical;
    private String courseType;
    private Integer capacity;
    private String prerequisites;
    private String assignedFaculty;
    private String courseStatus;
}
