package com.edcode.edkart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String publicId;

    private String url;

    public ProductImage() {
        super();
    }

    public ProductImage(String publicId, String url) {
        this.publicId = publicId;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public String getPublicId() {
        return publicId;
    }

    public String getUrl() {
        return url;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;


    public ProductImage(String url, Product product) {
        this.url="/uploads/"+url;
        this.publicId="/"+url;
        this.product=product;
    }

}