package com.smartcampus.document.repository;

import com.smartcampus.document.entity.DocumentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentItemRepository extends JpaRepository<DocumentItem, Long> {
    List<DocumentItem> findByCollegeId(Long collegeId);
    List<DocumentItem> findByCollegeIdAndStudentId(Long collegeId, Long studentId);
}
