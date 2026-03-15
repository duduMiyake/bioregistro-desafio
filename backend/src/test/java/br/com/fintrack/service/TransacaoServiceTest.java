package br.com.fintrack.service;

import br.com.fintrack.dto.ResumoFinanceiroDTO;
import br.com.fintrack.dto.TransacaoDTO;
import br.com.fintrack.model.Transacao;
import br.com.fintrack.model.TipoTransacao;

import br.com.fintrack.repository.CategoriaRepository;
import br.com.fintrack.repository.TransacaoRepository;

import jakarta.ws.rs.NotFoundException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TransacaoServiceTest {

    @Mock
    TransacaoRepository transacaoRepository;

    @Mock
    CategoriaRepository categoriaRepository;

    @InjectMocks
    TransacaoService transacaoService;

    @Test
    void calcularResumoCorretamente() {
        Transacao receita = new Transacao();
        receita.valor = new BigDecimal("1000.00");
        receita.tipo = TipoTransacao.RECEITA;
        receita.data = LocalDate.now();

        Transacao despesa = new Transacao();
        despesa.valor = new BigDecimal("300.00");
        despesa.tipo = TipoTransacao.DESPESA;
        despesa.data = LocalDate.now();

        when(transacaoRepository.listAll()).thenReturn(List.of(receita, despesa));

        ResumoFinanceiroDTO resumo = transacaoService.calcularResumo();

        assertEquals(new BigDecimal("1000.00"), resumo.totalReceitas);
        assertEquals(new BigDecimal("300.00"), resumo.totalDespesas);
        assertEquals(new BigDecimal("700.00"), resumo.saldo);
        assertEquals(2L, resumo.quantidadeTransacoes);
    }

    @Test
    void lancarExcecaoQuandoBuscarTransacaoInexistente() {
        when(transacaoRepository.findById(1L)).thenReturn(null);

        assertThrows(NotFoundException.class,
                () -> transacaoService.buscarPorId(1L));
    }

    @Test
    void criarTransacaoComDataFutura() {
        TransacaoDTO dto = new TransacaoDTO(
                null,
                "Salário",
                new BigDecimal("1000.00"),
                TipoTransacao.RECEITA,
                LocalDate.now().plusDays(1),
                null,
                null
        );

        assertThrows(IllegalArgumentException.class,
                () -> transacaoService.criar(dto));
    }

    @Test
    void criarTransacaoComSucesso() {

        TransacaoDTO dto = new TransacaoDTO(
                null,
                "Freelance",
                new BigDecimal("500.00"),
                TipoTransacao.RECEITA,
                LocalDate.now(),
                null,
                null
        );

        TransacaoDTO resultado = transacaoService.criar(dto);

        verify(transacaoRepository).persist(any(Transacao.class));

        assertEquals("Freelance", resultado.descricao);
        assertEquals(new BigDecimal("500.00"), resultado.valor);
        assertEquals(TipoTransacao.RECEITA, resultado.tipo);
    }

    @Test
    void lancarExcecaoAoAtualizarTransacaoInexistente() {

        when(transacaoRepository.findById(1L)).thenReturn(null);

        TransacaoDTO dto = new TransacaoDTO(
                null,
                "Teste",
                new BigDecimal("100"),
                TipoTransacao.DESPESA,
                LocalDate.now(),
                null,
                null
        );

        assertThrows(NotFoundException.class,
                () -> transacaoService.atualizar(1L, dto));
    }

    @Test
    void lancarExcecaoAoDeletarTransacaoInexistente() {

        when(transacaoRepository.findById(1L)).thenReturn(null);

        assertThrows(NotFoundException.class,
                () -> transacaoService.deletar(1L));
    }

}
