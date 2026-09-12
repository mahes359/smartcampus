package com.smartcampus.timetable.repository;

import com.smartcampus.timetable.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findByCollegeId(Long collegeId);
    List<TimetableSlot> findByCollegeIdAndDayOfWeek(Long collegeId, String dayOfWeek);
}
