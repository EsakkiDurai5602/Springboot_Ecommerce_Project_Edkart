package com.edcode.edkart.controller;

import com.edcode.edkart.dto.ProductDto;
import com.edcode.edkart.entity.Product;
import com.edcode.edkart.services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductServices productServices;

    @GetMapping
    public ResponseEntity<Map<String,Object>> getAllProducts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "100") int size){
        Map<String,Object> products = productServices.getProductList(page,size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public Product getSingleProduct(@PathVariable Long id){
        return productServices.getProductById(id);
    }

    @GetMapping("/search")
    public List<ProductDto> getThisCategory
            (@RequestParam(required = false) String category, @RequestParam(required = false)
            Double minPrice, @RequestParam(required = false) Double maxPrice, @RequestParam(required = false) String keyword,
            @RequestParam(required=false) Double ratings){
        List<ProductDto> products = productServices.filterProducts(category,minPrice,maxPrice,keyword,ratings);
        return products;
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody Product product) {
        ProductDto created = productServices.createProduct(product);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        ProductDto updated = productServices.updateProduct(id, product);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productServices.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}
