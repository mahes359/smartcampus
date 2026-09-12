package com.smartcampus.college.repository;

import com.smartcampus.college.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCollegeId(Long collegeId);
    List<Section> findByCollegeIdAndSemesterId(Long collegeId, Long semesterId);
}
