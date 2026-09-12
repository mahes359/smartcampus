package com.smartcampus.faculty.endpoint;

import com.smartcampus.faculty.entity.Faculty;
import com.smartcampus.faculty.service.FacultyService;
import com.smartcampus.faculty.soap.*;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class FacultyEndpoint {

    private static final String NAMESPACE = "http://college.com/faculty";

    private final FacultyService facultyService;

    public FacultyEndpoint(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "createFacultyRequest")
    @ResponsePayload
    public CreateFacultyResponse createFaculty(@RequestPayload CreateFacultyRequest request) {
        Faculty faculty = new Faculty();
        mapRequestToFaculty(request.getEmployeeNumber(), request.getFirstName(), request.getLastName(),
                request.getEmail(), request.getPhone(), request.getDepartment(), request.getDesignation(),
                request.getQualification(), request.getSpecialization(), request.getJoiningDate(),
                request.getFacultyStatus(), request.getOfficeRoom(), request.getFacultyRole(), faculty);

        Faculty savedFaculty = facultyService.createFaculty(faculty);

        CreateFacultyResponse response = new CreateFacultyResponse();
        response.setFaculty(toSoapFaculty(savedFaculty));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getFacultyRequest")
    @ResponsePayload
    public GetFacultyResponse getFaculty(@RequestPayload GetFacultyRequest request) {
        Long id = parseId(request.getFacultyId());
        Faculty faculty = facultyService.getById(id);
        GetFacultyResponse response = new GetFacultyResponse();
        response.setFaculty(toSoapFaculty(faculty));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllFacultyRequest")
    @ResponsePayload
    public GetAllFacultyResponse getAllFaculty(@RequestPayload GetAllFacultyRequest request) {
        List<Faculty> facultyList = facultyService.getAllFaculty();
        GetAllFacultyResponse response = new GetAllFacultyResponse();
        for (Faculty faculty : facultyList) {
            response.getFaculty().add(toSoapFaculty(faculty));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "updateFacultyRequest")
    @ResponsePayload
    public UpdateFacultyResponse updateFaculty(@RequestPayload UpdateFacultyRequest request) {
        Long id = parseId(request.getFacultyId());
        Faculty faculty = new Faculty();
        mapRequestToFaculty(request.getEmployeeNumber(), request.getFirstName(), request.getLastName(),
                request.getEmail(), request.getPhone(), request.getDepartment(), request.getDesignation(),
                request.getQualification(), request.getSpecialization(), request.getJoiningDate(),
                request.getFacultyStatus(), request.getOfficeRoom(), request.getFacultyRole(), faculty);

        Faculty updatedFaculty = facultyService.updateFaculty(id, faculty);

        UpdateFacultyResponse response = new UpdateFacultyResponse();
        response.setFaculty(toSoapFaculty(updatedFaculty));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "deleteFacultyRequest")
    @ResponsePayload
    public DeleteFacultyResponse deleteFaculty(@RequestPayload DeleteFacultyRequest request) {
        Long id = parseId(request.getFacultyId());
        facultyService.deleteFaculty(id);
        DeleteFacultyResponse response = new DeleteFacultyResponse();
        response.setSuccess(true);
        response.setMessage("Faculty deleted successfully");
        return response;
    }

    private Long parseId(String strId) {
        try {
            return Long.parseLong(strId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid faculty ID format: " + strId);
        }
    }

    private void mapRequestToFaculty(String employeeNumber, String firstName, String lastName,
                                     String email, String phone, String department, String designation,
                                     String qualification, String specialization, java.time.LocalDate joiningDate,
                                     String facultyStatus, String officeRoom, String facultyRole,
                                     Faculty faculty) {
        faculty.setEmployeeNumber(employeeNumber);
        faculty.setFirstName(firstName);
        faculty.setLastName(lastName);
        faculty.setEmail(email);
        faculty.setPhone(phone);
        faculty.setDepartment(department);
        faculty.setDesignation(designation);
        faculty.setQualification(qualification);
        faculty.setSpecialization(specialization);
        faculty.setJoiningDate(joiningDate);
        faculty.setFacultyStatus(facultyStatus);
        faculty.setOfficeRoom(officeRoom);
        faculty.setFacultyRole(facultyRole);
    }

    private com.smartcampus.faculty.soap.Faculty toSoapFaculty(Faculty faculty) {
        com.smartcampus.faculty.soap.Faculty soapFaculty = new com.smartcampus.faculty.soap.Faculty();
        soapFaculty.setId(String.valueOf(faculty.getId()));
        soapFaculty.setEmployeeNumber(faculty.getEmployeeNumber());
        soapFaculty.setFirstName(faculty.getFirstName());
        soapFaculty.setLastName(faculty.getLastName());
        soapFaculty.setEmail(faculty.getEmail());
        soapFaculty.setPhone(faculty.getPhone());
        soapFaculty.setDepartment(faculty.getDepartment());
        soapFaculty.setDesignation(faculty.getDesignation());
        soapFaculty.setQualification(faculty.getQualification());
        soapFaculty.setSpecialization(faculty.getSpecialization());
        soapFaculty.setJoiningDate(faculty.getJoiningDate());
        soapFaculty.setFacultyStatus(faculty.getFacultyStatus());
        soapFaculty.setOfficeRoom(faculty.getOfficeRoom());
        soapFaculty.setFacultyRole(faculty.getFacultyRole());
        return soapFaculty;
    }
}
