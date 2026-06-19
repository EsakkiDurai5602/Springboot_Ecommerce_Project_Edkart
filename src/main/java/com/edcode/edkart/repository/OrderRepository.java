package com.edcode.edkart.repository;

import com.edcode.edkart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
    Optional<Order> findByOrderNo(String orderNo);
}
