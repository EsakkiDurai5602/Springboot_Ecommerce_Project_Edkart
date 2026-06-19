package com.edcode.edkart.services;

import com.edcode.edkart.dto.ProductDto;
import com.edcode.edkart.dto.ProductImageDto;
import com.edcode.edkart.dto.ProductReviewDto;
import com.edcode.edkart.entity.Product;
import com.edcode.edkart.entity.ProductReview;
import com.edcode.edkart.repository.ProductRepository;
import com.edcode.edkart.repository.ProductReviewRepository;
import com.edcode.edkart.spec.ProductSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServices {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductReviewRepository productReviewRepository;

    public Map<String,Object> getProductList(int page, int size){
        Pageable pageable = PageRequest.of(page,size);
        Page<Product> products = productRepository.findAll(pageable);
        List<ProductDto> productDto = products.stream().map(this::convertToDto).collect(Collectors.toList());
        Map<String,Object> response = new HashMap<>();
        response.put("products",productDto);
        response.put("total products",products.getTotalElements());
        
        return response;
    }

    public Product getProductById(Long id){
        return productRepository.findById(id).orElseThrow(()-> new RuntimeException("Product not found"));
    }

    public List<ProductDto> filterProducts(String category, Double minPrice, Double maxPrice, String keyword, Double ratings){
        Specification<Product> spec =
                Specification.where(ProductSpecification.hasCategory(category))
                        .and(ProductSpecification.hasPrice(minPrice, maxPrice))
                        .and(ProductSpecification.hasKeyword(keyword))
                        .and(ProductSpecification.hasRatings(ratings));

        return productRepository.findAll(spec)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void addReview(ProductReviewDto productReviewDto) {
        Product product = productRepository.findById(productReviewDto.getId()).orElseThrow(() -> new RuntimeException("Product not found"));
        ProductReview productReview = new ProductReview();
        productReview.setComment(productReviewDto.getComment());
        productReview.setRating(productReviewDto.getRating());
        productReview.setProduct(product);
        productReviewRepository.save(productReview);
        product.setNumOfReviews(product.getReviews().size());
        productRepository.save(product);
    }

    public void deleteReview(Long reviewId) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Product product = review.getProduct();

        productReviewRepository.delete(review);
        product.setNumOfReviews(product.getReviews().size());
        productRepository.save(product);
    }

    public void addImages(ProductImageDto productImageDto) {

    }

    public ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setRating(product.getRating());
        dto.setCategory(product.getCategory());
        dto.setSeller(product.getSeller());
        dto.setStock(product.getStock());
        dto.setNumOfReviews(product.getNumOfReviews());

        List<ProductReviewDto> productReviewDto = product.getReviews()
                .stream()
                .map(review -> {
                    ProductReviewDto reviewDto = new ProductReviewDto();
                    reviewDto.setId(review.getId());
                    reviewDto.setComment(review.getComment());
                    reviewDto.setRating(review.getRating());
                    return reviewDto;
                })
                .collect(Collectors.toList());

        dto.setReviews(productReviewDto);

        List<ProductImageDto> productImageDto  = product.getImages().stream().map(image -> {
            ProductImageDto imageDto = new ProductImageDto(image.getPublicId());
            return imageDto;
        }).collect(Collectors.toList());

        dto.setImages(productImageDto);

        return dto;
    }
}
