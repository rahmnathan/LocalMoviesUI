FROM openjdk:8-jre-slim

MAINTAINER nathan

RUN mkdir /opt/localmovies

ARG JAR_FILE
COPY target/$JAR_FILE /opt/localmovies/localmovies-webapp.jar

COPY src/main/resources/ssl-gen.sh /opt/localmovies/ssl-gen.sh
RUN /opt/localmovies/ssl-gen.sh

ENTRYPOINT java -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses=true -jar /opt/localmovies/localmovies-webapp.jar
