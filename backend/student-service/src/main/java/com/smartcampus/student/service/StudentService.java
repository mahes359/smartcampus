package com.smartcampus.student.service;

import com.smartcampus.student.entity.Student;
import com.smartcampus.student.exception.DuplicateStudentException;
import com.smartcampus.student.exception.StudentNotFoundException;
import com.smartcampus.student.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByStudentNumber(student.getStudentNumber())) {
            throw new DuplicateStudentException("Student number already exists: " + student.getStudentNumber());
        }
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new DuplicateStudentException("Email already exists: " + student.getEmail());
        }
        if (student.getAdmissionNumber() != null && !student.getAdmissionNumber().isEmpty() 
            && studentRepository.existsByAdmissionNumber(student.getAdmissionNumber())) {
            throw new DuplicateStudentException("Admission number already exists: " + student.getAdmissionNumber());
        }
        return studentRepository.save(student);
    }

    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getStudentsByCollege(Long collegeId) {
        if (collegeId != null) {
            return studentRepository.findByCollegeId(collegeId);
        }
        return studentRepository.findAll();
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = getById(id);

        if (!existingStudent.getStudentNumber().equals(updatedStudent.getStudentNumber()) && 
            studentRepository.existsByStudentNumber(updatedStudent.getStudentNumber())) {
            throw new DuplicateStudentException("Student number already exists: " + updatedStudent.getStudentNumber());
        }
        
        if (!existingStudent.getEmail().equals(updatedStudent.getEmail()) && 
            studentRepository.existsByEmail(updatedStudent.getEmail())) {
            throw new DuplicateStudentException("Email already exists: " + updatedStudent.getEmail());
        }

        if (updatedStudent.getCollegeId() != null) {
            existingStudent.setCollegeId(updatedStudent.getCollegeId());
        }
        if (updatedStudent.getDepartmentId() != null) {
            existingStudent.setDepartmentId(updatedStudent.getDepartmentId());
        }

        existingStudent.setStudentNumber(updatedStudent.getStudentNumber());
        existingStudent.setAdmissionNumber(updatedStudent.getAdmissionNumber());
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setGender(updatedStudent.getGender());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setPhone(updatedStudent.getPhone());
        existingStudent.setAddress(updatedStudent.getAddress());
        existingStudent.setCity(updatedStudent.getCity());
        existingStudent.setState(updatedStudent.getState());
        existingStudent.setCountry(updatedStudent.getCountry());
        existingStudent.setBloodGroup(updatedStudent.getBloodGroup());
        existingStudent.setParentGuardianInfo(updatedStudent.getParentGuardianInfo());
        existingStudent.setEmergencyContact(updatedStudent.getEmergencyContact());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setProgram(updatedStudent.getProgram());
        existingStudent.setYear(updatedStudent.getYear());
        existingStudent.setSemester(updatedStudent.getSemester());
        existingStudent.setSection(updatedStudent.getSection());
        existingStudent.setAdmissionDate(updatedStudent.getAdmissionDate());
        existingStudent.setStudentStatus(updatedStudent.getStudentStatus());
        existingStudent.setProfileInformation(updatedStudent.getProfileInformation());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        Student student = getById(id);
        studentRepository.delete(student);
    }
}
