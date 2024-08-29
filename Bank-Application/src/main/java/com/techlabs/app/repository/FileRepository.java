package com.techlabs.app.repository;

import com.techlabs.app.entity.FileItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileItem, Integer> {
    List<FileItem> findByCustomer_CustomerId(Long customerId);
}
