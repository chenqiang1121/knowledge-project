package com.qiang.knowledge.service.search;

/**
 * Base search model for paged queries with shared page index and page size defaults.
 */
public class PageSearch {

    /** One-based page number for paged list queries. */
    private Integer pageIndex = 1;

    /** Number of rows requested for each page. */
    private Integer pageSize = 20;

    /** Returns a valid one-based page number, defaulting to 1. */
    public Integer getPageIndex() {
        return pageIndex == null || pageIndex < 1 ? 1 : pageIndex;
    }

    /** Sets the one-based page number for paged list queries. */
    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    /** Returns a valid page size, defaulting to 20. */
    public Integer getPageSize() {
        return pageSize == null || pageSize < 1 ? 20 : pageSize;
    }

    /** Sets the number of rows requested for each page. */
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
