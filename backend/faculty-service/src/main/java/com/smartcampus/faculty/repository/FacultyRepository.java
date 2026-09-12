package com.smartcampus.faculty.repository;

import com.smartcampus.faculty.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByEmployeeNumber(String employeeNumber);

    boolean existsByEmployeeNumber(String employeeNumber);

    boolean existsByEmail(String email);

    // Multi-tenant query methods
    List<Faculty> findByCollegeId(Long collegeId);

    Optional<Faculty> findByCollegeIdAndId(Long collegeId, Long id);

    Optional<Faculty> findByCollegeIdAndEmployeeNumber(Long collegeId, String employeeNumber);

    List<Faculty> findByCollegeIdAndDepartment(Long collegeId, String department);
}
