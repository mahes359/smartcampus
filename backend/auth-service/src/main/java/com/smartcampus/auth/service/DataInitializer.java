package com.smartcampus.auth.service;

import com.smartcampus.auth.entity.AppUser;
import com.smartcampus.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the default SUPER_ADMIN account on first startup.
 * Safe to re-run — uses existsByEmail to check before inserting.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final String SUPER_ADMIN_EMAIL = "superadmin@smartcampus.edu";
    private static final String SUPER_ADMIN_PASSWORD = "SuperAdmin@2026";
    private static final String SUPER_ADMIN_NAME = "Super Administrator";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedSuperAdmin();
        seedDemoUsers();
    }

    private void seedSuperAdmin() {
        if (!userRepository.existsByEmailIgnoreCase(SUPER_ADMIN_EMAIL)) {
            AppUser superAdmin = AppUser.builder()
                    .email(SUPER_ADMIN_EMAIL)
                    .passwordHash(passwordEncoder.encode(SUPER_ADMIN_PASSWORD))
                    .name(SUPER_ADMIN_NAME)
                    .role("SUPER_ADMIN")
                    .collegeId(null) // Super admin is not tenant-bound
                    .active(true)
                    .build();
            userRepository.save(superAdmin);
            log.info("✅ Seeded SUPER_ADMIN: {}", SUPER_ADMIN_EMAIL);
        } else {
            log.info("✅ SUPER_ADMIN already exists: {}", SUPER_ADMIN_EMAIL);
        }
    }

    private void seedDemoUsers() {
        seedUser("admin@smartcampus.edu",     "Admin@2026",     "College Administrator", "COLLEGE_ADMIN",      1L);
        seedUser("hod@smartcampus.edu",       "Hod@2026",       "Head of Department",    "HOD",                1L);
        seedUser("faculty@smartcampus.edu",   "Faculty@2026",   "Dr. A. Kumar",          "FACULTY",            1L);
        seedUser("student@smartcampus.edu",   "Student@2026",   "Ravi Shankar",          "STUDENT",            1L);
        seedUser("exams@smartcampus.edu",     "Exams@2026",     "Exam Officer",          "EXAM_OFFICER",       1L);
        seedUser("accounts@smartcampus.edu",  "Accounts@2026",  "Finance Manager",       "ACCOUNTANT",         1L);
        seedUser("library@smartcampus.edu",   "Library@2026",   "Chief Librarian",       "LIBRARIAN",          1L);
        seedUser("hostel@smartcampus.edu",    "Hostel@2026",    "Hostel Warden",         "HOSTEL_WARDEN",      1L);
        seedUser("placement@smartcampus.edu", "Placement@2026", "Placement Officer",     "PLACEMENT_OFFICER",  1L);
        seedUser("transport@smartcampus.edu", "Transport@2026", "Transport Manager",     "TRANSPORT_MANAGER",  1L);
        seedUser("parent@smartcampus.edu",    "Parent@2026",    "Parent Guardian",       "PARENT",             1L);
    }

    private void seedUser(String email, String password, String name, String role, Long collegeId) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            AppUser user = AppUser.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .name(name)
                    .role(role)
                    .collegeId(collegeId)
                    .active(true)
                    .build();
            userRepository.save(user);
            log.info("  → Seeded [{}]: {}", role, email);
        }
    }
}
