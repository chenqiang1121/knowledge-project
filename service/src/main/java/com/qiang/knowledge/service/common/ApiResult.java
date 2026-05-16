package com.qiang.knowledge.service.common;

/**
 * Common API response wrapper used by controllers to return a consistent
 * result code, success state, message, and optional payload.
 */
public class ApiResult<T> {

    /**
     * Business result code where zero means success.
     */
    private int code;

    /**
     * Success marker serialized for clients that prefer a boolean flag.
     */
    private boolean success;

    /**
     * Human-readable result message.
     */
    private String message;

    /**
     * Optional response payload.
     */
    private T data;

    /**
     * Creates an empty API result for framework serialization.
     */
    public ApiResult() {
    }

    /**
     * Creates an API result and derives the success flag from the result code.
     */
    public ApiResult(int code, String message, T data) {
        this.code = code;
        this.success = code == 0;
        this.message = message;
        this.data = data;
    }

    /**
     * Builds a new API result with a custom code, message, and payload.
     */
    public static <T> ApiResult<T> build(int code, String message, T data) {
        return new ApiResult<>(code, message, data);
    }

    /**
     * Builds a successful API result with payload data.
     */
    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>(0, "success", data);
    }

    /**
     * Builds a successful API result without payload data.
     */
    public static <T> ApiResult<T> success() {
        return new ApiResult<>(0, "success", null);
    }

    /**
     * Builds an error API result with a custom error code and message.
     */
    public static <T> ApiResult<T> error(int code, String message) {
        return new ApiResult<>(code, message, null);
    }

    /**
     * Builds an error API result with the default error code.
     */
    public static <T> ApiResult<T> error(String message) {
        return new ApiResult<>(-1, message, null);
    }

    /**
     * Returns the business result code.
     */
    public int getCode() {
        return code;
    }

    /**
     * Sets the business result code and refreshes the success flag.
     */
    public void setCode(int code) {
        this.code = code;
        this.success = code == 0;
    }

    /**
     * Returns true when the business result code equals zero.
     */
    public boolean isSuccess() {
        return code == 0;
    }

    /**
     * Sets the serialized success flag.
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * Returns the human-readable result message.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the human-readable result message.
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Returns the optional response payload.
     */
    public T getData() {
        return data;
    }

    /**
     * Sets the optional response payload.
     */
    public void setData(T data) {
        this.data = data;
    }
}
