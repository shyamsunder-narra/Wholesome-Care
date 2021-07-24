package com.stackroute.apigateway.Config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.ServerCodecConfigurer;

@Configuration
public class SpringCloudConfig {
    @Bean
    public ServerCodecConfigurer serverCodecConfigurer() {
        return ServerCodecConfigurer.create();
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("graph-command-service",r -> r.path("/api/v1/command/**")
                        .uri("http://localhost:9092/")
                )
                .route("graph-query-service",r -> r.path("/api/v1/graph-query/**")
                                .uri("http://localhost:8097/")
//                        .id("graph-query-service")
                )
                .route("nlp-service",r -> r.path("/api/v1/nlp/**")
                                .uri("http://localhost:8098/")
//                        .id("nlp-service")
                )
                .route("plan-payment-service",r -> r.path("/api/v1/payment/**")
                                .uri("http://localhost:8096/")
//                        .id("plan-payment-service")
                )
                .route("questionnaire-service",r -> r.path("/api/v1/questionnaire/**")
                                .uri("http://localhost:9091/")
//                        .id("questionnaire-service")
                )
                .route("socket-notification-service",r -> r.path("/api/v1/socket/**")
                                .uri("http://localhost:8099/")
//                        .id("socket-notification-service")
                )
                .route("user-auth-service",r -> r.path("/api/v1/user-auth/**")
                                .uri("http://localhost:8080/")
//                        .id("user-auth-service")
                )
                .route("user-service",r -> r.path("/api/v1/user/**")
                                .uri("http://localhost:8082/")
//                        .id("user-service")
                )
                .route("wellness-mentor-service",r -> r.path("/api/v1/wellness-mentor/**")
                                .uri("http://localhost:8085/")
//                        .id("wellness-mentor-service")
                )
                .route("wellness-service",r -> r.path("/api/v1/wellness/**")
                                .uri("http://localhost:8070/")
//                        .id("wellness-service")
                )
                .route("wellness-tracker-service",r -> r.path("/api/v1/wellness-tracker/**")
                                .uri("http://localhost:8083/")
//                        .id("wellness-tracker-service")
                )
                .build();
    }


}