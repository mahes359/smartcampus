package com.smartcampus.event.controller;

import com.smartcampus.event.entity.CampusEvent;
import com.smartcampus.event.repository.CampusEventRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final CampusEventRepository eventRepository;

    @PostConstruct
    public void seedInitialEvents() {
        if (eventRepository.count() == 0) {
            eventRepository.save(CampusEvent.builder()
                    .collegeId(1L)
                    .title("Annual SmartCampus Hackathon 2024")
                    .eventType("TECH")
                    .eventDate("2024-11-22")
                    .venue("Innovation & Incubation Center")
                    .organizer("Department of Computer Science")
                    .description("48-hour competitive sprint building generative AI and cloud microservices.")
                    .build());
            eventRepository.save(CampusEvent.builder()
                    .collegeId(1L)
                    .title("International Cloud & Microservices Summit")
                    .eventType("ACADEMIC")
                    .eventDate("2024-12-05")
                    .venue("Main University Auditorium")
                    .organizer("Faculty Research Council")
                    .description("Distinguished keynotes by IEEE fellows on distributed systems reliability.")
                    .build());
            eventRepository.save(CampusEvent.builder()
                    .collegeId(1L)
                    .title("Inter-College Sports Championship")
                    .eventType("SPORTS")
                    .eventDate("2024-12-12")
                    .venue("Campus Athletic Complex")
                    .organizer("Athletics Directorate")
                    .description("Track, field, basketball, and soccer tournaments.")
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "event-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Event Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping
    public ResponseEntity<List<CampusEvent>> getEvents(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(eventRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<CampusEvent> createEvent(@RequestBody CampusEvent event) {
        if (event.getCollegeId() == null) {
            event.setCollegeId(1L);
        }
        CampusEvent saved = eventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Event deleted successfully");
        return ResponseEntity.ok(res);
    }
}