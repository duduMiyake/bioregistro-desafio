package br.com.fintrack.service;

import br.com.fintrack.dto.ResumoFinanceiroDTO;
import br.com.fintrack.dto.TransacaoDTO;
import br.com.fintrack.model.Categoria;
import br.com.fintrack.model.TipoTransacao;
import br.com.fintrack.model.Transacao;
import br.com.fintrack.repository.CategoriaRepository;
import br.com.fintrack.repository.TransacaoRepository;
import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class TransacaoService {

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    CategoriaRepository categoriaRepository;

    public List<TransacaoDTO> listarTodas() {
        return transacaoRepository.listAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TransacaoDTO buscarPorId(Long id) {
        Transacao transacao = transacaoRepository.findById(id);
        if (transacao == null) {
            throw new NotFoundException("Transação não encontrada com id: " + id);
        }
        return toDTO(transacao);
    }

    @CacheInvalidateAll(cacheName = "resumo-financeiro")
    @Transactional
    public TransacaoDTO criar(TransacaoDTO dto) {
        validarTransacao(dto);

        Transacao transacao = new Transacao();
        transacao.descricao = dto.descricao;
        transacao.valor = dto.valor;
        transacao.tipo = dto.tipo;
        transacao.data = dto.data;

        if (dto.categoriaId != null) {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId);
            if (categoria == null) {
                throw new NotFoundException("Categoria não encontrada com id: " + dto.categoriaId);
            }
            transacao.categoria = categoria;
        }

        transacaoRepository.persist(transacao);
        return toDTO(transacao);
    }

    @CacheInvalidateAll(cacheName = "resumo-financeiro")
    @Transactional
    public TransacaoDTO atualizar(Long id, TransacaoDTO dto) {
        Transacao transacao = transacaoRepository.findById(id);
        if (transacao == null) {
            throw new NotFoundException("Transação não encontrada com id: " + id);
        }

        validarTransacao(dto);

        transacao.descricao = dto.descricao;
        transacao.valor = dto.valor;
        transacao.tipo = dto.tipo;
        transacao.data = dto.data;

        if (dto.categoriaId != null) {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId);
            if (categoria == null) {
                throw new NotFoundException("Categoria não encontrada com id: " + dto.categoriaId);
            }
            transacao.categoria = categoria;
        } else {
            transacao.categoria = null;
        }

        return toDTO(transacao);
    }

    @CacheInvalidateAll(cacheName = "resumo-financeiro")
    @Transactional
    public void deletar(Long id) {
        Transacao transacao = transacaoRepository.findById(id);
        if (transacao == null) {
            throw new NotFoundException("Transação não encontrada com id: " + id);
        }
        transacaoRepository.delete(transacao);
    }

    public List<TransacaoDTO> listarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return transacaoRepository.findByPeriodo(dataInicio, dataFim)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransacaoDTO> listarPorCategoria(Long categoriaId) {
        return transacaoRepository.findByCategoria(categoriaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    
    @CacheResult(cacheName = "resumo-financeiro")
    public ResumoFinanceiroDTO calcularResumo() {
        
        System.out.println("Calculando resumo no banco...");
        
        List<Transacao> todas = transacaoRepository.listAll();

        BigDecimal totalReceitas = BigDecimal.ZERO;
        BigDecimal totalDespesas = BigDecimal.ZERO;

        for (Transacao t : todas) {
            if (t.tipo == TipoTransacao.RECEITA) {
                totalReceitas = totalReceitas.add(t.valor);
            } else {
                totalDespesas = totalDespesas.add(t.valor);
            }
        }

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);
        return new ResumoFinanceiroDTO(totalReceitas, totalDespesas, saldo, (long) todas.size());
    }

    private void validarTransacao(TransacaoDTO dto) {
        if (dto.data != null && dto.data.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Data da transação não pode ser no futuro");
        }
    }

    private TransacaoDTO toDTO(Transacao transacao) {
        return new TransacaoDTO(
                transacao.id,
                transacao.descricao,
                transacao.valor,
                transacao.tipo,
                transacao.data,
                transacao.categoria != null ? transacao.categoria.id : null,
                transacao.categoria != null ? transacao.categoria.nome : null);
    }
}
