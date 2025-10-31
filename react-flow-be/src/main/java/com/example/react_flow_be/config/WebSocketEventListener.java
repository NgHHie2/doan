package com.example.react_flow_be.config;

import com.example.react_flow_be.config.DiagramSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final DiagramSessionManager sessionManager;
    private final SimpMessagingTemplate messagingTemplate;

    private static final Pattern DIAGRAM_TOPIC_PATTERN = Pattern.compile("/topic/diagram/(\\d+)");

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("WebSocket connected: sessionId={}", sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // User disconnected - remove from all diagrams
        Long diagramId = sessionManager.getDiagramForSession(sessionId);
        if (diagramId != null) {
            sessionManager.leaveDiagram(sessionId);

            // Notify other users in the diagram
            notifyUserCountChange(diagramId);
        }

        log.info("WebSocket disconnected: sessionId={}, was viewing diagram={}",
                sessionId, diagramId);
    }

    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();

        if (destination != null) {
            // Check if subscribing to a diagram topic
            Matcher matcher = DIAGRAM_TOPIC_PATTERN.matcher(destination);
            if (matcher.matches()) {
                Long diagramId = Long.parseLong(matcher.group(1));
                sessionManager.joinDiagram(diagramId, sessionId);

                // Notify all users in diagram about new user
                notifyUserCountChange(diagramId);

                log.info("Session {} subscribed to diagram {}", sessionId, diagramId);
            }
        }
    }

    @EventListener
    public void handleUnsubscribeEvent(SessionUnsubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        Long diagramId = sessionManager.getDiagramForSession(sessionId);
        if (diagramId != null) {
            sessionManager.leaveDiagram(sessionId);
            notifyUserCountChange(diagramId);

            log.info("Session {} unsubscribed from diagram {}", sessionId, diagramId);
        }
    }

    /**
     * Notify all users in a diagram about user count change
     */
    private void notifyUserCountChange(Long diagramId) {
        int userCount = sessionManager.getActiveUserCount(diagramId);

        UserCountMessage message = new UserCountMessage(
                diagramId,
                userCount,
                System.currentTimeMillis());

        messagingTemplate.convertAndSend(
                "/topic/diagram/" + diagramId,
                message);
    }

    // DTO for user count updates
    public record UserCountMessage(Long diagramId, int activeUsers, long timestamp) {
    }
}