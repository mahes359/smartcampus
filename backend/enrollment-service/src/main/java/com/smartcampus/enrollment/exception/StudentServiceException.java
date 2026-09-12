package com.smartcampus.enrollment.exception;

public class StudentServiceException extends RuntimeException {
    public StudentServiceException(String message) {
        super(message);
    }
    public StudentServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
