package com.smartcampus.auth.constants;

import java.util.Collections;
import java.util.Set;

/**
 * Standardized application roles supported across SmartCampus ERP.
 */
public final class AppRoles {

    private AppRoles() {}

    public static final String SUPER_ADMIN = "SUPER_ADMIN";
    public static final String COLLEGE_ADMIN = "COLLEGE_ADMIN";
    public static final String HOD = "HOD";
    public static final String FACULTY = "FACULTY";
    public static final String STUDENT = "STUDENT";
    public static final String PARENT = "PARENT";
    public static final String EXAM_OFFICER = "EXAM_OFFICER";
    public static final String ACCOUNTANT = "ACCOUNTANT";
    public static final String LIBRARIAN = "LIBRARIAN";
    public static final String HOSTEL_WARDEN = "HOSTEL_WARDEN";
    public static final String PLACEMENT_OFFICER = "PLACEMENT_OFFICER";
    public static final String TRANSPORT_MANAGER = "TRANSPORT_MANAGER";

    public static final Set<String> ALL_ROLES = Set.of(
            SUPER_ADMIN,
            COLLEGE_ADMIN,
            HOD,
            FACULTY,
            STUDENT,
            PARENT,
            EXAM_OFFICER,
            ACCOUNTANT,
            LIBRARIAN,
            HOSTEL_WARDEN,
            PLACEMENT_OFFICER,
            TRANSPORT_MANAGER
    );

    public static boolean isValidRole(String role) {
        if (role == null || role.isBlank()) {
            return false;
        }
        return ALL_ROLES.contains(role.trim().toUpperCase());
    }

    public static String normalizeRole(String role) {
        if (!isValidRole(role)) {
            throw new IllegalArgumentException("Unsupported role: " + role);
        }
        return role.trim().toUpperCase();
    }
}
