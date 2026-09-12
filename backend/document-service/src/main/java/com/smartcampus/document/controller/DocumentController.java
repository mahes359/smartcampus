package com.smartcampus.document.controller;

import com.smartcampus.document.entity.DocumentItem;
import com.smartcampus.document.repository.DocumentItemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentItemRepository documentRepository;

    @PostConstruct
    public void seedInitialDocuments() {
        if (documentRepository.count() == 0) {
            documentRepository.save(DocumentItem.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .title("High School Leaving Certificate & Marksheet")
                    .documentType("CERTIFICATE")
                    .uploadDate("2024-08-14")
                    .status("VERIFIED")
                    .build());
            documentRepository.save(DocumentItem.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .title("National Identity & Passport Copy")
                    .documentType("ID_PROOF")
                    .uploadDate("2024-08-15")
                    .status("VERIFIED")
                    .build());
            documentRepository.save(DocumentItem.builder()
                    .collegeId(1L)
                    .studentId(1L)
                    .title("Semester V Official Grade Transcript")
                    .documentType("TRANSCRIPT")
                    .uploadDate("2024-10-02")
                    .status("PENDING")
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "document-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Document Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping
    public ResponseEntity<List<DocumentItem>> getDocuments(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long studentId) {
        if (collegeId != null && studentId != null) {
            return ResponseEntity.ok(documentRepository.findByCollegeIdAndStudentId(collegeId, studentId));
        } else if (collegeId != null) {
            return ResponseEntity.ok(documentRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(documentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<DocumentItem> uploadDocument(@RequestBody DocumentItem item) {
        if (item.getCollegeId() == null) {
            item.setCollegeId(1L);
        }
        if (item.getStatus() == null) {
            item.setStatus("PENDING");
        }
        if (item.getUploadDate() == null) {
            item.setUploadDate(LocalDate.now().toString());
        }
        DocumentItem saved = documentRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<DocumentItem> verifyDocument(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return documentRepository.findById(id).map(doc -> {
            doc.setStatus(body.getOrDefault("status", "VERIFIED"));
            DocumentItem updated = documentRepository.save(doc);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDocument(@PathVariable Long id) {
        documentRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Document deleted successfully");
        return ResponseEntity.ok(res);
    }
}