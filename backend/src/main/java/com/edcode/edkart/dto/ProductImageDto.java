package com.edcode.edkart.dto;

import org.springframework.lang.Contract;

public class ProductImageDto {
    private String url;

    public String getUrl() {
        return url;
    }

    public ProductImageDto(String url) {
        super();
        this.url = url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
