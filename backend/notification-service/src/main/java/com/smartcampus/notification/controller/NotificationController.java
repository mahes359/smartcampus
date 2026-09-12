package com.smartcampus.notification.controller;

import com.smartcampus.notification.entity.NotificationItem;
import com.smartcampus.notification.repository.NotificationItemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationItemRepository notificationRepository;

    @PostConstruct
    public void seedInitialNotifications() {
        if (notificationRepository.count() == 0) {
            notificationRepository.save(NotificationItem.builder()
                    .collegeId(1L)
                    .title("End-Term Final Examination Schedule Published")
                    .message("The complete timetable for Fall Semester end-term examinations has been released. Download hall tickets from the Exam portal.")
                    .type("EXAM")
                    .timestamp("10 mins ago")
                    .isRead(false)
                    .build());
            notificationRepository.save(NotificationItem.builder()
                    .collegeId(1L)
                    .title("Tuition Fee Due Reminder - Semester VI")
                    .message("The final due date for clearing unpaid semester amenities fee is December 15, 2024. Late fines apply thereafter.")
                    .type("FEE")
                    .timestamp("2 hours ago")
                    .isRead(false)
                    .build());
            notificationRepository.save(NotificationItem.builder()
                    .collegeId(1L)
                    .title("SmartCampus Annual Hackathon Registration Open")
                    .message("Registrations for the 48-hour competitive innovation hackathon are now open for all departments.")
                    .type("ANNOUNCEMENT")
                    .timestamp("1 day ago")
                    .isRead(true)
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "notification-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Notification Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping
    public ResponseEntity<List<NotificationItem>> getNotifications(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(notificationRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<NotificationItem> createNotification(@RequestBody NotificationItem item) {
        if (item.getCollegeId() == null) {
            item.setCollegeId(1L);
        }
        if (item.getIsRead() == null) {
            item.setIsRead(false);
        }
        if (item.getTimestamp() == null) {
            item.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        NotificationItem saved = notificationRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationItem> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(n -> {
            n.setIsRead(true);
            NotificationItem updated = notificationRepository.save(n);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(res);
    }
}