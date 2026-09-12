package com.smartcampus.transport.controller;

import com.smartcampus.transport.entity.TransportRoute;
import com.smartcampus.transport.repository.TransportRouteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transport")
@RequiredArgsConstructor
public class TransportController {

    private final TransportRouteRepository routeRepository;

    @PostConstruct
    public void seedInitialRoutes() {
        if (routeRepository.count() == 0) {
            routeRepository.save(TransportRoute.builder()
                    .collegeId(1L)
                    .routeCode("ROUTE-01")
                    .routeName("Downtown City Center Express")
                    .busNumber("BUS-104")
                    .driverName("Marcus Vance")
                    .driverPhone("+1 555-0321")
                    .totalStops(12)
                    .annualFee(450.0)
                    .build());
            routeRepository.save(TransportRoute.builder()
                    .collegeId(1L)
                    .routeCode("ROUTE-02")
                    .routeName("North Suburban Campus Line")
                    .busNumber("BUS-108")
                    .driverName("David Miller")
                    .driverPhone("+1 555-0322")
                    .totalStops(9)
                    .annualFee(380.0)
                    .build());
            routeRepository.save(TransportRoute.builder()
                    .collegeId(1L)
                    .routeCode("ROUTE-03")
                    .routeName("Metro Railway Transit Shuttle")
                    .busNumber("BUS-112")
                    .driverName("Samuel Jackson")
                    .driverPhone("+1 555-0323")
                    .totalStops(6)
                    .annualFee(320.0)
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "transport-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Transport Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/routes")
    public ResponseEntity<List<TransportRoute>> getRoutes(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(routeRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(routeRepository.findAll());
    }

    @PostMapping("/routes")
    public ResponseEntity<TransportRoute> createRoute(@RequestBody TransportRoute route) {
        if (route.getCollegeId() == null) {
            route.setCollegeId(1L);
        }
        TransportRoute saved = routeRepository.save(route);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<Map<String, Object>> deleteRoute(@PathVariable Long id) {
        routeRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Route deleted successfully");
        return ResponseEntity.ok(res);
    }
}
