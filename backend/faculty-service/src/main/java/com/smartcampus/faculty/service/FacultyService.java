package com.smartcampus.faculty.service;

import com.smartcampus.faculty.entity.Faculty;
import com.smartcampus.faculty.exception.DuplicateFacultyException;
import com.smartcampus.faculty.exception.FacultyNotFoundException;
import com.smartcampus.faculty.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public Faculty createFaculty(Faculty faculty) {
        if (facultyRepository.existsByEmployeeNumber(faculty.getEmployeeNumber())) {
            throw new DuplicateFacultyException("Employee number already exists: " + faculty.getEmployeeNumber());
        }
        if (facultyRepository.existsByEmail(faculty.getEmail())) {
            throw new DuplicateFacultyException("Email already exists: " + faculty.getEmail());
        }
        return facultyRepository.save(faculty);
    }

    public Faculty getById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new FacultyNotFoundException("Faculty not found with id: " + id));
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public List<Faculty> getFacultyByCollege(Long collegeId) {
        if (collegeId != null) {
            return facultyRepository.findByCollegeId(collegeId);
        }
        return facultyRepository.findAll();
    }

    public Faculty updateFaculty(Long id, Faculty updatedFaculty) {
        Faculty existingFaculty = getById(id);

        if (!existingFaculty.getEmployeeNumber().equals(updatedFaculty.getEmployeeNumber()) &&
            facultyRepository.existsByEmployeeNumber(updatedFaculty.getEmployeeNumber())) {
            throw new DuplicateFacultyException("Employee number already exists: " + updatedFaculty.getEmployeeNumber());
        }

        if (!existingFaculty.getEmail().equals(updatedFaculty.getEmail()) &&
            facultyRepository.existsByEmail(updatedFaculty.getEmail())) {
            throw new DuplicateFacultyException("Email already exists: " + updatedFaculty.getEmail());
        }

        if (updatedFaculty.getCollegeId() != null) {
            existingFaculty.setCollegeId(updatedFaculty.getCollegeId());
        }
        if (updatedFaculty.getDepartmentId() != null) {
            existingFaculty.setDepartmentId(updatedFaculty.getDepartmentId());
        }

        existingFaculty.setEmployeeNumber(updatedFaculty.getEmployeeNumber());
        existingFaculty.setFirstName(updatedFaculty.getFirstName());
        existingFaculty.setLastName(updatedFaculty.getLastName());
        existingFaculty.setEmail(updatedFaculty.getEmail());
        existingFaculty.setPhone(updatedFaculty.getPhone());
        existingFaculty.setDepartment(updatedFaculty.getDepartment());
        existingFaculty.setDesignation(updatedFaculty.getDesignation());
        existingFaculty.setQualification(updatedFaculty.getQualification());
        existingFaculty.setSpecialization(updatedFaculty.getSpecialization());
        existingFaculty.setJoiningDate(updatedFaculty.getJoiningDate());
        existingFaculty.setFacultyStatus(updatedFaculty.getFacultyStatus());
        existingFaculty.setOfficeRoom(updatedFaculty.getOfficeRoom());
        existingFaculty.setFacultyRole(updatedFaculty.getFacultyRole());

        return facultyRepository.save(existingFaculty);
    }

    public void deleteFaculty(Long id) {
        Faculty faculty = getById(id);
        facultyRepository.delete(faculty);
    }
}
