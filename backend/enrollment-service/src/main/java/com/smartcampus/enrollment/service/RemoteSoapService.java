package com.smartcampus.enrollment.service;

import com.smartcampus.enrollment.exception.CourseServiceException;
import com.smartcampus.enrollment.exception.RemoteServiceException;
import com.smartcampus.enrollment.exception.StudentServiceException;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.stereotype.Service;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.xml.transform.StringResult;
import org.springframework.xml.transform.StringSource;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;

import org.xml.sax.InputSource;

import java.io.StringReader;

@Service
public class RemoteSoapService {

    private static final String STUDENT_SERVICE = "STUDENT-SERVICE";
    private static final String COURSE_SERVICE = "COURSE-SERVICE";

    private final WebServiceTemplate webServiceTemplate;
    private final LoadBalancerClient loadBalancerClient;

    public RemoteSoapService(
            WebServiceTemplate webServiceTemplate,
            LoadBalancerClient loadBalancerClient) {
        this.webServiceTemplate = webServiceTemplate;
        this.loadBalancerClient = loadBalancerClient;
    }

    public void validateStudentExists(Long studentId) {
        if (studentId == null || studentId <= 0) {
            throw new StudentServiceException("Student ID must be positive");
        }

        ServiceInstance instance = chooseInstance(STUDENT_SERVICE);
        String uri = instance.getUri() + "/ws/";

        String request = """
                <stu:getStudentRequest xmlns:stu="http://college.com/student">
                    <stu:studentId>%d</stu:studentId>
                </stu:getStudentRequest>
                """.formatted(studentId);

        try {
            StringResult result = new StringResult();
            webServiceTemplate.sendSourceAndReceiveToResult(
                    uri,
                    new StringSource(request),
                    result
            );

            if (!containsElement(result.toString(), "student")) {
                throw new StudentServiceException("Student was not found with id: " + studentId);
            }
        } catch (StudentServiceException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new StudentServiceException("Unable to communicate with Student Service", exception);
        }
    }

    public void validateCourseExists(Long courseId) {
        if (courseId == null || courseId <= 0) {
            throw new CourseServiceException("Course ID must be positive");
        }

        ServiceInstance instance = chooseInstance(COURSE_SERVICE);
        String uri = instance.getUri() + "/ws/";

        String request = """
                <cou:getCourseRequest xmlns:cou="http://college.com/course">
                    <cou:courseId>%d</cou:courseId>
                </cou:getCourseRequest>
                """.formatted(courseId);

        try {
            StringResult result = new StringResult();
            webServiceTemplate.sendSourceAndReceiveToResult(
                    uri,
                    new StringSource(request),
                    result
            );

            if (!containsElement(result.toString(), "course")) {
                throw new CourseServiceException("Course was not found with id: " + courseId);
            }
        } catch (CourseServiceException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new CourseServiceException("Unable to communicate with Course Service", exception);
        }
    }

    private ServiceInstance chooseInstance(String serviceName) {
        ServiceInstance instance = loadBalancerClient.choose(serviceName);
        if (instance == null) {
            throw new RemoteServiceException("No available instance for service: " + serviceName);
        }
        return instance;
    }

    private boolean containsElement(String xml, String elementName) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            Document document = factory.newDocumentBuilder().parse(new InputSource(new StringReader(xml)));
            NodeList nodes = document.getElementsByTagNameNS("*", elementName);
            return nodes.getLength() > 0;
        } catch (Exception exception) {
            throw new RemoteServiceException("Unable to parse SOAP response", exception);
        }
    }
}
