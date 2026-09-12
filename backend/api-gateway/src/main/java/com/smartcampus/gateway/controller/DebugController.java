package com.smartcampus.gateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class DebugController {

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/debug/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> response = new LinkedHashMap<>();

        // Environment info
        Map<String, String> env = new LinkedHashMap<>();
        env.put("PORT", System.getenv("PORT"));
        env.put("EUREKA_URL", System.getenv("EUREKA_URL"));
        response.put("environment", env);

        // Discovery info
        List<String> services = discoveryClient.getServices();
        response.put("services", services);

        Map<String, Object> serviceDetails = new LinkedHashMap<>();
        for (String svc : services) {
            List<ServiceInstance> instances = discoveryClient.getInstances(svc);
            List<Map<String, Object>> instList = new ArrayList<>();
            for (ServiceInstance inst : instances) {
                Map<String, Object> instMap = new LinkedHashMap<>();
                instMap.put("instanceId", inst.getInstanceId());
                instMap.put("host", inst.getHost());
                instMap.put("port", inst.getPort());
                instMap.put("uri", inst.getUri().toString());
                instMap.put("isSecure", inst.isSecure());
                instMap.put("metadata", inst.getMetadata());
                instList.add(instMap);
            }
            serviceDetails.put(svc, instList);
        }
        response.put("instances", serviceDetails);

        return response;
    }
}
