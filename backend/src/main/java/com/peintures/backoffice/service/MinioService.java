package com.peintures.backoffice.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${app.minio.bucket}")
    private String bucket;

    @Value("${app.minio.public-url}")
    private String publicUrl;

    @PostConstruct
    public void init() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
            String policy = "{"
                    + "\"Version\":\"2012-10-17\","
                    + "\"Statement\":[{"
                    + "\"Effect\":\"Allow\","
                    + "\"Principal\":{\"AWS\":[\"*\"]},"
                    + "\"Action\":[\"s3:GetObject\"],"
                    + "\"Resource\":[\"arn:aws:s3:::" + bucket + "/*\"]"
                    + "}]}";
            minioClient.setBucketPolicy(SetBucketPolicyArgs.builder().bucket(bucket).config(policy).build());
        } catch (Exception e) {
            throw new IllegalStateException("MinIO init failed", e);
        }
    }

    public String upload(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }
            String key = UUID.randomUUID() + extension;
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(key)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
            return publicUrl + "/" + bucket + "/" + key;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to upload to MinIO", e);
        }
    }

    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        String prefix = publicUrl + "/" + bucket + "/";
        if (!imageUrl.startsWith(prefix)) {
            return;
        }
        String key = imageUrl.substring(prefix.length());
        try {
            minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(key).build());
        } catch (Exception e) {
            // log but do not abort the transaction
        }
    }
}
