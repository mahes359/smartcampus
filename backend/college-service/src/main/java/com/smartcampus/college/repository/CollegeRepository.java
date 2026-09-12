package com.smartcampus.college.repository;

import com.smartcampus.college.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByCollegeCode(String collegeCode);
    boolean existsByCollegeCode(String collegeCode);
}
