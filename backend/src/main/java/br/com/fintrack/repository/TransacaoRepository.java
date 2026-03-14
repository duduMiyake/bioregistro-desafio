package br.com.fintrack.repository;

import br.com.fintrack.model.TipoTransacao;
import br.com.fintrack.model.Transacao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class TransacaoRepository implements PanacheRepository<Transacao> {

    public List<Transacao> findByPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return list("data >= ?1 AND data <= ?2", dataInicio, dataFim);
    }

    public List<Transacao> findByCategoria(Long categoriaId) {
        return list("categoria.id", categoriaId);
    }

    public List<Transacao> findByTipo(TipoTransacao tipo) {
        return list("tipo", tipo);
    }

    public List<Transacao> findByPeriodoAndCategoria(LocalDate dataInicio, LocalDate dataFim, Long categoriaId) {
        return list("data >= ?1 AND data <= ?2 AND categoria.id = ?3", dataInicio, dataFim, categoriaId);
    }
}
