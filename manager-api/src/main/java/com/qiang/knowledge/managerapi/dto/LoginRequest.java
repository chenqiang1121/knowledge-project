package com.qiang.knowledge.managerapi.dto;

/**
 * Login request payload submitted by the manager frontend.
 */
public class LoginRequest {

    /** Username used to find the manager account. */
    private String username;

    /** Plain password value compared with the current users table. */
    private String password;

    /** Returns the submitted username. */
    public String getUsername() {
        return username;
    }

    /** Sets the submitted username. */
    public void setUsername(String username) {
        this.username = username;
    }

    /** Returns the submitted password. */
    public String getPassword() {
        return password;
    }

    /** Sets the submitted password. */
    public void setPassword(String password) {
        this.password = password;
    }
}
