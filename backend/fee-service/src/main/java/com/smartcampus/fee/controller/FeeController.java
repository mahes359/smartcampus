package com.smartcampus.fee.controller;

import com.smartcampus.fee.entity.FeeRecord;
import com.smartcampus.fee.repository.FeeRecordRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeRecordRepository feeRepository;

    @PostConstruct
    public void seedInitialFees() {
        if (feeRepository.count() == 0) {
            feeRepository.save(FeeRecord.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .studentName("Alex Mercer")
                    .feeType("B.Tech Tuition Fee - Semester VI")
                    .totalAmount(4200.0)
                    .paidAmount(4200.0)
                    .dueDate("2024-11-30")
                    .status("PAID")
                    .build());
            feeRepository.save(FeeRecord.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .studentName("Alex Mercer")
                    .feeType("Campus Technology & Lab Infrastructure")
                    .totalAmount(650.0)
                    .paidAmount(650.0)
                    .dueDate("2024-11-30")
                    .status("PAID")
                    .build());
            feeRepository.save(FeeRecord.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .studentName("Alex Mercer")
                    .feeType("University Library & Online Databases")
                    .totalAmount(200.0)
                    .paidAmount(0.0)
                    .dueDate("2024-12-15")
                    .status("PENDING")
                    .build());
            feeRepository.save(FeeRecord.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .studentName("Alex Mercer")
                    .feeType("End-Term Examination Fee")
                    .totalAmount(150.0)
                    .paidAmount(0.0)
                    .dueDate("2024-12-01")
                    .status("PENDING")
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "fee-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus fee-service is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping
    public ResponseEntity<List<FeeRecord>> getFees(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long studentId) {
        if (collegeId != null && studentId != null) {
            return ResponseEntity.ok(feeRepository.findByCollegeIdAndStudentId(collegeId, studentId));
        } else if (collegeId != null) {
            return ResponseEntity.ok(feeRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(feeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<FeeRecord> createFee(@RequestBody FeeRecord fee) {
        if (fee.getCollegeId() == null) {
            fee.setCollegeId(1L);
        }
        if (fee.getPaidAmount() == null) {
            fee.setPaidAmount(0.0);
        }
        if (fee.getStatus() == null) {
            fee.setStatus(fee.getPaidAmount() >= fee.getTotalAmount() ? "PAID" : "PENDING");
        }
        FeeRecord saved = feeRepository.save(fee);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<FeeRecord> recordPayment(@PathVariable Long id, @RequestBody Map<String, Double> body) {
        return feeRepository.findById(id).map(f -> {
            Double amount = body.getOrDefault("amount", f.getTotalAmount());
            f.setPaidAmount(Math.min(f.getTotalAmount(), (f.getPaidAmount() != null ? f.getPaidAmount() : 0.0) + amount));
            if (f.getPaidAmount() >= f.getTotalAmount()) {
                f.setStatus("PAID");
            } else if (f.getPaidAmount() > 0) {
                f.setStatus("PARTIAL");
            }
            FeeRecord updated = feeRepository.save(f);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFee(@PathVariable Long id) {
        feeRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Fee record deleted successfully");
        return ResponseEntity.ok(res);
    }
}