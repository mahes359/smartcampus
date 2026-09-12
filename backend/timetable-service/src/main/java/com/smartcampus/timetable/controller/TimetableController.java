package com.smartcampus.timetable.controller;

import com.smartcampus.timetable.entity.TimetableSlot;
import com.smartcampus.timetable.repository.TimetableSlotRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableSlotRepository slotRepository;

    @PostConstruct
    public void seedInitialSlots() {
        if (slotRepository.count() == 0) {
            String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
            for (String day : days) {
                slotRepository.save(TimetableSlot.builder()
                        .collegeId(1L)
                        .dayOfWeek(day)
                        .startTime("09:00 AM")
                        .endTime("10:00 AM")
                        .courseCode("CS301")
                        .courseName("Cloud Architecture")
                        .facultyName("Dr. Alan Turing")
                        .roomNumber("Hall 304")
                        .section("A")
                        .build());
                slotRepository.save(TimetableSlot.builder()
                        .collegeId(1L)
                        .dayOfWeek(day)
                        .startTime("10:15 AM")
                        .endTime("11:15 AM")
                        .courseCode("CS402")
                        .courseName("Distributed Systems")
                        .facultyName("Prof. Grace Hopper")
                        .roomNumber("Lab 2B")
                        .section("A")
                        .build());
                slotRepository.save(TimetableSlot.builder()
                        .collegeId(1L)
                        .dayOfWeek(day)
                        .startTime("11:30 AM")
                        .endTime("12:30 PM")
                        .courseCode("CS409")
                        .courseName("Database Engineering")
                        .facultyName("Dr. Donald Knuth")
                        .roomNumber("Room 201")
                        .section("A")
                        .build());
            }
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "timetable-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Timetable Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/slots")
    public ResponseEntity<List<TimetableSlot>> getSlots(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) String dayOfWeek) {
        if (collegeId != null && dayOfWeek != null) {
            return ResponseEntity.ok(slotRepository.findByCollegeIdAndDayOfWeek(collegeId, dayOfWeek));
        } else if (collegeId != null) {
            return ResponseEntity.ok(slotRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(slotRepository.findAll());
    }

    @PostMapping("/slots")
    public ResponseEntity<TimetableSlot> createSlot(@RequestBody TimetableSlot slot) {
        if (slot.getCollegeId() == null) {
            slot.setCollegeId(1L);
        }
        TimetableSlot saved = slotRepository.save(slot);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<Map<String, Object>> deleteSlot(@PathVariable Long id) {
        slotRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Slot deleted successfully");
        return ResponseEntity.ok(res);
    }
}