package br.com.fintrack.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.*;

import java.util.Map;

@Path("/api/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthController {

    @GET
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "version", "1.0.0"
        );
    }
}