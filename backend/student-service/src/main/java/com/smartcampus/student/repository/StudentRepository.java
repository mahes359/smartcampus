package com.smartcampus.student.repository;

import com.smartcampus.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentNumber(String studentNumber);

    boolean existsByStudentNumber(String studentNumber);

    boolean existsByEmail(String email);
    
    boolean existsByAdmissionNumber(String admissionNumber);

    // Multi-tenant methods
    List<Student> findByCollegeId(Long collegeId);

    Optional<Student> findByCollegeIdAndId(Long collegeId, Long id);

    Optional<Student> findByCollegeIdAndStudentNumber(Long collegeId, String studentNumber);

    List<Student> findByCollegeIdAndDepartment(Long collegeId, String department);
}
