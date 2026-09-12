package com.smartcampus.exam.service;

import com.smartcampus.exam.entity.Exam;
import com.smartcampus.exam.exception.DuplicateExamException;
import com.smartcampus.exam.exception.ExamDatabaseException;
import com.smartcampus.exam.exception.ExamNotFoundException;
import com.smartcampus.exam.exception.ExamValidationException;
import com.smartcampus.exam.repository.ExamRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final Validator validator;
    private final RemoteCourseService remoteCourseService;

    public ExamService(ExamRepository examRepository, Validator validator, RemoteCourseService remoteCourseService) {
        this.examRepository = examRepository;
        this.validator = validator;
        this.remoteCourseService = remoteCourseService;
    }

    public Exam createExam(Exam exam) {
        validateExam(exam);
        normalize(exam);

        if (examRepository.existsByExamCode(exam.getExamCode())) {
            throw new DuplicateExamException("Exam code already exists: " + exam.getExamCode());
        }

        remoteCourseService.validateCourseExists(exam.getCourseId());

        try {
            return examRepository.save(exam);
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateExamException("Duplicate exam data");
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to save exam", exception);
        }
    }

    public Exam getById(Long id) {
        validateId(id);
        try {
            return examRepository.findById(id)
                    .orElseThrow(() -> new ExamNotFoundException("Exam not found with id: " + id));
        } catch (ExamNotFoundException exception) {
            throw exception;
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to retrieve exam", exception);
        }
    }

    public List<Exam> getAllExams() {
        try {
            return examRepository.findAll();
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to retrieve exams", exception);
        }
    }

    public List<Exam> getExamsByCollegeId(Long collegeId) {
        try {
            return examRepository.findByCollegeId(collegeId);
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to retrieve exams for college: " + collegeId, exception);
        }
    }

    public List<Exam> getExamsByCourseId(Long courseId) {
        try {
            return examRepository.findByCourseId(courseId);
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to retrieve exams for course: " + courseId, exception);
        }
    }

    public Exam updateExam(Long id, Exam updatedExam) {
        validateId(id);
        validateExam(updatedExam);
        normalize(updatedExam);

        Exam existing = getById(id);

        if (!existing.getExamCode().equalsIgnoreCase(updatedExam.getExamCode())
                && examRepository.existsByExamCode(updatedExam.getExamCode())) {
            throw new DuplicateExamException("Exam code already exists: " + updatedExam.getExamCode());
        }

        boolean courseChanged = !existing.getCourseId().equals(updatedExam.getCourseId());
        if (courseChanged) {
            remoteCourseService.validateCourseExists(updatedExam.getCourseId());
        }

        if (updatedExam.getCollegeId() != null) {
            existing.setCollegeId(updatedExam.getCollegeId());
        }
        existing.setExamCode(updatedExam.getExamCode());
        existing.setCourseId(updatedExam.getCourseId());
        existing.setExamType(updatedExam.getExamType());
        existing.setExamDate(updatedExam.getExamDate());
        existing.setSemester(updatedExam.getSemester());
        existing.setAcademicYear(updatedExam.getAcademicYear());
        existing.setTotalMarks(updatedExam.getTotalMarks());
        existing.setPassingMarks(updatedExam.getPassingMarks());
        existing.setLocation(updatedExam.getLocation());
        existing.setStatus(updatedExam.getStatus());

        try {
            return examRepository.save(existing);
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateExamException("Duplicate exam data");
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to update exam", exception);
        }
    }

    public void deleteExam(Long id) {
        validateId(id);
        Exam exam = getById(id);
        try {
            examRepository.delete(exam);
        } catch (DataAccessException exception) {
            throw new ExamDatabaseException("Unable to delete exam", exception);
        }
    }

    private void validateExam(Exam exam) {
        if (exam == null) {
            throw new ExamValidationException("Exam data cannot be null");
        }
        Set<ConstraintViolation<Exam>> violations = validator.validate(exam);
        if (!violations.isEmpty()) {
            StringBuilder message = new StringBuilder("Validation failed: ");
            for (ConstraintViolation<Exam> violation : violations) {
                message.append(violation.getPropertyPath()).append(": ").append(violation.getMessage()).append("; ");
            }
            throw new ExamValidationException(message.toString());
        }
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new ExamValidationException("Exam ID must be a positive number");
        }
    }

    private void normalize(Exam exam) {
        if (exam.getExamCode() != null) {
            exam.setExamCode(exam.getExamCode().trim().toUpperCase());
        }
        if (exam.getExamType() != null) {
            exam.setExamType(exam.getExamType().trim().toUpperCase());
        }
        if (exam.getAcademicYear() != null) {
            exam.setAcademicYear(exam.getAcademicYear().trim());
        }
        if (exam.getLocation() != null) {
            exam.setLocation(exam.getLocation().trim());
        }
        if (exam.getStatus() != null) {
            exam.setStatus(exam.getStatus().trim().toUpperCase());
        }
        if (exam.getCollegeId() == null) {
            exam.setCollegeId(1L);
        }
    }
}
