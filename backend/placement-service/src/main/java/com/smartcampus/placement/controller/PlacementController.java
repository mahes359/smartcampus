package com.smartcampus.placement.controller;

import com.smartcampus.placement.entity.PlacementDrive;
import com.smartcampus.placement.repository.PlacementDriveRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementDriveRepository driveRepository;

    @PostConstruct
    public void seedInitialDrives() {
        if (driveRepository.count() == 0) {
            driveRepository.save(PlacementDrive.builder()
                    .collegeId(1L)
                    .companyName("Google Cloud Systems")
                    .roleTitle("Cloud Platform Engineer")
                    .packageLPA(28.5)
                    .eligibilityCriteria("CGPA >= 8.0, 0 Backlogs, B.Tech CSE / IT")
                    .driveDate("2024-12-10")
                    .totalOpenings(8)
                    .status("UPCOMING")
                    .build());
            driveRepository.save(PlacementDrive.builder()
                    .collegeId(1L)
                    .companyName("Microsoft Azure Core")
                    .roleTitle("Software Engineer (Distributed Systems)")
                    .packageLPA(26.0)
                    .eligibilityCriteria("CGPA >= 7.5, All Engineering streams")
                    .driveDate("2024-12-18")
                    .totalOpenings(12)
                    .status("UPCOMING")
                    .build());
            driveRepository.save(PlacementDrive.builder()
                    .collegeId(1L)
                    .companyName("Amazon Web Services")
                    .roleTitle("Associate Solutions Architect")
                    .packageLPA(22.0)
                    .eligibilityCriteria("CGPA >= 7.0, CSE/ECE/EE")
                    .driveDate("2024-11-15")
                    .totalOpenings(15)
                    .status("ACTIVE")
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "placement-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Placement Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/drives")
    public ResponseEntity<List<PlacementDrive>> getDrives(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(driveRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(driveRepository.findAll());
    }

    @PostMapping("/drives")
    public ResponseEntity<PlacementDrive> createDrive(@RequestBody PlacementDrive drive) {
        if (drive.getCollegeId() == null) {
            drive.setCollegeId(1L);
        }
        if (drive.getStatus() == null) {
            drive.setStatus("UPCOMING");
        }
        PlacementDrive saved = driveRepository.save(drive);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/drives/{id}")
    public ResponseEntity<Map<String, Object>> deleteDrive(@PathVariable Long id) {
        driveRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Placement drive deleted successfully");
        return ResponseEntity.ok(res);
    }
}