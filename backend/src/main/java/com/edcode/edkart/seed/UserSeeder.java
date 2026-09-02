package com.edcode.edkart.seed;

import com.edcode.edkart.entity.User;
import com.edcode.edkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(1)
public class UserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            List<User> initialUsers = List.of(
                    new User(null, "admin@edkart.com", "Store Operations Admin", "Admin@123", "ADMIN", "+91 98765 00001", "Level 5, HQ Cyber Tower", "Bangalore", "Karnataka", "560100", LocalDateTime.now()),
                    new User(null, "esakki@gmail.com", "Esakki Durai", "Password@123", "USER", "+91 98765 43210", "42 Silicon Boulevard", "Bangalore", "Karnataka", "560100", LocalDateTime.now()),
                    new User(null, "alex.turner@gmail.com", "Alex Turner", "Password@123", "USER", "+91 98765 43211", "78 Ocean Drive", "Mumbai", "Maharashtra", "400001", LocalDateTime.now()),
                    new User(null, "priya.sharma@gmail.com", "Priya Sharma", "Password@123", "USER", "+91 98765 43212", "15 Tech Residency", "Hyderabad", "Telangana", "500081", LocalDateTime.now()),
                    new User(null, "rohit.verma@gmail.com", "Rohit Verma", "Password@123", "USER", "+91 98765 43213", "88 Gamers Arena", "Delhi", "Delhi", "110001", LocalDateTime.now()),
                    new User(null, "user@edkart.com", "Demo Customer", "Password@123", "USER", "+91 98765 43214", "10 Green Park Lane", "Chennai", "Tamil Nadu", "600001", LocalDateTime.now())
            );
            userRepository.saveAll(initialUsers);
            System.out.println(">>> 5 Initial Users successfully seeded into database.");
        } else {
            System.out.println(">>> Users already exist in database (" + userRepository.count() + " users). Preservation active.");
        }
    }
}
