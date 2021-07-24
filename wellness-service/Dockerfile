FROM openjdk:11-jre-slim
WORKDIR /usr/src
ADD ./target/wellness-service-0.0.1-SNAPSHOT.jar /usr/src/wellness-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","wellness-service-0.0.1-SNAPSHOT.jar"]