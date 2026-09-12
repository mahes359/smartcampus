package com.smartcampus.attendance.controller;

import com.smartcampus.attendance.dto.AttendanceRequestDTO;
import com.smartcampus.attendance.dto.AttendanceResponseDTO;
import com.smartcampus.attendance.entity.Attendance;
import com.smartcampus.attendance.service.AttendanceService;
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
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "attendance-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Attendance Microservice is operational (REST + SOAP)");
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public ResponseEntity<AttendanceResponseDTO> recordAttendance(@Valid @RequestBody AttendanceRequestDTO request) {
        Attendance entity = mapDtoToEntity(request);
        Attendance saved = attendanceService.createAttendance(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapEntityToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceResponseDTO>> getAllAttendance(@RequestParam(required = false) Long collegeId) {
        List<Attendance> list = attendanceService.getAttendanceByCollege(collegeId);
        List<AttendanceResponseDTO> dtos = list.stream().map(this::mapEntityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceResponseDTO> getAttendanceById(@PathVariable Long id) {
        Attendance record = attendanceService.getById(id);
        return ResponseEntity.ok(mapEntityToDto(record));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<AttendanceResponseDTO>> getByStudentAndCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        List<Attendance> list = attendanceService.getByStudentAndCourse(studentId, courseId);
        List<AttendanceResponseDTO> dtos = list.stream().map(this::mapEntityToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceResponseDTO> updateAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceRequestDTO request) {
        Attendance entity = mapDtoToEntity(request);
        Attendance updated = attendanceService.updateAttendance(id, entity);
        return ResponseEntity.ok(mapEntityToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Attendance record deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Attendance mapDtoToEntity(AttendanceRequestDTO dto) {
        return Attendance.builder()
                .collegeId(dto.getCollegeId())
                .attendanceCode(dto.getAttendanceCode())
                .studentId(dto.getStudentId())
                .courseId(dto.getCourseId())
                .attendanceDate(dto.getAttendanceDate())
                .status(dto.getStatus())
                .semester(dto.getSemester())
                .academicYear(dto.getAcademicYear())
                .attendanceType(dto.getAttendanceType())
                .remarks(dto.getRemarks())
                .build();
    }

    private AttendanceResponseDTO mapEntityToDto(Attendance a) {
        return AttendanceResponseDTO.builder()
                .id(a.getId())
                .collegeId(a.getCollegeId())
                .attendanceCode(a.getAttendanceCode())
                .studentId(a.getStudentId())
                .courseId(a.getCourseId())
                .attendanceDate(a.getAttendanceDate())
                .status(a.getStatus())
                .semester(a.getSemester())
                .academicYear(a.getAcademicYear())
                .attendanceType(a.getAttendanceType())
                .remarks(a.getRemarks())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
