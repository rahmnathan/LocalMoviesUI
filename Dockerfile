FROM openjdk:10

MAINTAINER nathan

RUN mkdir /opt/localmovies

COPY src/main/resources/ssl-gen.sh /opt/localmovies/ssl-gen.sh
RUN /opt/localmovies/ssl-gen.sh

ARG JAR_FILE
COPY target/$JAR_FILE /opt/localmovies/localmovies-webapp.jar

ENTRYPOINT java -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses=true -jar /opt/localmovies/localmovies-webapp.jar
