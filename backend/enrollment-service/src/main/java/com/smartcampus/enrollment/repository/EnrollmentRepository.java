package com.smartcampus.enrollment.repository;

import com.smartcampus.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByEnrollmentCode(String enrollmentCode);

    boolean existsByEnrollmentCode(String enrollmentCode);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    List<Enrollment> findByStudentId(Long studentId);

    List<Enrollment> findByCourseId(Long courseId);

    // Multi-tenant query methods
    List<Enrollment> findByCollegeId(Long collegeId);

    Optional<Enrollment> findByCollegeIdAndId(Long collegeId, Long id);

    List<Enrollment> findByCollegeIdAndStudentId(Long collegeId, Long studentId);
}
