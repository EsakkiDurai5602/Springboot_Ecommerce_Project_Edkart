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

    @GetMapping
    public ResponseEntity<?> getAllOrders(){
        return ResponseEntity.ok().body(orderServices.getAllOrders());
    }

    @PutMapping("/{orderNo}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderNo, @RequestBody java.util.Map<String, String> body){
        String status = body.getOrDefault("status", "PROCESSING");
        Order order = orderServices.updateOrderStatus(orderNo, status);
        return ResponseEntity.ok().body(order);
    }
}
