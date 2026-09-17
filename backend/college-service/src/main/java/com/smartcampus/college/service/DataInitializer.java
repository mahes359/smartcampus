package com.smartcampus.college.service;

import com.smartcampus.college.entity.College;
import com.smartcampus.college.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds initial college institutions on startup if the database is empty.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CollegeRepository collegeRepository;

    @Override
    public void run(String... args) {
        seedColleges();
    }

    private void seedColleges() {
        if (!collegeRepository.existsByCollegeCode("SC-ENG")) {
            College engCollege = College.builder()
                    .collegeCode("SC-ENG")
                    .collegeName("SmartCampus Engineering College")
                    .address("123 Innovation Campus, Tech Highway")
                    .city("Chennai")
                    .state("Tamil Nadu")
                    .country("India")
                    .email("contact@eng.smartcampus.edu")
                    .phone("+91-44-23456789")
                    .website("https://eng.smartcampus.edu")
                    .isActive(true)
                    .build();
            collegeRepository.save(engCollege);
            log.info("✅ Seeded College: SC-ENG (SmartCampus Engineering College)");
        }

        if (!collegeRepository.existsByCollegeCode("SC-ART")) {
            College artCollege = College.builder()
                    .collegeCode("SC-ART")
                    .collegeName("SmartCampus Arts & Science College")
                    .address("456 Heritage Park, University Road")
                    .city("Chennai")
                    .state("Tamil Nadu")
                    .country("India")
                    .email("contact@arts.smartcampus.edu")
                    .phone("+91-44-23456790")
                    .website("https://arts.smartcampus.edu")
                    .isActive(true)
                    .build();
            collegeRepository.save(artCollege);
            log.info("✅ Seeded College: SC-ART (SmartCampus Arts & Science College)");
        }
    }
}
