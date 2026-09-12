package com.smartcampus.college.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "College ID is required")
    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @NotNull(message = "Semester ID is required")
    @Column(name = "semester_id", nullable = false)
    private Long semesterId;

    @NotBlank(message = "Section name is required (e.g. Section A)")
    @Column(name = "section_name", nullable = false, length = 30)
    private String sectionName;

    private Integer capacity;
}
