package br.com.fintrack.controller;

import br.com.fintrack.dto.ResumoFinanceiroDTO;
import br.com.fintrack.dto.TransacaoDTO;
import br.com.fintrack.service.TransacaoService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;

@Path("/api/transacoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransacaoController {

    @Inject
    TransacaoService transacaoService;

    @GET
    public List<TransacaoDTO> listarTodas() {
        return transacaoService.listarTodas();
    }

    @GET
    @Path("/{id}")
    public TransacaoDTO buscarPorId(@PathParam("id") Long id) {
        return transacaoService.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid TransacaoDTO dto) {
        TransacaoDTO criada = transacaoService.criar(dto);
        return Response.status(Response.Status.CREATED).entity(criada).build();
    }

    @PUT
    @Path("/{id}")
    public TransacaoDTO atualizar(@PathParam("id") Long id, @Valid TransacaoDTO dto) {
        return transacaoService.atualizar(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        transacaoService.deletar(id);
        return Response.noContent().build();
    }

    @GET
    @Path("/periodo")
    public List<TransacaoDTO> listarPorPeriodo(
            @QueryParam("dataInicio") String dataInicio,
            @QueryParam("dataFim") String dataFim) {
        LocalDate inicio = LocalDate.parse(dataInicio);
        LocalDate fim = LocalDate.parse(dataFim);
        return transacaoService.listarPorPeriodo(inicio, fim);
    }

    @GET
    @Path("/categoria/{categoriaId}")
    public List<TransacaoDTO> listarPorCategoria(@PathParam("categoriaId") Long categoriaId) {
        return transacaoService.listarPorCategoria(categoriaId);
    }

    @GET
    @Path("/resumo")
    public ResumoFinanceiroDTO resumoFinanceiro() {
        return transacaoService.calcularResumo();
    }
}
