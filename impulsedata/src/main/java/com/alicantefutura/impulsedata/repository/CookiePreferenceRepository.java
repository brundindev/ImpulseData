package com.alicantefutura.impulsedata.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alicantefutura.impulsedata.model.CookiePreference;

@Repository
public interface CookiePreferenceRepository extends JpaRepository<CookiePreference, Long> {
    
    Optional<CookiePreference> findByUserId(String userId);
    
    boolean existsByUserId(String userId);
} 