package com.smartcampus.leave.repository;

import com.smartcampus.leave.entity.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {
    List<LeaveApplication> findByCollegeId(Long collegeId);
    List<LeaveApplication> findByCollegeIdAndApplicantId(Long collegeId, Long applicantId);
}
