package com.smartcampus.enrollment.endpoint;

import com.smartcampus.enrollment.entity.Enrollment;
import com.smartcampus.enrollment.service.EnrollmentService;
import com.smartcampus.enrollment.soap.*;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class EnrollmentEndpoint {

    private static final String NAMESPACE = "http://college.com/enrollment";

    private final EnrollmentService enrollmentService;

    public EnrollmentEndpoint(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "createEnrollmentRequest")
    @ResponsePayload
    public CreateEnrollmentResponse createEnrollment(@RequestPayload CreateEnrollmentRequest request) {
        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentCode(request.getEnrollmentCode());
        enrollment.setStudentId(request.getStudentId());
        enrollment.setCourseId(request.getCourseId());
        enrollment.setSemester(request.getSemester());
        enrollment.setStatus(request.getStatus());
        enrollment.setEnrollmentDate(request.getEnrollmentDate());
        enrollment.setAcademicYear(request.getAcademicYear());
        enrollment.setEnrollmentType(request.getEnrollmentType());

        Enrollment saved = enrollmentService.createEnrollment(enrollment);

        CreateEnrollmentResponse response = new CreateEnrollmentResponse();
        response.setEnrollment(toSoapEnrollment(saved));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getEnrollmentRequest")
    @ResponsePayload
    public GetEnrollmentResponse getEnrollment(@RequestPayload GetEnrollmentRequest request) {
        Enrollment enrollment = enrollmentService.getById(request.getEnrollmentId());
        GetEnrollmentResponse response = new GetEnrollmentResponse();
        response.setEnrollment(toSoapEnrollment(enrollment));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllEnrollmentsRequest")
    @ResponsePayload
    public GetAllEnrollmentsResponse getAllEnrollments(@RequestPayload GetAllEnrollmentsRequest request) {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        GetAllEnrollmentsResponse response = new GetAllEnrollmentsResponse();
        for (Enrollment enrollment : enrollments) {
            response.getEnrollments().add(toSoapEnrollment(enrollment));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "updateEnrollmentRequest")
    @ResponsePayload
    public UpdateEnrollmentResponse updateEnrollment(@RequestPayload UpdateEnrollmentRequest request) {
        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentCode(request.getEnrollmentCode());
        enrollment.setStudentId(request.getStudentId());
        enrollment.setCourseId(request.getCourseId());
        enrollment.setSemester(request.getSemester());
        enrollment.setStatus(request.getStatus());
        enrollment.setEnrollmentDate(request.getEnrollmentDate());
        enrollment.setAcademicYear(request.getAcademicYear());
        enrollment.setEnrollmentType(request.getEnrollmentType());

        Enrollment updated = enrollmentService.updateEnrollment(request.getEnrollmentId(), enrollment);

        UpdateEnrollmentResponse response = new UpdateEnrollmentResponse();
        response.setEnrollment(toSoapEnrollment(updated));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "deleteEnrollmentRequest")
    @ResponsePayload
    public DeleteEnrollmentResponse deleteEnrollment(@RequestPayload DeleteEnrollmentRequest request) {
        enrollmentService.deleteEnrollment(request.getEnrollmentId());
        DeleteEnrollmentResponse response = new DeleteEnrollmentResponse();
        response.setSuccess(true);
        response.setMessage("Enrollment deleted successfully");
        return response;
    }

    private com.smartcampus.enrollment.soap.Enrollment toSoapEnrollment(Enrollment enrollment) {
        com.smartcampus.enrollment.soap.Enrollment soapEnrollment = new com.smartcampus.enrollment.soap.Enrollment();
        soapEnrollment.setId(enrollment.getId());
        soapEnrollment.setEnrollmentCode(enrollment.getEnrollmentCode());
        soapEnrollment.setStudentId(enrollment.getStudentId());
        soapEnrollment.setCourseId(enrollment.getCourseId());
        soapEnrollment.setSemester(enrollment.getSemester());
        soapEnrollment.setStatus(enrollment.getStatus());
        soapEnrollment.setEnrollmentDate(enrollment.getEnrollmentDate());
        soapEnrollment.setAcademicYear(enrollment.getAcademicYear());
        soapEnrollment.setEnrollmentType(enrollment.getEnrollmentType());
        return soapEnrollment;
    }
}
