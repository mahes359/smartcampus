package com.smartcampus.exam;

import com.smartcampus.exam.service.RemoteCourseService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
class ExamServiceApplicationTests {

    @MockitoBean
    private RemoteCourseService remoteCourseService;

    @Test
    void contextLoads() {
    }
}
