package nr.localmovies.webapp;

import org.keycloak.KeycloakSecurityContext;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/")
public class UtilityEndpoints {

    @GET
    @Path("/accessToken")
    public String accessToken(HttpServletRequest request){
        KeycloakSecurityContext securityContext = (KeycloakSecurityContext) request.getSession().getAttribute(KeycloakSecurityContext.class.getName());
        return securityContext.getToken().toString();
    }
}
