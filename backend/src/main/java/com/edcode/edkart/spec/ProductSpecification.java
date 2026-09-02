package com.edcode.edkart.spec;

import com.edcode.edkart.dto.ProductDto;
import com.edcode.edkart.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasCategory(String category){
        return (root, query, cb) ->
                category==null || category.isBlank() ? null : cb.equal(root.get("category"),category);

    }

    public static Specification<Product> hasPrice(Double min, Double max){
        return (root, query, cb) -> {
            if (max == null && min == null) return null;
            if (max == null) return cb.greaterThanOrEqualTo(root.get("price"),min);
            if (min == null) return cb.lessThanOrEqualTo(root.get("price"),max);
            return cb.between(root.get("price"),min,max);
        };
    }

    public static Specification<Product> hasKeyword(String keyword) {

        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank())
                return null;

            String search = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), search),
                    cb.like(cb.lower(root.get("description")), search)
            );
        };

    }

    public static Specification<Product> hasRatings(Double ratings){
        return ((root, query, cb) -> {
            return cb.greaterThanOrEqualTo(root.get("rating"),ratings);
        });
    }
}
