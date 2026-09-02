package com.edcode.edkart.services;

import com.edcode.edkart.dto.CreateOrderList;
import com.edcode.edkart.dto.OrderCreated;
import com.edcode.edkart.dto.OrderItemDto;
import com.edcode.edkart.entity.Order;
import com.edcode.edkart.entity.OrderItem;
import com.edcode.edkart.entity.Product;
import com.edcode.edkart.repository.OrderRepository;
import com.edcode.edkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class OrderServices {
    @Autowired
    public ProductRepository productRepository;

    @Autowired
    public OrderRepository orderRepository;

    @Transactional
    public OrderCreated createOrder(CreateOrderList orderList){
        Order order = new Order();
        Double totalItemAmount=0.0;
        order.setStatus("PENDING");

        for(OrderItemDto item : orderList.getOrderItemDto()){
            OrderItem orderItem = new OrderItem();
            orderItem.setName(item.getName());
            orderItem.setImage(item.getImage());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());

            Product product = productRepository.findById(item.getPublicId()).orElseThrow(() -> new RuntimeException("Product not found"));
            orderItem.setProduct(product);

            order.getOrderItem().add(orderItem);
            totalItemAmount+=(Double)orderItem.getPrice()*orderItem.getQuantity();

        }
        order.setTotalItemAmount(totalItemAmount);
        Double taxAmount=totalItemAmount*0.05;
        order.setTax(taxAmount);
        order.setTotalAmount(order.getTotalItemAmount()+order.getTax());
        String orderNo=UUID.randomUUID().toString();
        order.setOrderNo(orderNo);

        orderRepository.save(order);
        OrderCreated orderCreated = new OrderCreated(orderNo);
        return orderCreated;
    }

    public Order getOrder(String orderNo){
        Order order = orderRepository.findByOrderNo(orderNo).orElseThrow(()->new RuntimeException("Order not found"));
        return order;
    }
}
