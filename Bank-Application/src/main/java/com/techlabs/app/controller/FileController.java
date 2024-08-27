package com.techlabs.app.controller;

import com.techlabs.app.entity.FileItem;
import com.techlabs.app.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileService fileService;

    // Endpoint to retrieve a single file for a customer
    @GetMapping("/view/{customerId}")
    public ResponseEntity<byte[]> viewFileByCustomer(@PathVariable Long customerId) throws IOException {
        FileItem fileItem = fileService.getFileByCustomerId(customerId);
        if (fileItem != null) {
            File file = new File(fileItem.getLocation());
            byte[] content = Files.readAllBytes(file.toPath());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileItem.getType()))
                    .body(content);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
