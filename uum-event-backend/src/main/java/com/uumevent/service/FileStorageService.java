package com.uumevent.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        
        try {
            // This will create the directory if it doesn't exist.
            // If it fails, it will throw a clear exception.
            Files.createDirectories(this.fileStorageLocation);
            logger.info("Uploads directory successfully verified/created at: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            // This will cause the application to fail on startup if it cannot create the folder,
            // which is better than failing later.
            throw new RuntimeException("Could not create the directory for uploads. Please check file permissions. Path: " + this.fileStorageLocation, ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String sanitizedFileName = originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String uniqueFileName = UUID.randomUUID().toString() + "_" + sanitizedFileName;

        try {
            if(uniqueFileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence: " + uniqueFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + uniqueFileName;
        } catch (IOException ex) {
            logger.error("Could not store file {}", uniqueFileName, ex);
            throw new RuntimeException("Could not store file " + uniqueFileName + ". Please try again!", ex);
        }
    }
}
