package com.edcode.edkart.seed;

import com.edcode.edkart.entity.Product;
import com.edcode.edkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if(productRepository.count()==0){
            List<Product> demoProducts = List.of(
                    new Product(null, "Apple iPhone 16", 56000.00, "Mark Store", "New Launched version", "Phone", 90, 4.5, List.of("products/1.jpg")),
                    new Product(null, "Samsung Galaxy S25", 72000.00, "Tech World", "Flagship Samsung mobile", "Phone", 75, 4.0, List.of("products/2.jpg")),
                    new Product(null, "OnePlus 13", 48000.00, "Mobile Hub", "Fast performance smartphone", "Phone", 60, 4.1, List.of("products/3.jpg")),
                    new Product(null, "Realme GT 7", 32000.00, "Smart Zone", "Gaming mobile with AMOLED display", "Phone", 120, 3.8, List.of("products/4.jpg")),
                    new Product(null, "Redmi Note 15", 21000.00, "Redmi Center", "Budget friendly 5G phone", "Phone", 150, 5.0, List.of("products/5.jpg")),
                    new Product(null, "Vivo V40", 29000.00, "Vivo Store", "Stylish camera phone", "Phone", 85, 4.2, List.of("products/6.jpg")),
                    new Product(null, "Oppo Reno 12", 34000.00, "Oppo World", "Premium design smartphone", "Phone", 70, 4.3, List.of("products/7.jpg")),

                    new Product(null, "Sony Wireless Headphones", 8999.00, "Audio Mart", "Noise cancelling headphones", "Electronics", 45, 4.6, List.of("products/8.jpg")),
                    new Product(null, "Dell Inspiron Laptop", 58000.00, "Dell Store", "Laptop for work and study", "Electronics", 30, 4.4, List.of("products/9.jpg")),
                    new Product(null, "HP Pavilion Laptop", 62000.00, "HP World", "High performance laptop", "Electronics", 25, 4.5, List.of("products/10.jpg")),
                    new Product(null, "Boat Smart Watch", 2499.00, "Boat Store", "Fitness tracking smartwatch", "Electronics", 100, 3.9, List.of("products/11.jpg")),
                    new Product(null, "Logitech Wireless Mouse", 999.00, "Computer Hub", "Smooth wireless mouse", "Electronics", 200, 4.7, List.of("products/12.jpg")),
                    new Product(null, "Samsung LED TV", 42000.00, "Home Electronics", "Smart LED television", "Electronics", 20, 4.4, List.of("products/13.jpg")),
                    new Product(null, "JBL Bluetooth Speaker", 4999.00, "Sound Zone", "Portable bass speaker", "Electronics", 65, 4.3, List.of("products/14.jpg")),

                    new Product(null, "Men Cotton Shirt", 799.00, "Fashion Hub", "Comfortable casual shirt", "Cloth", 140, 4.1, List.of("products/15.jpg")),
                    new Product(null, "Women Kurti", 1199.00, "Style Store", "Stylish printed kurti", "Cloth", 110, 4.5, List.of("products/16.jpg")),
                    new Product(null, "Men Jeans", 1499.00, "Denim World", "Slim fit denim jeans", "Cloth", 95, 4.2, List.of("products/17.jpg")),
                    new Product(null, "Women Saree", 2499.00, "Textile Mart", "Traditional silk saree", "Cloth", 50, 4.8, List.of("products/18.jpg")),
                    new Product(null, "Kids T-Shirt", 499.00, "Kids Wear", "Soft cotton kids t-shirt", "Cloth", 180, 4.0, List.of("products/19.jpg")),
                    new Product(null, "Men Hoodie", 1299.00, "Urban Fashion", "Warm winter hoodie", "Cloth", 80, 4.3, List.of("products/20.jpg"))
            );
            productRepository.saveAll(demoProducts);
            System.out.println("Product successfully seeded");
        }
        else{
            System.out.println("Product already seeded");
        }

    }
}
