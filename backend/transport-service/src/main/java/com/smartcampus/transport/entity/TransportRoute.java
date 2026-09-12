package com.smartcampus.transport.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transport_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransportRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private String routeCode;
    private String routeName;
    private String busNumber;
    private String driverName;
    private String driverPhone;
    private Integer totalStops;
    private Double annualFee;
}
