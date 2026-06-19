package com.edcode.edkart.controller;

import com.edcode.edkart.dto.CreateOrderList;
import com.edcode.edkart.dto.OrderCreated;
import com.edcode.edkart.entity.Order;
import com.edcode.edkart.services.OrderServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    public OrderServices orderServices;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderList createOrderList){
        OrderCreated orderNo = orderServices.createOrder(createOrderList);
        return ResponseEntity.ok().body(orderNo);
    }

    @GetMapping("/{orderNo}")
    public ResponseEntity<?> getOrder(@PathVariable String orderNo){
        Order order = orderServices.getOrder(orderNo);
        return ResponseEntity.ok().body(order);
    }
}
