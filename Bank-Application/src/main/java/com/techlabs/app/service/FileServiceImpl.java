package com.techlabs.app.service;

import com.techlabs.app.entity.Customer;
import com.techlabs.app.entity.FileItem;
import com.techlabs.app.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileRepository fileRepository;

    private final String BASE_FOLDER_PATH = "C:/Users/ACER/Documents/MonoJava/Spring/Customers/";

    @Override
    public FileItem saveFile(MultipartFile file, Customer customer) throws IOException {
        String folderPath = BASE_FOLDER_PATH + customer.getCustomerId();
        File directory = new File(folderPath);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = folderPath + "/" + file.getOriginalFilename();
        FileItem item = FileItem.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .location(filePath)
                .customer(customer)
                .build();

        file.transferTo(new File(filePath).toPath());
        return fileRepository.save(item);
    }

    @Override
    public FileItem getFileByCustomerId(Long customerId) {
        return fileRepository.findByCustomer_CustomerId(customerId).stream().findFirst().orElse(null);
    }
}
