package com.edcode.edkart.dto;

public class OrderCreated {
    public String getOrderNo() {
        return OrderNo;
    }

    public void setOrderNo(String orderNo) {
        OrderNo = orderNo;
    }

    private String OrderNo;

    public OrderCreated(String orderNo) {
        OrderNo = orderNo;
    }
}
