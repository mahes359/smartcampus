package com.smartcampus.college.service;

import com.smartcampus.college.entity.*;
import com.smartcampus.college.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;
    private final ProgramRepository programRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SemesterRepository semesterRepository;
    private final SectionRepository sectionRepository;

    // College Operations
    public College createCollege(College college) {
        if (collegeRepository.existsByCollegeCode(college.getCollegeCode())) {
            throw new IllegalArgumentException("College code already exists: " + college.getCollegeCode());
        }
        return collegeRepository.save(college);
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College getCollegeById(Long id) {
        return collegeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("College not found with id: " + id));
    }

    // Department Operations
    public Department createDepartment(Department department) {
        getCollegeById(department.getCollegeId()); // Ensure college exists
        return departmentRepository.save(department);
    }

    public List<Department> getDepartmentsByCollege(Long collegeId) {
        return departmentRepository.findByCollegeId(collegeId);
    }

    // Program Operations
    public Program createProgram(Program program) {
        getCollegeById(program.getCollegeId());
        return programRepository.save(program);
    }

    public List<Program> getProgramsByCollege(Long collegeId) {
        return programRepository.findByCollegeId(collegeId);
    }

    // Academic Year Operations
    public AcademicYear createAcademicYear(AcademicYear academicYear) {
        getCollegeById(academicYear.getCollegeId());
        return academicYearRepository.save(academicYear);
    }

    public List<AcademicYear> getAcademicYearsByCollege(Long collegeId) {
        return academicYearRepository.findByCollegeId(collegeId);
    }

    // Semester Operations
    public Semester createSemester(Semester semester) {
        getCollegeById(semester.getCollegeId());
        return semesterRepository.save(semester);
    }

    public List<Semester> getSemestersByCollege(Long collegeId) {
        return semesterRepository.findByCollegeId(collegeId);
    }

    // Section Operations
    public Section createSection(Section section) {
        getCollegeById(section.getCollegeId());
        return sectionRepository.save(section);
    }

    public List<Section> getSectionsByCollege(Long collegeId) {
        return sectionRepository.findByCollegeId(collegeId);
    }
}
