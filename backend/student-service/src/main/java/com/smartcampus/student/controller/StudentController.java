package com.smartcampus.student.controller;

import com.smartcampus.student.dto.StudentRequestDTO;
import com.smartcampus.student.dto.StudentResponseDTO;
import com.smartcampus.student.entity.Student;
import com.smartcampus.student.service.StudentService;
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
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "student-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Student Microservice is operational (REST + SOAP)");
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@Valid @RequestBody StudentRequestDTO request) {
        Student student = mapDtoToEntity(request);
        Student saved = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapEntityToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents(@RequestParam(required = false) Long collegeId) {
        List<Student> students = studentService.getStudentsByCollege(collegeId);
        List<StudentResponseDTO> dtos = students.stream().map(this::mapEntityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        Student student = studentService.getById(id);
        return ResponseEntity.ok(mapEntityToDto(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequestDTO request) {
        Student student = mapDtoToEntity(request);
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(mapEntityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Student deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Student mapDtoToEntity(StudentRequestDTO dto) {
        return Student.builder()
                .collegeId(dto.getCollegeId())
                .departmentId(dto.getDepartmentId())
                .studentNumber(dto.getStudentNumber())
                .admissionNumber(dto.getAdmissionNumber())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .country(dto.getCountry())
                .bloodGroup(dto.getBloodGroup())
                .parentGuardianInfo(dto.getParentGuardianInfo())
                .emergencyContact(dto.getEmergencyContact())
                .department(dto.getDepartment())
                .program(dto.getProgram())
                .year(dto.getYear())
                .semester(dto.getSemester())
                .section(dto.getSection())
                .admissionDate(dto.getAdmissionDate())
                .studentStatus(dto.getStudentStatus())
                .profileInformation(dto.getProfileInformation())
                .build();
    }

    private StudentResponseDTO mapEntityToDto(Student s) {
        return StudentResponseDTO.builder()
                .id(s.getId())
                .collegeId(s.getCollegeId())
                .departmentId(s.getDepartmentId())
                .studentNumber(s.getStudentNumber())
                .admissionNumber(s.getAdmissionNumber())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .dateOfBirth(s.getDateOfBirth())
                .gender(s.getGender())
                .email(s.getEmail())
                .phone(s.getPhone())
                .address(s.getAddress())
                .city(s.getCity())
                .state(s.getState())
                .country(s.getCountry())
                .bloodGroup(s.getBloodGroup())
                .parentGuardianInfo(s.getParentGuardianInfo())
                .emergencyContact(s.getEmergencyContact())
                .department(s.getDepartment())
                .program(s.getProgram())
                .year(s.getYear())
                .semester(s.getSemester())
                .section(s.getSection())
                .admissionDate(s.getAdmissionDate())
                .studentStatus(s.getStudentStatus())
                .profileInformation(s.getProfileInformation())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
