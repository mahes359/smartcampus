package com.smartcampus.report.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "report-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Report Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestParam(required = false) Long collegeId) {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("collegeId", collegeId != null ? collegeId : 1L);
        summary.put("totalLearners", 1420);
        summary.put("activeFaculty", 84);
        summary.put("averageAttendancePercentage", 91.8);
        summary.put("annualTuitionCollected", 542000.0);
        summary.put("activePlacementDrives", 6);
        summary.put("openTickets", 4);
        summary.put("libraryBookCirculation", 380);
        return ResponseEntity.ok(summary);
    }
}