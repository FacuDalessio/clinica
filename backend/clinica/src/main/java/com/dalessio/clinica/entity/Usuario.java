package com.dalessio.clinica.entity;

import com.dalessio.clinica.enums.TipoUsuario;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(length = 100, nullable = false)
    private String nombre;

    @NotBlank
    @Column(length = 100, nullable = false)
    private String apellido;

    @NotNull
    @Min(0)
    private Integer edad;

    @NotBlank
    @Column(length = 20, unique = true, nullable = false)
    private String dni;

    @NotBlank
    @Email
    @Column(length = 150, unique = true, nullable = false)
    private String mail;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false)
    private TipoUsuario tipoUsuario;

    @Column(name = "obra_social", length = 100)
    private String obraSocial;

    @Column(nullable = false)
    private Boolean verificado = false;

    @Column(name = "email_verificado", nullable = false)
    private Boolean emailVerificado = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "usuario_especialidad", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "especialidad_id"))
    private Set<Especialidad> especialidades = new HashSet<>();

    // Helper method for adding specialty
    public void addEspecialidad(Especialidad especialidad) {
        this.especialidades.add(especialidad);
        especialidad.getEspecialistas().add(this);
    }
}
