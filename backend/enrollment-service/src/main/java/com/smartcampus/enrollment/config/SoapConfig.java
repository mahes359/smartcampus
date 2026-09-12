package com.smartcampus.enrollment.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

@Configuration
@EnableWs
public class SoapConfig {

    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {

        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);

        return new ServletRegistrationBean<>(servlet, "/ws/*");
    }

    @Bean
    public XsdSchema enrollmentSchema() {
        return new SimpleXsdSchema(new org.springframework.core.io.ClassPathResource("xsd/Enrollment.xsd"));
    }

    @Bean(name = "enrollment")
    public DefaultWsdl11Definition enrollmentWsdl(XsdSchema enrollmentSchema) {
        DefaultWsdl11Definition definition = new DefaultWsdl11Definition();
        definition.setPortTypeName("EnrollmentPort");
        definition.setLocationUri("/ws");
        definition.setTargetNamespace("http://college.com/enrollment");
        definition.setSchema(enrollmentSchema);
        return definition;
    }
}
