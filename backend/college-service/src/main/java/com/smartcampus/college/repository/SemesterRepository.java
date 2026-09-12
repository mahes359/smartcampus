package com.smartcampus.college.repository;

import com.smartcampus.college.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    List<Semester> findByCollegeId(Long collegeId);
    List<Semester> findByCollegeIdAndProgramId(Long collegeId, Long programId);
}
