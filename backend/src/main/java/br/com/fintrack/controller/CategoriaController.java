package br.com.fintrack.controller;

import br.com.fintrack.dto.CategoriaDTO;
import br.com.fintrack.service.CategoriaService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/categorias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoriaController {

    @Inject
    CategoriaService categoriaService;

    @GET
    public List<CategoriaDTO> listarTodas() {
        return categoriaService.listarTodas();
    }

    @GET
    @Path("/{id}")
    public CategoriaDTO buscarPorId(@PathParam("id") Long id) {
        return categoriaService.buscarPorId(id);
    }

    @POST
    public Response criar(@Valid CategoriaDTO dto) {
        CategoriaDTO criada = categoriaService.criar(dto);
        return Response.status(Response.Status.CREATED).entity(criada).build();
    }

    @PUT
    @Path("/{id}")
    public CategoriaDTO atualizar(@PathParam("id") Long id, @Valid CategoriaDTO dto) {
        return categoriaService.atualizar(id, dto);
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        categoriaService.deletar(id);
        return Response.noContent().build();
    }
}
