package com.edcode.edkart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

@SpringBootApplication
public class EdkartApplication {

	public static void main(String[] args) {
		SpringApplication.run(EdkartApplication.class, args);
	}

}
