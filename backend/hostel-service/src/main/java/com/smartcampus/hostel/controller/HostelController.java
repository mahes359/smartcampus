package com.smartcampus.hostel.controller;

import com.smartcampus.hostel.entity.HostelRoom;
import com.smartcampus.hostel.repository.HostelRoomRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hostel")
@RequiredArgsConstructor
public class HostelController {

    private final HostelRoomRepository roomRepository;

    @PostConstruct
    public void seedInitialRooms() {
        if (roomRepository.count() == 0) {
            roomRepository.save(HostelRoom.builder()
                    .collegeId(1L)
                    .blockName("Block A (Nelson Mandela Hall)")
                    .roomNumber("A-101")
                    .capacity(2)
                    .occupied(2)
                    .monthlyFee(250.0)
                    .build());
            roomRepository.save(HostelRoom.builder()
                    .collegeId(1L)
                    .blockName("Block A (Nelson Mandela Hall)")
                    .roomNumber("A-102")
                    .capacity(2)
                    .occupied(1)
                    .monthlyFee(250.0)
                    .build());
            roomRepository.save(HostelRoom.builder()
                    .collegeId(1L)
                    .blockName("Block B (Marie Curie Hall)")
                    .roomNumber("B-201")
                    .capacity(3)
                    .occupied(2)
                    .monthlyFee(200.0)
                    .build());
            roomRepository.save(HostelRoom.builder()
                    .collegeId(1L)
                    .blockName("Block C (Aryabhata Hall)")
                    .roomNumber("C-305")
                    .capacity(1)
                    .occupied(0)
                    .monthlyFee(350.0)
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "hostel-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Hostel Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<HostelRoom>> getRooms(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(roomRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @PostMapping("/rooms")
    public ResponseEntity<HostelRoom> createRoom(@RequestBody HostelRoom room) {
        if (room.getCollegeId() == null) {
            room.setCollegeId(1L);
        }
        if (room.getOccupied() == null) {
            room.setOccupied(0);
        }
        HostelRoom saved = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Map<String, Object>> deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Hostel room deleted successfully");
        return ResponseEntity.ok(res);
    }
}