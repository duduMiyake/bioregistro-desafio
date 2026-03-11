package br.com.fintrack.repository;

import br.com.fintrack.model.Categoria;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CategoriaRepository implements PanacheRepository<Categoria> {

    public Categoria findByNome(String nome) {
        return find("nome", nome).firstResult();
    }
}
