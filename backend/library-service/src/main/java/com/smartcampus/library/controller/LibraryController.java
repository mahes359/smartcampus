package com.smartcampus.library.controller;

import com.smartcampus.library.entity.LibraryBook;
import com.smartcampus.library.repository.LibraryBookRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryBookRepository bookRepository;

    @PostConstruct
    public void seedInitialBooks() {
        if (bookRepository.count() == 0) {
            bookRepository.save(LibraryBook.builder()
                    .collegeId(1L)
                    .isbn("978-0134685991")
                    .title("Effective Java (3rd Edition)")
                    .author("Joshua Bloch")
                    .category("COMPUTER_SCIENCE")
                    .totalCopies(15)
                    .availableCopies(8)
                    .build());
            bookRepository.save(LibraryBook.builder()
                    .collegeId(1L)
                    .isbn("978-0262033848")
                    .title("Introduction to Algorithms (CLRS)")
                    .author("Thomas H. Cormen")
                    .category("COMPUTER_SCIENCE")
                    .totalCopies(25)
                    .availableCopies(12)
                    .build());
            bookRepository.save(LibraryBook.builder()
                    .collegeId(1L)
                    .isbn("978-1491950357")
                    .title("Designing Data-Intensive Applications")
                    .author("Martin Kleppmann")
                    .category("DISTRIBUTED_SYSTEMS")
                    .totalCopies(20)
                    .availableCopies(14)
                    .build());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("service", "library-service");
        status.put("status", "UP");
        status.put("message", "SmartCampus Library Microservice is operational");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/books")
    public ResponseEntity<List<LibraryBook>> getBooks(@RequestParam(required = false) Long collegeId) {
        if (collegeId != null) {
            return ResponseEntity.ok(bookRepository.findByCollegeId(collegeId));
        }
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @PostMapping("/books")
    public ResponseEntity<LibraryBook> createBook(@RequestBody LibraryBook book) {
        if (book.getCollegeId() == null) {
            book.setCollegeId(1L);
        }
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        LibraryBook saved = bookRepository.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable Long id) {
        bookRepository.deleteById(id);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Book deleted successfully");
        return ResponseEntity.ok(res);
    }
}