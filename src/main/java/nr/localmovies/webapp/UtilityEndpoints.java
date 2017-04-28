package nr.localmovies.webapp;

import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

@Path("/")
public class UtilityEndpoints {

    @POST
    @Path("/logout")
    public void logout(@Context HttpServletRequest request, @Context HttpServletResponse response){
        try {
            request.logout();
        } catch (ServletException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @POST
    @Path("/accessToken")
    public String accessToken(@Context HttpServletRequest request){
        KeycloakSecurityContext securityContext = (RefreshableKeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());
        return securityContext.getIdTokenString();
    }
}
