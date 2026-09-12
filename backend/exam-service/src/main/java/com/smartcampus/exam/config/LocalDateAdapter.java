package com.smartcampus.exam.config;

import jakarta.xml.bind.annotation.adapters.XmlAdapter;
import java.time.LocalDate;

public class LocalDateAdapter extends XmlAdapter<String, LocalDate> {

    @Override
    public LocalDate unmarshal(String v) throws Exception {
        return (v != null && !v.trim().isEmpty()) ? LocalDate.parse(v.trim()) : null;
    }

    @Override
    public String marshal(LocalDate v) throws Exception {
        return (v != null) ? v.toString() : null;
    }
}
