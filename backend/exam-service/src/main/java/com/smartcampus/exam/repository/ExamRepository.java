package com.smartcampus.exam.repository;

import com.smartcampus.exam.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    boolean existsByExamCode(String examCode);

    boolean existsByCollegeIdAndExamCode(Long collegeId, String examCode);

    boolean existsByCourseIdAndExamType(Long courseId, String examType);

    List<Exam> findByCollegeId(Long collegeId);

    Optional<Exam> findByIdAndCollegeId(Long id, Long collegeId);

    List<Exam> findByCollegeIdAndCourseId(Long collegeId, Long courseId);

    List<Exam> findByCourseId(Long courseId);
}
