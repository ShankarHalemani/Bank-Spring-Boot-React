package com.techlabs.app.service;

import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.FileItem;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    FileItem saveFile(MultipartFile file, Customer customer) throws IOException;

    FileItem getFileByCustomerId(Long customerId);
}
