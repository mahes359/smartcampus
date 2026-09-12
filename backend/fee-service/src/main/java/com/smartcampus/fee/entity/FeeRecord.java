package com.smartcampus.fee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fee_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private Long studentId;
    private String studentName;
    private String feeType;
    private Double totalAmount;
    private Double paidAmount;
    private String dueDate;
    private String status; // PAID, PARTIAL, PENDING, OVERDUE
}
