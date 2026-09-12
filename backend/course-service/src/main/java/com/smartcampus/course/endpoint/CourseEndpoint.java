package com.smartcampus.course.endpoint;

import com.smartcampus.course.entity.Course;
import com.smartcampus.course.service.CourseService;
import com.smartcampus.course.soap.*;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class CourseEndpoint {

    private static final String NAMESPACE = "http://college.com/course";

    private final CourseService courseService;

    public CourseEndpoint(CourseService courseService) {
        this.courseService = courseService;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "createCourseRequest")
    @ResponsePayload
    public CreateCourseResponse createCourse(@RequestPayload CreateCourseRequest request) {
        Course course = new Course();
        mapRequestToCourse(request.getCourseCode(), request.getCourseName(), request.getDescription(),
                request.getDepartment(), request.getProgram(), request.getCredits(), request.getSemester(),
                request.getAcademicYear(), request.getTheoryPractical(), request.getCourseType(),
                request.getCapacity(), request.getPrerequisites(), request.getAssignedFaculty(),
                request.getCourseStatus(), course);

        Course savedCourse = courseService.createCourse(course);

        CreateCourseResponse response = new CreateCourseResponse();
        response.setCourse(toSoapCourse(savedCourse));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getCourseRequest")
    @ResponsePayload
    public GetCourseResponse getCourse(@RequestPayload GetCourseRequest request) {
        Course course = courseService.getById(request.getCourseId());
        GetCourseResponse response = new GetCourseResponse();
        response.setCourse(toSoapCourse(course));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllCoursesRequest")
    @ResponsePayload
    public GetAllCoursesResponse getAllCourses(@RequestPayload GetAllCoursesRequest request) {
        List<Course> courses = courseService.getAllCourses();
        GetAllCoursesResponse response = new GetAllCoursesResponse();
        for (Course course : courses) {
            response.getCourses().add(toSoapCourse(course));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "updateCourseRequest")
    @ResponsePayload
    public UpdateCourseResponse updateCourse(@RequestPayload UpdateCourseRequest request) {
        Course course = new Course();
        mapRequestToCourse(request.getCourseCode(), request.getCourseName(), request.getDescription(),
                request.getDepartment(), request.getProgram(), request.getCredits(), request.getSemester(),
                request.getAcademicYear(), request.getTheoryPractical(), request.getCourseType(),
                request.getCapacity(), request.getPrerequisites(), request.getAssignedFaculty(),
                request.getCourseStatus(), course);

        Course updatedCourse = courseService.updateCourse(request.getCourseId(), course);

        UpdateCourseResponse response = new UpdateCourseResponse();
        response.setCourse(toSoapCourse(updatedCourse));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "deleteCourseRequest")
    @ResponsePayload
    public DeleteCourseResponse deleteCourse(@RequestPayload DeleteCourseRequest request) {
        courseService.deleteCourse(request.getCourseId());
        DeleteCourseResponse response = new DeleteCourseResponse();
        response.setSuccess(true);
        response.setMessage("Course deleted successfully");
        return response;
    }

    private void mapRequestToCourse(String courseCode, String courseName, String description,
                                    String department, String program, Integer credits, Integer semester,
                                    String academicYear, String theoryPractical, String courseType,
                                    Integer capacity, String prerequisites, String assignedFaculty,
                                    String courseStatus, Course course) {
        course.setCourseCode(courseCode);
        course.setCourseName(courseName);
        course.setDescription(description);
        course.setDepartment(department);
        course.setProgram(program);
        course.setCredits(credits);
        course.setSemester(semester);
        course.setAcademicYear(academicYear);
        course.setTheoryPractical(theoryPractical);
        course.setCourseType(courseType);
        course.setCapacity(capacity);
        course.setPrerequisites(prerequisites);
        course.setAssignedFaculty(assignedFaculty);
        course.setCourseStatus(courseStatus);
    }

    private com.smartcampus.course.soap.Course toSoapCourse(Course course) {
        com.smartcampus.course.soap.Course soapCourse = new com.smartcampus.course.soap.Course();
        soapCourse.setId(course.getId());
        soapCourse.setCourseCode(course.getCourseCode());
        soapCourse.setCourseName(course.getCourseName());
        soapCourse.setDescription(course.getDescription());
        soapCourse.setDepartment(course.getDepartment());
        soapCourse.setProgram(course.getProgram());
        soapCourse.setCredits(course.getCredits());
        soapCourse.setSemester(course.getSemester());
        soapCourse.setAcademicYear(course.getAcademicYear());
        soapCourse.setTheoryPractical(course.getTheoryPractical());
        soapCourse.setCourseType(course.getCourseType());
        soapCourse.setCapacity(course.getCapacity());
        soapCourse.setPrerequisites(course.getPrerequisites());
        soapCourse.setAssignedFaculty(course.getAssignedFaculty());
        soapCourse.setCourseStatus(course.getCourseStatus());
        return soapCourse;
    }
}
