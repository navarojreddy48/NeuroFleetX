package com.neurofleetx.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_heatmap")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficHeatmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "congestion_level", nullable = false)
    private Integer congestionLevel;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;
}
