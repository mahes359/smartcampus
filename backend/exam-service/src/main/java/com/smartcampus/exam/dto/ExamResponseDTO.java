package com.smartcampus.exam.dto;

import com.smartcampus.exam.entity.Exam;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExamResponseDTO {

    private Long id;
    private Long collegeId;
    private String examCode;
    private Long courseId;
    private String examType;
    private LocalDate examDate;
    private Integer semester;
    private String academicYear;
    private Integer totalMarks;
    private Integer passingMarks;
    private String location;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExamResponseDTO() {
    }

    public static ExamResponseDTO fromEntity(Exam exam) {
        if (exam == null) return null;
        ExamResponseDTO dto = new ExamResponseDTO();
        dto.setId(exam.getId());
        dto.setCollegeId(exam.getCollegeId());
        dto.setExamCode(exam.getExamCode());
        dto.setCourseId(exam.getCourseId());
        dto.setExamType(exam.getExamType());
        dto.setExamDate(exam.getExamDate());
        dto.setSemester(exam.getSemester());
        dto.setAcademicYear(exam.getAcademicYear());
        dto.setTotalMarks(exam.getTotalMarks());
        dto.setPassingMarks(exam.getPassingMarks());
        dto.setLocation(exam.getLocation());
        dto.setStatus(exam.getStatus());
        dto.setCreatedAt(exam.getCreatedAt());
        dto.setUpdatedAt(exam.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getExamCode() { return examCode; }
    public void setExamCode(String examCode) { this.examCode = examCode; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public Integer getPassingMarks() { return passingMarks; }
    public void setPassingMarks(Integer passingMarks) { this.passingMarks = passingMarks; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
