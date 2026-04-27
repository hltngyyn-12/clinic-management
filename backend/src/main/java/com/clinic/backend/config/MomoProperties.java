package com.clinic.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payment.momo")
@Getter
@Setter
public class MomoProperties {
    private String partnerCode;
    private String accessKey;
    private String secretKey;
    private String createEndpoint;
    private String redirectUrl;
    private String ipnUrl;
    private String frontendResultUrl;
    private String requestType;
    private String lang;
    private String storeName;
    private String storeId;
}
