package com.edcode.edkart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Value("${edkart.security.cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS using the helper bean below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Disable CSRF for stateless REST APIs. If cookies/sessions are utilized, CSRF protection is recommended.
                .csrf(csrf -> csrf.disable())
                
                // Session management (stateless REST APIs)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Configure standard security headers
                .headers(headers -> headers
                        // Content Security Policy (CSP) to mitigate XSS attacks
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; frame-ancestors 'none'; object-src 'none';"))
                        // Frame options to prevent clickjacking
                        .frameOptions(frame -> frame.deny())
                        // Enable browser XSS protection
                        .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                )
                
                // Endpoint authentication rules
                .authorizeHttpRequests(auth -> auth
                        // Publicly accessible paths (like actuator health, products)
                        .requestMatchers("/actuator/health", "/actuator/info", "/actuator/metrics").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/product/reviews/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll()
                        .anyRequest().permitAll() // Permit other APIs temporarily until custom authentication filter is defined
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Parse and set allowed origins
        if (allowedOrigins.equals("*")) {
            configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        } else {
            configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        }
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Link", "X-Total-Count"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // 1 hour cache response for pre-flight requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
