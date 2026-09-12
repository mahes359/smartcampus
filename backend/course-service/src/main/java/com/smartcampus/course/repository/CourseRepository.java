package com.smartcampus.course.repository;

import com.smartcampus.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCourseCode(String courseCode);

    boolean existsByCourseCode(String courseCode);

    List<Course> findByDepartment(String department);

    List<Course> findBySemester(Integer semester);

    // Multi-tenant query methods
    List<Course> findByCollegeId(Long collegeId);

    Optional<Course> findByCollegeIdAndId(Long collegeId, Long id);

    Optional<Course> findByCollegeIdAndCourseCode(Long collegeId, String courseCode);

    List<Course> findByCollegeIdAndDepartment(Long collegeId, String department);
}
