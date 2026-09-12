package com.smartcampus.attendance.service;

import com.smartcampus.attendance.exception.RemoteServiceException;
import com.smartcampus.attendance.exception.StudentServiceException;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.stereotype.Service;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.xml.transform.StringResult;
import org.springframework.xml.transform.StringSource;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilderFactory;

import java.io.StringReader;

@Service
public class RemoteStudentService {

    private static final String STUDENT_SERVICE = "STUDENT-SERVICE";

    private final WebServiceTemplate webServiceTemplate;
    private final LoadBalancerClient loadBalancerClient;

    public RemoteStudentService(
            WebServiceTemplate webServiceTemplate,
            LoadBalancerClient loadBalancerClient) {
        this.webServiceTemplate = webServiceTemplate;
        this.loadBalancerClient = loadBalancerClient;
    }

    public void validateStudentExists(Long studentId) {
        if (studentId == null || studentId <= 0) {
            throw new StudentServiceException("Student ID must be positive");
        }

        ServiceInstance instance = loadBalancerClient.choose(STUDENT_SERVICE);
        if (instance == null) {
            throw new RemoteServiceException("No available Student Service instance");
        }

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

    private boolean containsElement(String xml, String elementName) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            try {
                factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            } catch (Exception ignored) {}

            Document document = factory.newDocumentBuilder().parse(new InputSource(new StringReader(xml)));
            NodeList nodes = document.getElementsByTagNameNS("*", elementName);
            return nodes.getLength() > 0;
        } catch (Exception exception) {
            throw new RemoteServiceException("Unable to parse Student Service response", exception);
        }
    }
}
