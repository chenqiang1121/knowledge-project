package com.qiang.knowledge.service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Encodes and verifies user passwords with a configurable global salt.
 */
@Service
public class PasswordService {

    private final String salt;

    public PasswordService(@Value("${knowledge.security.password-salt:knowledge-project-default-salt}") String salt) {
        this.salt = salt;
    }

    public String encode(String rawPassword) {
        if (rawPassword == null) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest((salt + rawPassword).getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(hashed.length * 2);
            for (byte value : hashed) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 algorithm is not available", exception);
        }
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return encodedPassword != null && encodedPassword.equals(encode(rawPassword));
    }
}
