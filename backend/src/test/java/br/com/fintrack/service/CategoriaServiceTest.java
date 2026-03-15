package br.com.fintrack.service;

import br.com.fintrack.dto.CategoriaDTO;
import br.com.fintrack.model.Categoria;
import br.com.fintrack.repository.CategoriaRepository;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @Mock
    CategoriaRepository categoriaRepository;

    @InjectMocks
    CategoriaService categoriaService;

    @Test
    void listarTodasCategoriasCorretamente() {
        Categoria categoria1 = new Categoria();
        categoria1.id = 1L;
        categoria1.nome = "Alimentação";
        categoria1.descricao = "Gastos com comida";

        Categoria categoria2 = new Categoria();
        categoria2.id = 2L;
        categoria2.nome = "Transporte";
        categoria2.descricao = "Gastos com locomoção";

        when(categoriaRepository.listAll()).thenReturn(List.of(categoria1, categoria2));

        List<CategoriaDTO> resultado = categoriaService.listarTodas();

        assertEquals(2, resultado.size());
        assertEquals("Alimentação", resultado.get(0).nome);
        assertEquals("Transporte", resultado.get(1).nome);
    }

    @Test
    void lancarExcecaoQuandoBuscarCategoriaInexistente() {
        when(categoriaRepository.findById(1L)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> categoriaService.buscarPorId(1L));
    }

    @Test
    void criarCategoriaComNomeDuplicado() {
        Categoria existente = new Categoria();
        existente.id = 1L;
        existente.nome = "Alimentação";
        existente.descricao = "Categoria já existente";

        when(categoriaRepository.findByNome("Alimentação")).thenReturn(existente);

        CategoriaDTO dto = new CategoriaDTO(null, "Alimentação", "Gastos com comida");

        assertThrows(IllegalArgumentException.class, () -> categoriaService.criar(dto));
    }

    @Test
    void criarCategoriaComSucesso() {
        when(categoriaRepository.findByNome("Lazer")).thenReturn(null);

        CategoriaDTO dto = new CategoriaDTO(null, "Lazer", "Gastos com entretenimento");

        CategoriaDTO resultado = categoriaService.criar(dto);

        verify(categoriaRepository).persist(any(Categoria.class));
        assertEquals("Lazer", resultado.nome);
        assertEquals("Gastos com entretenimento", resultado.descricao);
    }

    @Test
    void lancarExcecaoAoAtualizarCategoriaInexistente() {
        when(categoriaRepository.findById(1L)).thenReturn(null);

        CategoriaDTO dto = new CategoriaDTO(null, "Saúde", "Gastos médicos");

        assertThrows(NotFoundException.class, () -> categoriaService.atualizar(1L, dto));
    }

    @Test
    void lancarExcecaoAoDeletarCategoriaInexistente() {
        when(categoriaRepository.findById(1L)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> categoriaService.deletar(1L));
    }
}