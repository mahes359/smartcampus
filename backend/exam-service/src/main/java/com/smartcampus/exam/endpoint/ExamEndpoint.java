package com.smartcampus.exam.endpoint;

import com.smartcampus.exam.entity.Exam;
import com.smartcampus.exam.service.ExamService;
import com.smartcampus.exam.soap.*;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class ExamEndpoint {

    private static final String NAMESPACE = "http://college.com/exam";
    private final ExamService examService;

    public ExamEndpoint(ExamService examService) {
        this.examService = examService;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "createExamRequest")
    @ResponsePayload
    public CreateExamResponse createExam(@RequestPayload CreateExamRequest request) {
        Exam exam = new Exam();
        mapRequestToExam(request.getExamCode(), request.getCourseId(), request.getExamType(),
                request.getExamDate(), request.getSemester(), request.getAcademicYear(),
                request.getTotalMarks(), request.getPassingMarks(), request.getLocation(),
                request.getStatus(), exam);

        Exam saved = examService.createExam(exam);
        CreateExamResponse response = new CreateExamResponse();
        response.setExam(toSoapExam(saved));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getExamRequest")
    @ResponsePayload
    public GetExamResponse getExam(@RequestPayload GetExamRequest request) {
        Exam exam = examService.getById(request.getExamId());
        GetExamResponse response = new GetExamResponse();
        response.setExam(toSoapExam(exam));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllExamsRequest")
    @ResponsePayload
    public GetAllExamsResponse getAllExams(@RequestPayload GetAllExamsRequest request) {
        List<Exam> exams = examService.getAllExams();
        GetAllExamsResponse response = new GetAllExamsResponse();
        for (Exam exam : exams) {
            response.getExams().add(toSoapExam(exam));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "updateExamRequest")
    @ResponsePayload
    public UpdateExamResponse updateExam(@RequestPayload UpdateExamRequest request) {
        Exam exam = new Exam();
        mapRequestToExam(request.getExamCode(), request.getCourseId(), request.getExamType(),
                request.getExamDate(), request.getSemester(), request.getAcademicYear(),
                request.getTotalMarks(), request.getPassingMarks(), request.getLocation(),
                request.getStatus(), exam);

        Exam updated = examService.updateExam(request.getExamId(), exam);
        UpdateExamResponse response = new UpdateExamResponse();
        response.setExam(toSoapExam(updated));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "deleteExamRequest")
    @ResponsePayload
    public DeleteExamResponse deleteExam(@RequestPayload DeleteExamRequest request) {
        examService.deleteExam(request.getExamId());
        DeleteExamResponse response = new DeleteExamResponse();
        response.setSuccess(true);
        response.setMessage("Exam deleted successfully");
        return response;
    }

    private void mapRequestToExam(String examCode, Long courseId, String examType,
                                  java.time.LocalDate examDate, Integer semester, String academicYear,
                                  Integer totalMarks, Integer passingMarks, String location,
                                  String status, Exam exam) {
        exam.setExamCode(examCode);
        exam.setCourseId(courseId);
        exam.setExamType(examType);
        exam.setExamDate(examDate);
        exam.setSemester(semester);
        exam.setAcademicYear(academicYear);
        exam.setTotalMarks(totalMarks);
        exam.setPassingMarks(passingMarks);
        exam.setLocation(location);
        exam.setStatus(status);
        if (exam.getCollegeId() == null) {
            exam.setCollegeId(1L);
        }
    }

    private com.smartcampus.exam.soap.Exam toSoapExam(Exam exam) {
        com.smartcampus.exam.soap.Exam soapExam = new com.smartcampus.exam.soap.Exam();
        soapExam.setId(exam.getId());
        soapExam.setExamCode(exam.getExamCode());
        soapExam.setCourseId(exam.getCourseId());
        soapExam.setExamType(exam.getExamType());
        soapExam.setExamDate(exam.getExamDate());
        soapExam.setSemester(exam.getSemester());
        soapExam.setAcademicYear(exam.getAcademicYear());
        soapExam.setTotalMarks(exam.getTotalMarks());
        soapExam.setPassingMarks(exam.getPassingMarks());
        soapExam.setLocation(exam.getLocation());
        soapExam.setStatus(exam.getStatus());
        return soapExam;
    }
}
