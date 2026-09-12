package com.smartcampus.student.endpoint;

import com.smartcampus.student.entity.Student;
import com.smartcampus.student.service.StudentService;
import com.smartcampus.student.soap.*;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class StudentEndpoint {

    private static final String NAMESPACE = "http://college.com/student";

    private final StudentService studentService;

    public StudentEndpoint(StudentService studentService) {
        this.studentService = studentService;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "createStudentRequest")
    @ResponsePayload
    public CreateStudentResponse createStudent(@RequestPayload CreateStudentRequest request) {
        Student student = new Student();
        mapRequestToStudent(request.getStudentNumber(), request.getAdmissionNumber(), request.getFirstName(), request.getLastName(), 
                            request.getDateOfBirth(), request.getGender(), request.getEmail(), request.getPhone(), request.getAddress(), 
                            request.getCity(), request.getState(), request.getCountry(), request.getBloodGroup(), request.getParentGuardianInfo(), 
                            request.getEmergencyContact(), request.getDepartment(), request.getProgram(), request.getYear(), request.getSemester(), 
                            request.getSection(), request.getAdmissionDate(), request.getStudentStatus(), request.getProfileInformation(), student);

        Student savedStudent = studentService.createStudent(student);

        CreateStudentResponse response = new CreateStudentResponse();
        response.setStudent(toSoapStudent(savedStudent));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getStudentRequest")
    @ResponsePayload
    public GetStudentResponse getStudent(@RequestPayload GetStudentRequest request) {
        Student student = studentService.getById(request.getStudentId());
        GetStudentResponse response = new GetStudentResponse();
        response.setStudent(toSoapStudent(student));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllStudentsRequest")
    @ResponsePayload
    public GetAllStudentsResponse getAllStudents(@RequestPayload GetAllStudentsRequest request) {
        List<Student> students = studentService.getAllStudents();
        GetAllStudentsResponse response = new GetAllStudentsResponse();
        for (Student student : students) {
            response.getStudents().add(toSoapStudent(student));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "updateStudentRequest")
    @ResponsePayload
    public UpdateStudentResponse updateStudent(@RequestPayload UpdateStudentRequest request) {
        Student student = new Student();
        mapRequestToStudent(request.getStudentNumber(), request.getAdmissionNumber(), request.getFirstName(), request.getLastName(), 
                            request.getDateOfBirth(), request.getGender(), request.getEmail(), request.getPhone(), request.getAddress(), 
                            request.getCity(), request.getState(), request.getCountry(), request.getBloodGroup(), request.getParentGuardianInfo(), 
                            request.getEmergencyContact(), request.getDepartment(), request.getProgram(), request.getYear(), request.getSemester(), 
                            request.getSection(), request.getAdmissionDate(), request.getStudentStatus(), request.getProfileInformation(), student);

        Student updatedStudent = studentService.updateStudent(request.getStudentId(), student);

        UpdateStudentResponse response = new UpdateStudentResponse();
        response.setStudent(toSoapStudent(updatedStudent));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "deleteStudentRequest")
    @ResponsePayload
    public DeleteStudentResponse deleteStudent(@RequestPayload DeleteStudentRequest request) {
        studentService.deleteStudent(request.getStudentId());
        DeleteStudentResponse response = new DeleteStudentResponse();
        response.setSuccess(true);
        response.setMessage("Student deleted successfully");
        return response;
    }

    private void mapRequestToStudent(String studentNumber, String admissionNumber, String firstName, String lastName,
                                     java.time.LocalDate dateOfBirth, String gender, String email, String phone, String address,
                                     String city, String state, String country, String bloodGroup, String parentGuardianInfo,
                                     String emergencyContact, String department, String program, Integer year, Integer semester,
                                     String section, java.time.LocalDate admissionDate, String studentStatus, String profileInformation,
                                     Student student) {
        student.setStudentNumber(studentNumber);
        student.setAdmissionNumber(admissionNumber);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setDateOfBirth(dateOfBirth);
        student.setGender(gender);
        student.setEmail(email);
        student.setPhone(phone);
        student.setAddress(address);
        student.setCity(city);
        student.setState(state);
        student.setCountry(country);
        student.setBloodGroup(bloodGroup);
        student.setParentGuardianInfo(parentGuardianInfo);
        student.setEmergencyContact(emergencyContact);
        student.setDepartment(department);
        student.setProgram(program);
        student.setYear(year);
        student.setSemester(semester);
        student.setSection(section);
        student.setAdmissionDate(admissionDate);
        student.setStudentStatus(studentStatus);
        student.setProfileInformation(profileInformation);
    }

    private com.smartcampus.student.soap.Student toSoapStudent(Student student) {
        com.smartcampus.student.soap.Student soapStudent = new com.smartcampus.student.soap.Student();
        soapStudent.setId(student.getId());
        soapStudent.setStudentNumber(student.getStudentNumber());
        soapStudent.setAdmissionNumber(student.getAdmissionNumber());
        soapStudent.setFirstName(student.getFirstName());
        soapStudent.setLastName(student.getLastName());
        soapStudent.setDateOfBirth(student.getDateOfBirth());
        soapStudent.setGender(student.getGender());
        soapStudent.setEmail(student.getEmail());
        soapStudent.setPhone(student.getPhone());
        soapStudent.setAddress(student.getAddress());
        soapStudent.setCity(student.getCity());
        soapStudent.setState(student.getState());
        soapStudent.setCountry(student.getCountry());
        soapStudent.setBloodGroup(student.getBloodGroup());
        soapStudent.setParentGuardianInfo(student.getParentGuardianInfo());
        soapStudent.setEmergencyContact(student.getEmergencyContact());
        soapStudent.setDepartment(student.getDepartment());
        soapStudent.setProgram(student.getProgram());
        soapStudent.setYear(student.getYear());
        soapStudent.setSemester(student.getSemester());
        soapStudent.setSection(student.getSection());
        soapStudent.setAdmissionDate(student.getAdmissionDate());
        soapStudent.setStudentStatus(student.getStudentStatus());
        soapStudent.setProfileInformation(student.getProfileInformation());
        return soapStudent;
    }
}
