package com.smartcampus.leave.controller;

import com.smartcampus.leave.entity.LeaveApplication;
import com.smartcampus.leave.repository.LeaveApplicationRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveApplicationRepository leaveRepository;

    @PostConstruct
    public void seedInitialLeaves() {
        if (leaveRepository.count() == 0) {
            leaveRepository.save(LeaveApplication.builder()
                    .collegeId(1L)
                    .applicantId(1L)
                    .applicantName("Alex Mercer")
                    .applicantType("STUDENT")
                    .leaveType("MEDICAL")
                    .startDate("2024-11-04")
                    .endDate("2024-11-06")
                    .reason("Fever and physician-prescribed rest")
                    .status("APPROVED")
                    .build());
            leaveRepository.save(LeaveApplication.builder()
                    .collegeId(1L)
                    .applicantId(2L)
                    .applicantName("Dr. Alan Turing")
                    .applicantType("FACULTY")
                    .leaveType("DUTY")
                    .startDate("2024-11-18")
                    .endDate("2024-11-20")
                    .reason("Keynote lecture at International Cloud Summit")
                    .status("PENDING")
                    .build());
            leaveRepository.save(LeaveApplication.builder()
                    .collegeId(1L)
                    .applicantId(3L)
                    .applicantName("Sarah Jenkins")
                    .applicantType("STUDENT")
                    .leaveType("CASUAL")
                    .startDate("2024-10-12")
                    .endDate("2024-10-14")
                    .reason("Attending family wedding")
                    .status("APPROVED")
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "leave-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Leave Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping
    public ResponseEntity<List<LeaveApplication>> getLeaves(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long applicantId) {
        if (collegeId != null && applicantId != null) {
            return ResponseEntity.ok(leaveRepository.findByCollegeIdAndApplicantId(collegeId, applicantId));
        } else if (collegeId != null) {
            return ResponseEntity.ok(leaveRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(leaveRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<LeaveApplication> applyLeave(@RequestBody LeaveApplication application) {
        if (application.getCollegeId() == null) {
            application.setCollegeId(1L);
        }
        if (application.getStatus() == null) {
            application.setStatus("PENDING");
        }
        LeaveApplication saved = leaveRepository.save(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveApplication> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return leaveRepository.findById(id).map(app -> {
            app.setStatus(body.getOrDefault("status", "PENDING"));
            LeaveApplication updated = leaveRepository.save(app);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteLeave(@PathVariable Long id) {
        leaveRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Leave application deleted successfully");
        return ResponseEntity.ok(res);
    }
}