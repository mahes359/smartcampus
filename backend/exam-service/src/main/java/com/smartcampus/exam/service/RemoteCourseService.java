package com.smartcampus.exam.service;

import com.smartcampus.exam.exception.CourseServiceException;
import com.smartcampus.exam.exception.RemoteServiceException;
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
public class RemoteCourseService {

    private static final String COURSE_SERVICE = "COURSE-SERVICE";

    private final WebServiceTemplate webServiceTemplate;
    private final LoadBalancerClient loadBalancerClient;

    public RemoteCourseService(WebServiceTemplate webServiceTemplate, LoadBalancerClient loadBalancerClient) {
        this.webServiceTemplate = webServiceTemplate;
        this.loadBalancerClient = loadBalancerClient;
    }

    public void validateCourseExists(Long courseId) {
        if (courseId == null || courseId <= 0) {
            throw new CourseServiceException("Course ID must be positive");
        }

        ServiceInstance instance = loadBalancerClient.choose(COURSE_SERVICE);
        if (instance == null) {
            throw new RemoteServiceException("No available Course Service instance");
        }

        String uri = instance.getUri() + "/ws/";

        String request = """
                <cou:getCourseRequest xmlns:cou="http://college.com/course">
                    <cou:courseId>%d</cou:courseId>
                </cou:getCourseRequest>
                """.formatted(courseId);

        try {
            StringResult result = new StringResult();
            webServiceTemplate.sendSourceAndReceiveToResult(uri, new StringSource(request), result);

            if (!containsElement(result.toString(), "course")) {
                throw new CourseServiceException("Course was not found with id: " + courseId);
            }
        } catch (CourseServiceException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new CourseServiceException("Unable to communicate with Course Service", exception);
        }
    }

    private boolean containsElement(String xml, String elementName) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);

            try {
                factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            } catch (Exception ignored) {
            }
            try {
                factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            } catch (Exception ignored) {
            }
            try {
                factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            } catch (Exception ignored) {
            }

            Document document = factory.newDocumentBuilder().parse(new InputSource(new StringReader(xml)));
            NodeList nodes = document.getElementsByTagNameNS("*", elementName);
            return nodes.getLength() > 0;
        } catch (Exception exception) {
            throw new RemoteServiceException("Unable to parse Course Service SOAP response", exception);
        }
    }
}
