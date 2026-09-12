package com.smartcampus.exam.exception;

public class ExamDatabaseException extends RuntimeException {

    public ExamDatabaseException(String message) {
        super(message);
    }

    public ExamDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
