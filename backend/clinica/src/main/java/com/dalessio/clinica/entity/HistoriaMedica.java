package com.dalessio.clinica.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "historia_medica")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", unique = true, nullable = false)
    private Turno turno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Usuario paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialista_id", nullable = false)
    private Usuario especialista;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime fecha;

    @NotNull
    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal altura;

    @NotNull
    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal peso;

    @NotNull
    @Column(precision = 4, scale = 1, nullable = false)
    private BigDecimal temperatura;

    @NotBlank
    @Column(length = 20, nullable = false)
    private String presion;

    @Column(length = 100)
    private String clave1;

    @Column(length = 255)
    private String valor1;

    @Column(length = 100)
    private String clave2;

    @Column(length = 255)
    private String valor2;

    @Column(length = 100)
    private String clave3;

    @Column(length = 255)
    private String valor3;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
