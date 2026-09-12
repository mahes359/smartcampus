package com.smartcampus.notification.repository;

import com.smartcampus.notification.entity.NotificationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationItemRepository extends JpaRepository<NotificationItem, Long> {
    List<NotificationItem> findByCollegeId(Long collegeId);
}
