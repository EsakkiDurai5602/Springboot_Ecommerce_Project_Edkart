package com.edcode.edkart.dto;

import java.util.List;

public class CreateOrderList {
    private List<OrderItemDto> orderItemDto;

    public List<OrderItemDto> getOrderItemDto() {
        return orderItemDto;
    }

    public void setOrderItemDto(List<OrderItemDto> orderItemDto) {
        this.orderItemDto = orderItemDto;
    }
}
