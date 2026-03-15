package br.com.fintrack.service;

import br.com.fintrack.dto.CategoriaDTO;
import br.com.fintrack.model.Categoria;
import br.com.fintrack.repository.CategoriaRepository;
import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CategoriaService {

    @Inject
    CategoriaRepository categoriaRepository;

    @CacheResult(cacheName = "categorias")
    public List<CategoriaDTO> listarTodas() {
        System.out.println("Buscando categorias no banco...");
        return categoriaRepository.listAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id);
        if (categoria == null) {
            throw new NotFoundException("Categoria não encontrada com id: " + id);
        }
        return toDTO(categoria);
    }

    @CacheInvalidateAll(cacheName = "categorias")
    @Transactional
    public CategoriaDTO criar(CategoriaDTO dto) {
        Categoria existente = categoriaRepository.findByNome(dto.nome);
        if (existente != null) {
            throw new IllegalArgumentException("Já existe uma categoria com o nome: " + dto.nome);
        }

        Categoria categoria = new Categoria();
        categoria.nome = dto.nome;
        categoria.descricao = dto.descricao;
        categoriaRepository.persist(categoria);

        return toDTO(categoria);
    }

    @CacheInvalidateAll(cacheName = "categorias")
    @Transactional
    public CategoriaDTO atualizar(Long id, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(id);
        if (categoria == null) {
            throw new NotFoundException("Categoria não encontrada com id: " + id);
        }

        categoria.nome = dto.nome;
        categoria.descricao = dto.descricao;

        return toDTO(categoria);
    }

    @CacheInvalidateAll(cacheName = "categorias")
    @Transactional
    public void deletar(Long id) {
        Categoria categoria = categoriaRepository.findById(id);
        if (categoria == null) {
            throw new NotFoundException("Categoria não encontrada com id: " + id);
        }
        categoriaRepository.delete(categoria);
    }

    private CategoriaDTO toDTO(Categoria categoria) {
        return new CategoriaDTO(categoria.id, categoria.nome, categoria.descricao);
    }
}
