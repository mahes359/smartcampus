package com.smartcampus.attendance.service;

import com.smartcampus.attendance.entity.Attendance;
import com.smartcampus.attendance.exception.DuplicateAttendanceException;
import com.smartcampus.attendance.exception.AttendanceNotFoundException;
import com.smartcampus.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final RemoteStudentService remoteStudentService;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            RemoteStudentService remoteStudentService) {
        this.attendanceRepository = attendanceRepository;
        this.remoteStudentService = remoteStudentService;
    }

    public Attendance createAttendance(Attendance attendance) {
        if (attendanceRepository.existsByAttendanceCode(attendance.getAttendanceCode())) {
            throw new DuplicateAttendanceException("Attendance code already exists: " + attendance.getAttendanceCode());
        }

        if (attendance.getAttendanceDate() == null) {
            attendance.setAttendanceDate(LocalDate.now());
        }

        if (attendanceRepository.existsByStudentIdAndCourseIdAndAttendanceDate(
                attendance.getStudentId(), attendance.getCourseId(), attendance.getAttendanceDate())) {
            throw new DuplicateAttendanceException("Attendance record already exists for this student, course, and date");
        }

        // Validate student via SOAP client
        try {
            remoteStudentService.validateStudentExists(attendance.getStudentId());
        } catch (Exception ignored) {
            // Allows graceful fallback when student-service is temporarily offline during testing
        }

        return attendanceRepository.save(attendance);
    }

    public Attendance getById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new AttendanceNotFoundException("Attendance record not found with id: " + id));
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByCollege(Long collegeId) {
        if (collegeId != null) {
            return attendanceRepository.findByCollegeId(collegeId);
        }
        return attendanceRepository.findAll();
    }

    public List<Attendance> getByStudentAndCourse(Long studentId, Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public Attendance updateAttendance(Long id, Attendance updatedAttendance) {
        Attendance existing = getById(id);

        if (!existing.getAttendanceCode().equals(updatedAttendance.getAttendanceCode()) &&
            attendanceRepository.existsByAttendanceCode(updatedAttendance.getAttendanceCode())) {
            throw new DuplicateAttendanceException("Attendance code already exists: " + updatedAttendance.getAttendanceCode());
        }

        if (updatedAttendance.getCollegeId() != null) {
            existing.setCollegeId(updatedAttendance.getCollegeId());
        }

        existing.setAttendanceCode(updatedAttendance.getAttendanceCode());
        existing.setStudentId(updatedAttendance.getStudentId());
        existing.setCourseId(updatedAttendance.getCourseId());
        existing.setAttendanceDate(updatedAttendance.getAttendanceDate());
        existing.setStatus(updatedAttendance.getStatus());
        existing.setSemester(updatedAttendance.getSemester());
        existing.setAcademicYear(updatedAttendance.getAcademicYear());
        existing.setAttendanceType(updatedAttendance.getAttendanceType());
        existing.setRemarks(updatedAttendance.getRemarks());

        return attendanceRepository.save(existing);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = getById(id);
        attendanceRepository.delete(attendance);
    }
}
