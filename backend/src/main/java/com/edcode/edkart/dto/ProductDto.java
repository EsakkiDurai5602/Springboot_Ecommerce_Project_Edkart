package com.edcode.edkart.dto;


import java.util.ArrayList;
import java.util.List;

public class ProductDto {
    private Long id;

    private String name;

    private Double price;

    private String seller;

    private String description;

    private String category;

    private Integer stock;

    private Double rating = 0.0;

    private Integer numOfReviews = 0;

    private List<ProductImageDto> images = new ArrayList<>();


    private List<ProductReviewDto> reviews = new ArrayList<>();
//
//    public ProductDto(Product product) {
//        this.id = product.getId();
//        this.name = product.getName();
//        this.price = product.getPrice();
//        this.seller = product.getSeller();
//        this.description = product.getDescription();
//        this.category = product.getCategory();
//        this.stock = product.getStock();
//        this.rating = product.getRating();
//        this.numOfReviews = product.getNumOfReviews();
//        this.images = product.getImages();
//        this.reviews = product.getReviews();
//    }

    public ProductDto(){

    }

    public ProductDto(Long id, String name, Double price, String seller,
                   String description, String category,
                   Integer stock, Double rating) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.seller = seller;
        this.description = description;
        this.category = category;
        this.stock = stock;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public String getSeller() {
        return seller;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public Integer getStock() {
        return stock;
    }

    public Double getRating() {
        return rating;
    }

    public Integer getNumOfReviews() {
        return numOfReviews;
    }

    public List<ProductImageDto> getImages() {
        return images;
    }

    public List<ProductReviewDto> getReviews() {
        return reviews;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public void setNumOfReviews(Integer numOfReviews) {
        this.numOfReviews = numOfReviews;
    }

    public void setImages(List<ProductImageDto> images) {
        this.images = images;
    }

    public void setReviews(List<ProductReviewDto> reviews) {
        this.reviews = reviews;
    }
}
