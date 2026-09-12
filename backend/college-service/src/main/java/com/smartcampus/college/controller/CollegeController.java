package com.smartcampus.college.controller;

import com.smartcampus.college.entity.*;
import com.smartcampus.college.service.CollegeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/colleges")
@RequiredArgsConstructor
public class CollegeController {

    private final CollegeService collegeService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "college-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Master College Multi-Tenant Microservice is operational");
        return ResponseEntity.ok(status);
    }

    // --- College Endpoints ---
    @PostMapping
    public ResponseEntity<College> createCollege(@Valid @RequestBody College college) {
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.createCollege(college));
    }

    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<College> getCollegeById(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

    // --- Department Endpoints ---
    @PostMapping("/{collegeId}/departments")
    public ResponseEntity<Department> createDepartment(@PathVariable Long collegeId, @Valid @RequestBody Department department) {
        department.setCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.createDepartment(department));
    }

    @GetMapping("/{collegeId}/departments")
    public ResponseEntity<List<Department>> getDepartments(@PathVariable Long collegeId) {
        return ResponseEntity.ok(collegeService.getDepartmentsByCollege(collegeId));
    }

    // --- Program Endpoints ---
    @PostMapping("/{collegeId}/programs")
    public ResponseEntity<Program> createProgram(@PathVariable Long collegeId, @Valid @RequestBody Program program) {
        program.setCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.createProgram(program));
    }

    @GetMapping("/{collegeId}/programs")
    public ResponseEntity<List<Program>> getPrograms(@PathVariable Long collegeId) {
        return ResponseEntity.ok(collegeService.getProgramsByCollege(collegeId));
    }

    // --- Academic Year Endpoints ---
    @PostMapping("/{collegeId}/academic-years")
    public ResponseEntity<AcademicYear> createAcademicYear(@PathVariable Long collegeId, @Valid @RequestBody AcademicYear academicYear) {
        academicYear.setCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.createAcademicYear(academicYear));
    }

    @GetMapping("/{collegeId}/academic-years")
    public ResponseEntity<List<AcademicYear>> getAcademicYears(@PathVariable Long collegeId) {
        return ResponseEntity.ok(collegeService.getAcademicYearsByCollege(collegeId));
    }

    // --- Semester Endpoints ---
    @PostMapping("/{collegeId}/semesters")
    public ResponseEntity<Semester> createSemester(@PathVariable Long collegeId, @Valid @RequestBody Semester semester) {
        semester.setCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.createSemester(semester));
    }

    @GetMapping("/{collegeId}/semesters")
    public ResponseEntity<List<Semester>> getSemesters(@PathVariable Long collegeId) {
        return ResponseEntity.ok(collegeService.getSemestersByCollege(collegeId));
    }

    // --- Section Endpoints ---
    @PostMapping("/{collegeId}/sections")
    public ResponseEntity<Section> createSection(@PathVariable Long collegeId, @Valid @RequestBody Section section) {
        section.setCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(collegeService.createSection(section));
    }

    @GetMapping("/{collegeId}/sections")
    public ResponseEntity<List<Section>> getSections(@PathVariable Long collegeId) {
        return ResponseEntity.ok(collegeService.getSectionsByCollege(collegeId));
    }
}
