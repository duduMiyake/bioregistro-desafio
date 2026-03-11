package br.com.fintrack.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categoria")
public class Categoria extends PanacheEntity {

    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Column(nullable = false, unique = true, length = 100)
    public String nome;

    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    @Column(length = 255)
    public String descricao;

    @Column(name = "criado_em")
    public LocalDateTime criadoEm;

    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    public List<Transacao> transacoes;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

    public static Categoria findByNome(String nome) {
        return find("nome", nome).firstResult();
    }
}
