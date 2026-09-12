package com.smartcampus.college.repository;

import com.smartcampus.college.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    List<AcademicYear> findByCollegeId(Long collegeId);
    Optional<AcademicYear> findByCollegeIdAndIsCurrentTrue(Long collegeId);
}
