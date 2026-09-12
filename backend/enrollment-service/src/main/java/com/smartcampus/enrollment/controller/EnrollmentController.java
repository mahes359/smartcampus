package com.smartcampus.enrollment.controller;

import com.smartcampus.enrollment.dto.EnrollmentRequestDTO;
import com.smartcampus.enrollment.dto.EnrollmentResponseDTO;
import com.smartcampus.enrollment.entity.Enrollment;
import com.smartcampus.enrollment.service.EnrollmentService;
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
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "enrollment-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Enrollment Microservice is operational (REST + SOAP)");
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> createEnrollment(@Valid @RequestBody EnrollmentRequestDTO request) {
        Enrollment entity = mapDtoToEntity(request);
        Enrollment saved = enrollmentService.createEnrollment(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapEntityToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments(@RequestParam(required = false) Long collegeId) {
        List<Enrollment> list = enrollmentService.getEnrollmentsByCollege(collegeId);
        List<EnrollmentResponseDTO> dtos = list.stream().map(this::mapEntityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> getEnrollmentById(@PathVariable Long id) {
        Enrollment enrollment = enrollmentService.getById(id);
        return ResponseEntity.ok(mapEntityToDto(enrollment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> updateEnrollment(@PathVariable Long id, @Valid @RequestBody EnrollmentRequestDTO request) {
        Enrollment entity = mapDtoToEntity(request);
        Enrollment updated = enrollmentService.updateEnrollment(id, entity);
        return ResponseEntity.ok(mapEntityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Enrollment deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Enrollment mapDtoToEntity(EnrollmentRequestDTO dto) {
        return Enrollment.builder()
                .collegeId(dto.getCollegeId())
                .enrollmentCode(dto.getEnrollmentCode())
                .studentId(dto.getStudentId())
                .courseId(dto.getCourseId())
                .semester(dto.getSemester())
                .status(dto.getStatus())
                .enrollmentDate(dto.getEnrollmentDate())
                .academicYear(dto.getAcademicYear())
                .enrollmentType(dto.getEnrollmentType())
                .build();
    }

    private EnrollmentResponseDTO mapEntityToDto(Enrollment e) {
        return EnrollmentResponseDTO.builder()
                .id(e.getId())
                .collegeId(e.getCollegeId())
                .enrollmentCode(e.getEnrollmentCode())
                .studentId(e.getStudentId())
                .courseId(e.getCourseId())
                .semester(e.getSemester())
                .status(e.getStatus())
                .enrollmentDate(e.getEnrollmentDate())
                .academicYear(e.getAcademicYear())
                .enrollmentType(e.getEnrollmentType())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
