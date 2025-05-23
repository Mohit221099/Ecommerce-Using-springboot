package com.simpleshop.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private String username;
    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}