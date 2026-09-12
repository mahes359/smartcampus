package com.smartcampus.faculty.controller;

import com.smartcampus.faculty.dto.FacultyRequestDTO;
import com.smartcampus.faculty.dto.FacultyResponseDTO;
import com.smartcampus.faculty.entity.Faculty;
import com.smartcampus.faculty.service.FacultyService;
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
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "faculty-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Faculty Microservice is operational (REST + SOAP)");
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public ResponseEntity<FacultyResponseDTO> createFaculty(@Valid @RequestBody FacultyRequestDTO request) {
        Faculty faculty = mapDtoToEntity(request);
        Faculty saved = facultyService.createFaculty(faculty);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapEntityToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<FacultyResponseDTO>> getAllFaculty(@RequestParam(required = false) Long collegeId) {
        List<Faculty> list = facultyService.getFacultyByCollege(collegeId);
        List<FacultyResponseDTO> dtos = list.stream().map(this::mapEntityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyResponseDTO> getFacultyById(@PathVariable Long id) {
        Faculty faculty = facultyService.getById(id);
        return ResponseEntity.ok(mapEntityToDto(faculty));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyResponseDTO> updateFaculty(@PathVariable Long id, @Valid @RequestBody FacultyRequestDTO request) {
        Faculty faculty = mapDtoToEntity(request);
        Faculty updated = facultyService.updateFaculty(id, faculty);
        return ResponseEntity.ok(mapEntityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Faculty deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Faculty mapDtoToEntity(FacultyRequestDTO dto) {
        return Faculty.builder()
                .collegeId(dto.getCollegeId())
                .departmentId(dto.getDepartmentId())
                .employeeNumber(dto.getEmployeeNumber())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .department(dto.getDepartment())
                .designation(dto.getDesignation())
                .qualification(dto.getQualification())
                .specialization(dto.getSpecialization())
                .joiningDate(dto.getJoiningDate())
                .facultyStatus(dto.getFacultyStatus())
                .officeRoom(dto.getOfficeRoom())
                .facultyRole(dto.getFacultyRole())
                .build();
    }

    private FacultyResponseDTO mapEntityToDto(Faculty f) {
        return FacultyResponseDTO.builder()
                .id(f.getId())
                .collegeId(f.getCollegeId())
                .departmentId(f.getDepartmentId())
                .employeeNumber(f.getEmployeeNumber())
                .firstName(f.getFirstName())
                .lastName(f.getLastName())
                .email(f.getEmail())
                .phone(f.getPhone())
                .department(f.getDepartment())
                .designation(f.getDesignation())
                .qualification(f.getQualification())
                .specialization(f.getSpecialization())
                .joiningDate(f.getJoiningDate())
                .facultyStatus(f.getFacultyStatus())
                .officeRoom(f.getOfficeRoom())
                .facultyRole(f.getFacultyRole())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .build();
    }
}
