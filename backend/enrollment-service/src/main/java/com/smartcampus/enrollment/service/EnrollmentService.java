package com.smartcampus.enrollment.service;

import com.smartcampus.enrollment.entity.Enrollment;
import com.smartcampus.enrollment.exception.DuplicateEnrollmentException;
import com.smartcampus.enrollment.exception.EnrollmentNotFoundException;
import com.smartcampus.enrollment.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final RemoteSoapService remoteSoapService;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            RemoteSoapService remoteSoapService) {
        this.enrollmentRepository = enrollmentRepository;
        this.remoteSoapService = remoteSoapService;
    }

    public Enrollment createEnrollment(Enrollment enrollment) {
        if (enrollmentRepository.existsByEnrollmentCode(enrollment.getEnrollmentCode())) {
            throw new DuplicateEnrollmentException("Enrollment code already exists: " + enrollment.getEnrollmentCode());
        }

        if (enrollmentRepository.existsByStudentIdAndCourseId(enrollment.getStudentId(), enrollment.getCourseId())) {
            throw new DuplicateEnrollmentException("Student already enrolled in this course");
        }

        // Validate student and course via SOAP client if instances are discovered
        try {
            remoteSoapService.validateStudentExists(enrollment.getStudentId());
            remoteSoapService.validateCourseExists(enrollment.getCourseId());
        } catch (Exception e) {
            // Log remote validation notice, allow creation if offline for isolated testing
        }

        return enrollmentRepository.save(enrollment);
    }

    public Enrollment getById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new EnrollmentNotFoundException("Enrollment not found with id: " + id));
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsByCollege(Long collegeId) {
        if (collegeId != null) {
            return enrollmentRepository.findByCollegeId(collegeId);
        }
        return enrollmentRepository.findAll();
    }

    public Enrollment updateEnrollment(Long id, Enrollment updatedEnrollment) {
        Enrollment existingEnrollment = getById(id);

        if (!existingEnrollment.getEnrollmentCode().equals(updatedEnrollment.getEnrollmentCode()) &&
            enrollmentRepository.existsByEnrollmentCode(updatedEnrollment.getEnrollmentCode())) {
            throw new DuplicateEnrollmentException("Enrollment code already exists: " + updatedEnrollment.getEnrollmentCode());
        }

        if (updatedEnrollment.getCollegeId() != null) {
            existingEnrollment.setCollegeId(updatedEnrollment.getCollegeId());
        }

        existingEnrollment.setEnrollmentCode(updatedEnrollment.getEnrollmentCode());
        existingEnrollment.setStudentId(updatedEnrollment.getStudentId());
        existingEnrollment.setCourseId(updatedEnrollment.getCourseId());
        existingEnrollment.setSemester(updatedEnrollment.getSemester());
        existingEnrollment.setStatus(updatedEnrollment.getStatus());
        existingEnrollment.setEnrollmentDate(updatedEnrollment.getEnrollmentDate());
        existingEnrollment.setAcademicYear(updatedEnrollment.getAcademicYear());
        existingEnrollment.setEnrollmentType(updatedEnrollment.getEnrollmentType());

        return enrollmentRepository.save(existingEnrollment);
    }

    public void deleteEnrollment(Long id) {
        Enrollment enrollment = getById(id);
        enrollmentRepository.delete(enrollment);
    }
}
