package com.qiang.knowledge.managerapi.dto;

/**
 * Login response payload containing the issued token and current user profile.
 */
public class LoginResponse {

    /** Sa-Token token value used by subsequent manager API requests. */
    private String token;

    /** Safe user payload for the authenticated account. */
    private UserResponse user;

    /** Creates an empty response for framework serialization. */
    public LoginResponse() {
    }

    /** Creates a response with a token and user payload. */
    public LoginResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    /** Returns the issued token. */
    public String getToken() {
        return token;
    }

    /** Sets the issued token. */
    public void setToken(String token) {
        this.token = token;
    }

    /** Returns the safe user payload. */
    public UserResponse getUser() {
        return user;
    }

    /** Sets the safe user payload. */
    public void setUser(UserResponse user) {
        this.user = user;
    }
}
