package com.smartcampus.fee.repository;

import com.smartcampus.fee.entity.FeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRecordRepository extends JpaRepository<FeeRecord, Long> {
    List<FeeRecord> findByCollegeId(Long collegeId);
    List<FeeRecord> findByCollegeIdAndStudentId(Long collegeId, Long studentId);
}
