package br.com.fintrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoriaDTO {

    public Long id;

    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(min = 2, max = 100)
    public String nome;

    @Size(max = 255)
    public String descricao;

    public CategoriaDTO() {
    }

    public CategoriaDTO(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }
}
