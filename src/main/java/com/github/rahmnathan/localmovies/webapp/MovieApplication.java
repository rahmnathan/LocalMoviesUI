package com.github.rahmnathan.localmovies.webapp;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/open")
public class MovieApplication extends Application {
    private HashSet<Object> singletons = new HashSet<>();

    public MovieApplication(){
        singletons.add(new UtilityEndpoints());
    }

    @Override
    public Set<Class<?>> getClasses(){
        return new HashSet<>();
    }

    @Override
    public Set<Object> getSingletons(){
        return singletons;
    }
}
