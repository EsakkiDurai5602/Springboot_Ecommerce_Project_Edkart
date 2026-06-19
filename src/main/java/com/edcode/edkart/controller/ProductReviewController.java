package com.edcode.edkart.controller;

import com.edcode.edkart.dto.ProductReviewDto;
import com.edcode.edkart.services.ProductServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/product/reviews")
public class ProductReviewController {

    @Autowired
    private ProductServices productServices;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody @Valid ProductReviewDto productReviewDto){
        productServices.addReview(productReviewDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review Added");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        productServices.deleteReview(id);

        return ResponseEntity.ok("Review Deleted Successfully");
    }
}
