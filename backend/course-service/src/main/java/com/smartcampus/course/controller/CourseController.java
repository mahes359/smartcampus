package com.smartcampus.course.controller;

import com.smartcampus.course.dto.CourseRequestDTO;
import com.smartcampus.course.dto.CourseResponseDTO;
import com.smartcampus.course.entity.Course;
import com.smartcampus.course.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "course-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Course Microservice is operational (REST + SOAP)");
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public ResponseEntity<CourseResponseDTO> createCourse(@Valid @RequestBody CourseRequestDTO request) {
        Course course = mapDtoToEntity(request);
        Course saved = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapEntityToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses(@RequestParam(required = false) Long collegeId) {
        List<Course> list = courseService.getCoursesByCollege(collegeId);
        List<CourseResponseDTO> dtos = list.stream().map(this::mapEntityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Long id) {
        Course course = courseService.getById(id);
        return ResponseEntity.ok(mapEntityToDto(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequestDTO request) {
        Course course = mapDtoToEntity(request);
        Course updated = courseService.updateCourse(id, course);
        return ResponseEntity.ok(mapEntityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Course deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Course mapDtoToEntity(CourseRequestDTO dto) {
        return Course.builder()
                .collegeId(dto.getCollegeId())
                .departmentId(dto.getDepartmentId())
                .courseCode(dto.getCourseCode())
                .courseName(dto.getCourseName())
                .description(dto.getDescription())
                .department(dto.getDepartment())
                .program(dto.getProgram())
                .credits(dto.getCredits())
                .semester(dto.getSemester())
                .academicYear(dto.getAcademicYear())
                .theoryPractical(dto.getTheoryPractical())
                .courseType(dto.getCourseType())
                .capacity(dto.getCapacity())
                .prerequisites(dto.getPrerequisites())
                .assignedFaculty(dto.getAssignedFaculty())
                .courseStatus(dto.getCourseStatus())
                .build();
    }

    private CourseResponseDTO mapEntityToDto(Course c) {
        return CourseResponseDTO.builder()
                .id(c.getId())
                .collegeId(c.getCollegeId())
                .departmentId(c.getDepartmentId())
                .courseCode(c.getCourseCode())
                .courseName(c.getCourseName())
                .description(c.getDescription())
                .department(c.getDepartment())
                .program(c.getProgram())
                .credits(c.getCredits())
                .semester(c.getSemester())
                .academicYear(c.getAcademicYear())
                .theoryPractical(c.getTheoryPractical())
                .courseType(c.getCourseType())
                .capacity(c.getCapacity())
                .prerequisites(c.getPrerequisites())
                .assignedFaculty(c.getAssignedFaculty())
                .courseStatus(c.getCourseStatus())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
