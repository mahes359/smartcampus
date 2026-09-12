package com.smartcampus.course.service;

import com.smartcampus.course.entity.Course;
import com.smartcampus.course.exception.CourseNotFoundException;
import com.smartcampus.course.exception.DuplicateCourseException;
import com.smartcampus.course.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new DuplicateCourseException("Course code already exists: " + course.getCourseCode());
        }
        return courseRepository.save(course);
    }

    public Course getById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getCoursesByCollege(Long collegeId) {
        if (collegeId != null) {
            return courseRepository.findByCollegeId(collegeId);
        }
        return courseRepository.findAll();
    }

    public Course updateCourse(Long id, Course updatedCourse) {
        Course existingCourse = getById(id);

        if (!existingCourse.getCourseCode().equals(updatedCourse.getCourseCode()) &&
            courseRepository.existsByCourseCode(updatedCourse.getCourseCode())) {
            throw new DuplicateCourseException("Course code already exists: " + updatedCourse.getCourseCode());
        }

        if (updatedCourse.getCollegeId() != null) {
            existingCourse.setCollegeId(updatedCourse.getCollegeId());
        }
        if (updatedCourse.getDepartmentId() != null) {
            existingCourse.setDepartmentId(updatedCourse.getDepartmentId());
        }

        existingCourse.setCourseCode(updatedCourse.getCourseCode());
        existingCourse.setCourseName(updatedCourse.getCourseName());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setDepartment(updatedCourse.getDepartment());
        existingCourse.setProgram(updatedCourse.getProgram());
        existingCourse.setCredits(updatedCourse.getCredits());
        existingCourse.setSemester(updatedCourse.getSemester());
        existingCourse.setAcademicYear(updatedCourse.getAcademicYear());
        existingCourse.setTheoryPractical(updatedCourse.getTheoryPractical());
        existingCourse.setCourseType(updatedCourse.getCourseType());
        existingCourse.setCapacity(updatedCourse.getCapacity());
        existingCourse.setPrerequisites(updatedCourse.getPrerequisites());
        existingCourse.setAssignedFaculty(updatedCourse.getAssignedFaculty());
        existingCourse.setCourseStatus(updatedCourse.getCourseStatus());

        return courseRepository.save(existingCourse);
    }

    public void deleteCourse(Long id) {
        Course course = getById(id);
        courseRepository.delete(course);
    }
}
