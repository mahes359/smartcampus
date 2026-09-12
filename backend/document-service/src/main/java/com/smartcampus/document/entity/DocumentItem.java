package com.smartcampus.document.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long collegeId;
    private Long studentId;
    private String title;
    private String documentType; // DEGREE, TRANSCRIPT, ID_PROOF, MEDICAL, CERTIFICATE
    private String uploadDate;
    private String status; // PENDING, VERIFIED, REJECTED
}
