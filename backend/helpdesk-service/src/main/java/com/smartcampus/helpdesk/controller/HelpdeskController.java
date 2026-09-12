package com.smartcampus.helpdesk.controller;

import com.smartcampus.helpdesk.entity.SupportTicket;
import com.smartcampus.helpdesk.repository.SupportTicketRepository;
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
@RequestMapping("/api/helpdesk")
@RequiredArgsConstructor
public class HelpdeskController {

    private final SupportTicketRepository ticketRepository;

    @PostConstruct
    public void seedInitialTickets() {
        if (ticketRepository.count() == 0) {
            ticketRepository.save(SupportTicket.builder()
                    .collegeId(1L)
                    .ticketNumber("TICK-8012")
                    .requesterName("Alex Mercer")
                    .category("IT & NETWORK")
                    .subject("Campus Wi-Fi authentication failure in Lab 3")
                    .description("Unable to connect to SmartCampus-Secure SSID from laptop.")
                    .priority("HIGH")
                    .status("IN_PROGRESS")
                    .createdAt("2024-11-08")
                    .build());
            ticketRepository.save(SupportTicket.builder()
                    .collegeId(1L)
                    .requesterName("Prof. Hopper")
                    .ticketNumber("TICK-8013")
                    .category("FACILITIES")
                    .subject("Hostel Room 204 Air Conditioning malfunction")
                    .description("AC cooling compressor is noisy and not cooling effectively.")
                    .priority("MEDIUM")
                    .status("OPEN")
                    .createdAt("2024-11-09")
                    .build());
            ticketRepository.save(SupportTicket.builder()
                    .collegeId(1L)
                    .requesterName("David Miller")
                    .ticketNumber("TICK-7988")
                    .category("ACCOUNTS")
                    .subject("Tuition receipt payment gateway duplicate debit")
                    .description("Bank account debited twice during online fee payment.")
                    .priority("URGENT")
                    .status("RESOLVED")
                    .createdAt("2024-11-02")
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "helpdesk-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Helpdesk Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicket>> getTickets(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(ticketRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicket> createTicket(@RequestBody SupportTicket ticket) {
        if (ticket.getCollegeId() == null) {
            ticket.setCollegeId(1L);
        }
        if (ticket.getTicketNumber() == null) {
            ticket.setTicketNumber("TICK-" + (1000 + (int)(Math.random() * 9000)));
        }
        if (ticket.getStatus() == null) {
            ticket.setStatus("OPEN");
        }
        if (ticket.getCreatedAt() == null) {
            ticket.setCreatedAt(LocalDate.now().toString());
        }
        SupportTicket saved = ticketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/tickets/{id}/status")
    public ResponseEntity<SupportTicket> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ticketRepository.findById(id).map(t -> {
            t.setStatus(body.getOrDefault("status", "OPEN"));
            SupportTicket updated = ticketRepository.save(t);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<Map<String, Object>> deleteTicket(@PathVariable Long id) {
        ticketRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Ticket deleted successfully");
        return ResponseEntity.ok(res);
    }
}