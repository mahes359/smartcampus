package com.smartcampus.leave.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private Long applicantId;
    private String applicantName;
    private String applicantType; // STUDENT, FACULTY
    private String leaveType; // MEDICAL, CASUAL, DUTY
    private String startDate;
    private String endDate;
    private String reason;
    private String status; // PENDING, APPROVED, REJECTED
}
