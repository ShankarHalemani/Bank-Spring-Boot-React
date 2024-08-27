package com.techlabs.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techlabs.app.dto.EmailDTO;
import com.techlabs.app.service.MailServiceImpl;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Configuration
public class EmailSender {
    @Autowired
    private MailServiceImpl mailService;

    @Autowired
    private ObjectMapper objectMapper;


    public ResponseEntity<String> sendMailWithAttachement(EmailDTO emailDTO) {
        try {


            mailService.mailWithAttachment(emailDTO.getTo(), emailDTO.getSubject(), emailDTO.getBody());


            return ResponseEntity.ok("Email Sent Successfully");
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error sending email : " + e.getMessage());
        }
    }
}
