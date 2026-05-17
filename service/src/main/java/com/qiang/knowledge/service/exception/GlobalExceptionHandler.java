package com.qiang.knowledge.service.exception;

import cn.dev33.satoken.exception.NotLoginException;
import com.qiang.knowledge.service.common.ApiResult;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * TODO: 全局异常处理占位，后续统一错误码、日志追踪 ID 和国际化消息。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * TODO: Sa-Token 未登录异常占位。
     */
    @ExceptionHandler(NotLoginException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResult<Void> handleNotLogin(NotLoginException exception) {
        return ApiResult.error(401, "token required: " + exception.getMessage());
    }

    /**
     * TODO: 通用异常占位，生产环境避免直接暴露异常详情。
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResult<Void> handleException(Exception exception) {
        return ApiResult.error(500, exception.getMessage());
    }
}

