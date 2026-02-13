package com.dalessio.clinica.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("ESPECIALISTA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Especialista extends Usuario {

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "usuario_especialidad", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "especialidad_id"))
    private Set<Especialidad> especialidades = new HashSet<>();

    // Helper method for adding specialty
    public void addEspecialidad(Especialidad especialidad) {
        this.especialidades.add(especialidad);
        especialidad.getEspecialistas().add(this);
    }
}
