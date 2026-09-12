package com.smartcampus.exam.controller;

import com.smartcampus.exam.dto.ExamRequestDTO;
import com.smartcampus.exam.dto.ExamResponseDTO;
import com.smartcampus.exam.entity.Exam;
import com.smartcampus.exam.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "exam-service",
                "version", "0.0.1-SNAPSHOT"
        ));
    }

    @PostMapping
    public ResponseEntity<ExamResponseDTO> createExam(@Valid @RequestBody ExamRequestDTO request) {
        Exam exam = new Exam();
        mapDtoToEntity(request, exam);
        Exam created = examService.createExam(exam);
        return new ResponseEntity<>(ExamResponseDTO.fromEntity(created), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExamResponseDTO>> getExams(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long courseId) {

        List<Exam> exams;
        if (collegeId != null) {
            exams = examService.getExamsByCollegeId(collegeId);
        } else if (courseId != null) {
            exams = examService.getExamsByCourseId(courseId);
        } else {
            exams = examService.getAllExams();
        }

        List<ExamResponseDTO> dtos = exams.stream()
                .map(ExamResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponseDTO> getExamById(@PathVariable Long id) {
        Exam exam = examService.getById(id);
        return ResponseEntity.ok(ExamResponseDTO.fromEntity(exam));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamResponseDTO> updateExam(@PathVariable Long id, @Valid @RequestBody ExamRequestDTO request) {
        Exam exam = new Exam();
        mapDtoToEntity(request, exam);
        Exam updated = examService.updateExam(id, exam);
        return ResponseEntity.ok(ExamResponseDTO.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Exam deleted successfully",
                "id", id
        ));
    }

    private void mapDtoToEntity(ExamRequestDTO dto, Exam exam) {
        if (dto.getCollegeId() != null) {
            exam.setCollegeId(dto.getCollegeId());
        }
        exam.setExamCode(dto.getExamCode());
        exam.setCourseId(dto.getCourseId());
        exam.setExamType(dto.getExamType());
        exam.setExamDate(dto.getExamDate());
        exam.setSemester(dto.getSemester());
        exam.setAcademicYear(dto.getAcademicYear());
        exam.setTotalMarks(dto.getTotalMarks());
        exam.setPassingMarks(dto.getPassingMarks());
        exam.setLocation(dto.getLocation());
        exam.setStatus(dto.getStatus());
    }
}
