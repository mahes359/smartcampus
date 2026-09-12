package com.smartcampus.attendance.repository;

import com.smartcampus.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByAttendanceCode(String attendanceCode);

    boolean existsByAttendanceCode(String attendanceCode);

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByCourseId(Long courseId);

    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);

    boolean existsByStudentIdAndCourseIdAndAttendanceDate(Long studentId, Long courseId, LocalDate attendanceDate);

    // Multi-tenant query methods
    List<Attendance> findByCollegeId(Long collegeId);

    Optional<Attendance> findByCollegeIdAndId(Long collegeId, Long id);

    List<Attendance> findByCollegeIdAndStudentId(Long collegeId, Long studentId);

    List<Attendance> findByCollegeIdAndCourseId(Long collegeId, Long courseId);
}
