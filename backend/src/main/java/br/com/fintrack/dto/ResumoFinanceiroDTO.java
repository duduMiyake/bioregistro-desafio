package br.com.fintrack.dto;

import java.math.BigDecimal;

public class ResumoFinanceiroDTO {

    public BigDecimal totalReceitas;
    public BigDecimal totalDespesas;
    public BigDecimal saldo;
    public Long quantidadeTransacoes;

    public ResumoFinanceiroDTO() {
    }

    public ResumoFinanceiroDTO(BigDecimal totalReceitas, BigDecimal totalDespesas,
            BigDecimal saldo, Long quantidadeTransacoes) {
        this.totalReceitas = totalReceitas;
        this.totalDespesas = totalDespesas;
        this.saldo = saldo;
        this.quantidadeTransacoes = quantidadeTransacoes;
    }
}
