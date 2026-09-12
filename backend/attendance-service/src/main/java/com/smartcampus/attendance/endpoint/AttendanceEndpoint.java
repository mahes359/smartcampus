package com.smartcampus.attendance.endpoint;

import com.smartcampus.attendance.entity.Attendance;
import com.smartcampus.attendance.service.AttendanceService;
import com.smartcampus.attendance.soap.*;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class AttendanceEndpoint {

    private static final String NAMESPACE = "http://college.com/attendance";

    private final AttendanceService attendanceService;

    public AttendanceEndpoint(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "createAttendanceRequest")
    @ResponsePayload
    public CreateAttendanceResponse createAttendance(@RequestPayload CreateAttendanceRequest request) {
        Attendance attendance = new Attendance();
        attendance.setAttendanceCode(request.getAttendanceCode());
        attendance.setStudentId(request.getStudentId());
        attendance.setCourseId(request.getCourseId());
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setStatus(request.getStatus());
        attendance.setSemester(request.getSemester());
        attendance.setAcademicYear(request.getAcademicYear());
        attendance.setAttendanceType(request.getAttendanceType());
        attendance.setRemarks(request.getRemarks());

        Attendance saved = attendanceService.createAttendance(attendance);

        CreateAttendanceResponse response = new CreateAttendanceResponse();
        response.setAttendance(toSoapAttendance(saved));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAttendanceRequest")
    @ResponsePayload
    public GetAttendanceResponse getAttendance(@RequestPayload GetAttendanceRequest request) {
        Attendance attendance = attendanceService.getById(request.getAttendanceId());
        GetAttendanceResponse response = new GetAttendanceResponse();
        response.setAttendance(toSoapAttendance(attendance));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllAttendanceRequest")
    @ResponsePayload
    public GetAllAttendanceResponse getAllAttendance(@RequestPayload GetAllAttendanceRequest request) {
        List<Attendance> list = attendanceService.getAllAttendance();
        GetAllAttendanceResponse response = new GetAllAttendanceResponse();
        for (Attendance a : list) {
            response.getAttendance().add(toSoapAttendance(a));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "updateAttendanceRequest")
    @ResponsePayload
    public UpdateAttendanceResponse updateAttendance(@RequestPayload UpdateAttendanceRequest request) {
        Attendance attendance = new Attendance();
        attendance.setAttendanceCode(request.getAttendanceCode());
        attendance.setStudentId(request.getStudentId());
        attendance.setCourseId(request.getCourseId());
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setStatus(request.getStatus());
        attendance.setSemester(request.getSemester());
        attendance.setAcademicYear(request.getAcademicYear());
        attendance.setAttendanceType(request.getAttendanceType());
        attendance.setRemarks(request.getRemarks());

        Attendance updated = attendanceService.updateAttendance(request.getAttendanceId(), attendance);

        UpdateAttendanceResponse response = new UpdateAttendanceResponse();
        response.setAttendance(toSoapAttendance(updated));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "deleteAttendanceRequest")
    @ResponsePayload
    public DeleteAttendanceResponse deleteAttendance(@RequestPayload DeleteAttendanceRequest request) {
        attendanceService.deleteAttendance(request.getAttendanceId());
        DeleteAttendanceResponse response = new DeleteAttendanceResponse();
        response.setSuccess(true);
        response.setMessage("Attendance record deleted successfully");
        return response;
    }

    private com.smartcampus.attendance.soap.Attendance toSoapAttendance(Attendance a) {
        com.smartcampus.attendance.soap.Attendance soap = new com.smartcampus.attendance.soap.Attendance();
        soap.setId(a.getId());
        soap.setAttendanceCode(a.getAttendanceCode());
        soap.setStudentId(a.getStudentId());
        soap.setCourseId(a.getCourseId());
        soap.setAttendanceDate(a.getAttendanceDate());
        soap.setStatus(a.getStatus());
        soap.setSemester(a.getSemester());
        soap.setAcademicYear(a.getAcademicYear());
        soap.setAttendanceType(a.getAttendanceType());
        soap.setRemarks(a.getRemarks());
        return soap;
    }
}
