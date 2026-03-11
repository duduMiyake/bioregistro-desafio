package br.com.fintrack.dto;

import br.com.fintrack.model.TipoTransacao;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransacaoDTO {

    public Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 3, max = 255)
    public String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    public BigDecimal valor;

    @NotNull(message = "Tipo é obrigatório")
    public TipoTransacao tipo;

    @NotNull(message = "Data é obrigatória")
    public LocalDate data;

    public Long categoriaId;
    public String categoriaNome;

    public TransacaoDTO() {
    }

    public TransacaoDTO(Long id, String descricao, BigDecimal valor, TipoTransacao tipo,
            LocalDate data, Long categoriaId, String categoriaNome) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
        this.tipo = tipo;
        this.data = data;
        this.categoriaId = categoriaId;
        this.categoriaNome = categoriaNome;
    }
}
