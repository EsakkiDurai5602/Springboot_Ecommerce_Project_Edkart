package com.edcode.edkart.seed;

import com.edcode.edkart.entity.Product;
import com.edcode.edkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
public class ProductSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if(productRepository.count() == 0){
            List<Product> demoProducts = List.of(
                    new Product(null, "Apple iPhone 16 Pro Max", 144900.00, "Apple Authorized Store", "Flagship A18 Pro Bionic chip, 48MP Fusion Camera, Grade 5 Titanium finish", "Smartphones", 90, 4.9, List.of(
                            "/assets/products/iphone16_pro.jpg",
                            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Samsung Galaxy S24 Ultra", 129999.00, "Samsung Official Store", "Snapdragon 8 Gen 3, Titanium Frame, 200MP Quad Telephoto AI Camera with S-Pen", "Smartphones", 75, 4.8, List.of(
                            "/assets/products/samsung_s24_ultra.jpg",
                            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Google Pixel 9 Pro 5G", 109999.00, "Google Authorized Store", "Google Tensor G4, Gemini Nano AI on-device, Super Res Zoom 30x with Pro Camera Visor", "Smartphones", 50, 4.8, List.of(
                            "/assets/products/pixel_9_pro.jpg",
                            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "OnePlus 12 5G (16GB RAM)", 64999.00, "OnePlus Official", "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile, 5400mAh 100W SUPERVOOC", "Smartphones", 60, 4.7, List.of(
                            "/assets/products/oneplus_12.jpg",
                            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Apple MacBook Pro 16\" M3 Max", 349900.00, "Apple Authorized Store", "16-core CPU, 40-core GPU, 36GB Unified Memory, Liquid Retina XDR", "Laptops", 25, 5.0, List.of(
                            "/assets/products/macbook_pro.jpg",
                            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Dell XPS 16 OLED Laptop", 249990.00, "Dell Official Store", "Intel Core Ultra 9, 32GB RAM, 1TB NVMe, RTX 4070 8GB Graphics", "Laptops", 30, 4.7, List.of(
                            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Sony WH-1000XM5 Wireless ANC", 29990.00, "Sony Official Store", "Industry-leading Noise Cancelling with 2 processors, 8 microphones, LDAC", "Audio", 85, 4.8, List.of(
                            "/assets/products/sony_headphones.jpg",
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Apple Watch Ultra 2 Titanium", 89900.00, "Apple Authorized Store", "Rugged 49mm Titanium case, Precision dual-frequency GPS, 3000 nits display", "Wearables", 40, 4.9, List.of(
                            "/assets/products/watch_ultra.jpg",
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Sony PlayStation 5 Slim 1TB", 54990.00, "Sony PlayStation India", "Ultra-High Speed SSD, Integrated I/O, Ray Tracing 4K 120Hz HDR Gaming", "Gaming", 65, 5.0, List.of(
                            "/assets/products/ps5_console.jpg",
                            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Logitech MX Master 3S Wireless Mouse", 9995.00, "Logitech Store", "8K DPI optical tracking, Quiet Clicks, MagSpeed electromagnetic scrolling", "Accessories", 150, 4.8, List.of(
                            "/assets/products/mx_master_mouse.jpg",
                            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Razer DeathAdder V3 Pro Esports Mouse", 12999.00, "Razer Authorized Store", "Ultra-lightweight 63g ergonomic design, Focus Pro 30K Optical Sensor, Gen-3 switches", "Accessories", 80, 4.9, List.of(
                            "/assets/products/razer_gaming_mouse.jpg",
                            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
                    )),
                    new Product(null, "Sony Bravia 4K OLED 65\" TV", 189900.00, "Sony Official Flagship", "Cognitive Processor XR, XR OLED Contrast Pro, Acoustic Surface Audio+", "Electronics", 15, 4.8, List.of(
                            "/assets/products/sony_oled_tv.jpg",
                            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80"
                    ))
            );
            productRepository.saveAll(demoProducts);
            System.out.println(">>> Seeded distinct products with unique AI-generated assets successfully.");
        } else {
            System.out.println(">>> Products already exist in database (" + productRepository.count() + " products). Preservation active.");
        }
    }
}
