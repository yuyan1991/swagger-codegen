package io.swagger.generator.resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.codegen.CliOption;
import io.swagger.codegen.Codegen;
import io.swagger.codegen.CodegenConfig;
import io.swagger.codegen.CodegenType;
import io.swagger.generator.exception.BadRequestException;
import io.swagger.generator.model.Generated;
import io.swagger.generator.model.GeneratorInput;
import io.swagger.generator.model.ResponseCode;
import io.swagger.generator.online.Generator;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.util.*;

@Path("/gen")
@Api(value = "/gen", description = "Resource for generating swagger components")
@SuppressWarnings("static-method")
public class SwaggerResource {
    static List<String> clients = new ArrayList<String>();
    static List<String> servers = new ArrayList<String>();
    private static Map<String, Generated> fileMap = new HashMap<String, Generated>();

    static {
        List<CodegenConfig> extensions = Codegen.getExtensions();
        for (CodegenConfig config : extensions) {
            if (config.getTag().equals(CodegenType.CLIENT)
                    || config.getTag().equals(CodegenType.DOCUMENTATION)) {
                clients.add(config.getName());
            } else if (config.getTag().equals(CodegenType.SERVER)) {
                servers.add(config.getName());
            }
        }

        Collections.sort(clients, String.CASE_INSENSITIVE_ORDER);
        Collections.sort(servers, String.CASE_INSENSITIVE_ORDER);
    }

    @GET
    @Path("/download/{fileId}")
    @Produces({MediaType.APPLICATION_OCTET_STREAM})
    @ApiOperation(
            value = "Downloads a pre-generated file",
            notes = "A valid `fileId` is generated by the `/clients/{language}` or `/servers/{language}` POST "
                    + "operations.  The fileId code can be used just once, after which a new `fileId` will need to "
                    + "be requested.", response = String.class, tags = {"clients", "servers"})
    public Response downloadFile(@PathParam("fileId") String fileId) throws Exception {
        Generated g = fileMap.get(fileId);
        System.out.println("looking for fileId " + fileId);
        System.out.println("got filename " + g.getFilename());
        if (g.getFilename() != null) {
            File file = new java.io.File(g.getFilename());
            byte[] bytes = org.apache.commons.io.FileUtils.readFileToByteArray(file);

            try {
                FileUtils.deleteDirectory(file.getParentFile());
            } catch (Exception e) {
                System.out.println("failed to delete file " + file.getAbsolutePath());
            }

            return Response
                    .ok(bytes, "application/zip")
                    .header("Content-Disposition",
                            "attachment; filename=\"" + g.getFriendlyName() + "-generated.zip\"")
                    .header("Accept-Range", "bytes").header("Content-Length", bytes.length).build();
        } else {
            return Response.status(404).build();
        }
    }

    @POST
    @Path("/clients/{language}")
    @ApiOperation(
            value = "Generates a client library",
            notes = "Accepts a `GeneratorInput` options map for spec location and generation options",
            response = ResponseCode.class, tags = "clients")
    public Response generateClient(
            @Context HttpServletRequest request,
            @ApiParam(value = "The target language for the client library", required = true) @PathParam("language") String language,
            @ApiParam(value = "Configuration for building the client library", required = true) GeneratorInput opts)
            throws Exception {

        String filename = Generator.generateClient(language, opts);
        String host = System.getenv("GENERATOR_HOST");

        if (StringUtils.isBlank(host)) {
            String scheme = request.getHeader("X-SSL");
            String port = "";
            if ("1".equals(scheme)) {
                scheme = "https";
            } else {
                scheme = request.getScheme();
                port = ":" + request.getServerPort();
            }
            host = scheme + "://" + request.getServerName() + port;
        }

        if (filename != null) {
            String code = String.valueOf(UUID.randomUUID().toString());
            Generated g = new Generated();
            g.setFilename(filename);
            g.setFriendlyName(language + "-client");
            fileMap.put(code, g);
            System.out.println(code + ", " + filename);
            String link = host + "/api/gen/download/" + code;
            return Response.ok().entity(new ResponseCode(code, link)).build();
        } else {
            return Response.status(500).build();
        }
    }

    @GET
    @Path("/clients/{language}")
    @Produces({MediaType.APPLICATION_JSON})
    @ApiOperation(value = "Returns options for a client library", response = CliOption.class,
            responseContainer = "map", tags = "clients")
    public Response getClientOptions(
            @SuppressWarnings("unused") @Context HttpServletRequest request,
            @ApiParam(value = "The target language for the client library", required = true) @PathParam("language") String language)
            throws Exception {

        Map<String, CliOption> opts = Generator.getOptions(language);

        if (opts != null) {
            return Response.ok().entity(opts).build();
        } else {
            return Response.status(404).build();
        }
    }

    @GET
    @Path("/servers/{framework}")
    @Produces({MediaType.APPLICATION_JSON})
    @ApiOperation(value = "Returns options for a server framework", response = CliOption.class,
            responseContainer = "map", tags = "servers")
    public Response getServerOptions(
            @SuppressWarnings("unused") @Context HttpServletRequest request,
            @ApiParam(value = "The target language for the server framework", required = true) @PathParam("framework") String framework)
            throws Exception {

        Map<String, CliOption> opts = Generator.getOptions(framework);

        if (opts != null) {
            return Response.ok().entity(opts).build();
        } else {
            return Response.status(404).build();
        }
    }

    @GET
    @Path("/clients")
    @ApiOperation(value = "Gets languages supported by the client generator",
            response = String.class, responseContainer = "List", tags = "clients")
    public Response clientOptions() {
        String[] languages = new String[clients.size()];
        languages = clients.toArray(languages);
        return Response.ok().entity(languages).build();
    }

    @GET
    @Path("/servers")
    @ApiOperation(value = "Gets languages supported by the server generator",
            response = String.class, responseContainer = "List", tags = "servers")
    public Response serverOptions() {
        String[] languages = new String[servers.size()];
        languages = servers.toArray(languages);
        return Response.ok().entity(languages).build();
    }

    @POST
    @Path("/servers/{framework}")
    @ApiOperation(
            value = "Generates a server library",
            notes = "Accepts a `GeneratorInput` options map for spec location and generation options.",
            response = ResponseCode.class, tags = "servers")
    public Response generateServerForLanguage(@Context HttpServletRequest request, @ApiParam(
            value = "framework", required = true) @PathParam("framework") String framework,
            @ApiParam(value = "parameters", required = true) GeneratorInput opts) throws Exception {
        if (framework == null) {
            throw new BadRequestException("Framework is required");
        }
        String filename = Generator.generateServer(framework, opts);
        System.out.println("generated name: " + filename);

        String host = System.getenv("GENERATOR_HOST");

        if (StringUtils.isBlank(host)) {
            String scheme = request.getHeader("X-SSL");
            String port = "";
            if ("1".equals(scheme)) {
                scheme = "https";
            }
            else {
                scheme = request.getScheme();
                port = ":" + request.getServerPort();
            }
            host = scheme + "://" + request.getServerName() + port;
        }

        if (filename != null) {
            String code = String.valueOf(UUID.randomUUID().toString());
            Generated g = new Generated();
            g.setFilename(filename);
            g.setFriendlyName(framework + "-server");
            fileMap.put(code, g);
            System.out.println(code + ", " + filename);
            String link = host + "/api/gen/download/" + code;
            return Response.ok().entity(new ResponseCode(code, link)).build();
        } else {
            return Response.status(500).build();
        }
    }
}
