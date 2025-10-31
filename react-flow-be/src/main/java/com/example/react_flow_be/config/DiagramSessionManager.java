package com.example.react_flow_be.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class DiagramSessionManager {

    // Map: diagramId -> Set of sessionIds
    private final Map<Long, Set<String>> diagramSessions = new ConcurrentHashMap<>();

    // Map: sessionId -> diagramId
    private final Map<String, Long> sessionToDiagram = new ConcurrentHashMap<>();

    /**
     * User joins a diagram
     */
    public void joinDiagram(Long diagramId, String sessionId) {
        // Remove from old diagram if exists
        leaveDiagram(sessionId);

        // Add to new diagram
        diagramSessions.computeIfAbsent(diagramId, k -> ConcurrentHashMap.newKeySet())
                .add(sessionId);
        sessionToDiagram.put(sessionId, diagramId);

        log.info("Session {} joined diagram {}. Total users: {}",
                sessionId, diagramId, diagramSessions.get(diagramId).size());
    }

    /**
     * User leaves current diagram
     */
    public void leaveDiagram(String sessionId) {
        Long diagramId = sessionToDiagram.remove(sessionId);
        if (diagramId != null) {
            Set<String> sessions = diagramSessions.get(diagramId);
            if (sessions != null) {
                sessions.remove(sessionId);
                if (sessions.isEmpty()) {
                    diagramSessions.remove(diagramId);
                }
                log.info("Session {} left diagram {}. Remaining users: {}",
                        sessionId, diagramId, sessions.size());
            }
        }
    }

    /**
     * Get all active sessions for a diagram
     */
    public Set<String> getActiveSessions(Long diagramId) {
        return new HashSet<>(diagramSessions.getOrDefault(diagramId, Collections.emptySet()));
    }

    /**
     * Get diagram ID for a session
     */
    public Long getDiagramForSession(String sessionId) {
        return sessionToDiagram.get(sessionId);
    }

    /**
     * Get number of active users on a diagram
     */
    public int getActiveUserCount(Long diagramId) {
        Set<String> sessions = diagramSessions.get(diagramId);
        return sessions != null ? sessions.size() : 0;
    }

    /**
     * Get all active diagrams
     */
    public Set<Long> getActiveDiagrams() {
        return new HashSet<>(diagramSessions.keySet());
    }
}