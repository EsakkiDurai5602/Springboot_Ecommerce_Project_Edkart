package com.edcode.edkart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be greater than or equal to zero")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "Seller is required")
    @Column(nullable = false)
    private String seller;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Stock is required")
    @Column(nullable = false)
    private Integer stock;

    private Double rating = 0.0;

    private Integer numOfReviews = 0;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JoinColumn(name = "product_id")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductReview> reviews = new ArrayList<>();

    public Product() {
    }

    public Product(Long id, String name, Double price, String seller,
                   String description, String category,
                   Integer stock, Double rating, List<String> images) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.seller = seller;
        this.description = description;
        this.category = category;
        this.stock = stock;
        this.rating = rating;
        this.images=images.stream().map(url -> new ProductImage(url,this)).collect(Collectors.toList());
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

    public List<ProductImage> getImages() {
        return images;
    }

    public List<ProductReview> getReviews() {
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

    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name = "product_id")
    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name = "product_id")
    public void setReviews(List<ProductReview> reviews) {
        this.reviews = reviews;
    }
}