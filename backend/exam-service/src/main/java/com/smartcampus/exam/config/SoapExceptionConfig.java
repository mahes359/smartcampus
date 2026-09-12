package com.smartcampus.exam.config;

import com.smartcampus.exam.exception.CourseServiceException;
import com.smartcampus.exam.exception.DuplicateExamException;
import com.smartcampus.exam.exception.ExamDatabaseException;
import com.smartcampus.exam.exception.ExamNotFoundException;
import com.smartcampus.exam.exception.ExamValidationException;
import com.smartcampus.exam.exception.RemoteServiceException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ws.soap.server.endpoint.SoapFaultDefinition;
import org.springframework.ws.soap.server.endpoint.SoapFaultMappingExceptionResolver;

import java.util.Properties;

@Configuration
public class SoapExceptionConfig {

    @Bean
    public SoapFaultMappingExceptionResolver soapExceptionResolver() {
        SoapFaultMappingExceptionResolver resolver = new SoapFaultMappingExceptionResolver();
        Properties mappings = new Properties();
        mappings.setProperty(ExamValidationException.class.getName(), "CLIENT");
        mappings.setProperty(ExamNotFoundException.class.getName(), "CLIENT");
        mappings.setProperty(DuplicateExamException.class.getName(), "CLIENT");
        mappings.setProperty(CourseServiceException.class.getName(), "CLIENT");
        mappings.setProperty(RemoteServiceException.class.getName(), "SERVER");
        mappings.setProperty(ExamDatabaseException.class.getName(), "SERVER");
        resolver.setExceptionMappings(mappings);

        SoapFaultDefinition defaultFault = new SoapFaultDefinition();
        defaultFault.setFaultCode(SoapFaultDefinition.SERVER);
        resolver.setDefaultFault(defaultFault);
        resolver.setOrder(1);

        return resolver;
    }
}
