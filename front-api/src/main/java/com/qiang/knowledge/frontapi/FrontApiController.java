package com.qiang.knowledge.frontapi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * TODO: 用户端 REST API 占位，覆盖 /api/knowledge/* 知识库检索与详情接口。
 */
@RestController
@RequestMapping("/api/knowledge")
public class FrontApiController {

    /**
     * TODO: 知识库搜索占位，后续调用向量检索、全文检索和排序逻辑。
     */
    @GetMapping("/search")
    public Map<String, String> search() {
        return Map.of("message", "TODO: knowledge search placeholder");
    }

    /**
     * TODO: 文档详情占位，后续根据文档 ID 返回正文、摘要、引用信息。
     */
    @GetMapping("/document")
    public Map<String, String> documentDetail() {
        return Map.of("message", "TODO: document detail placeholder");
    }
}

