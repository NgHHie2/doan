package com.example.react_flow_be.config;

import com.example.react_flow_be.service.DatabaseDiagramService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * ⭐ SIMPLEST - Broadcast error tới topic thay vì gửi tới user riêng
 */
@Component
@Slf4j
public class DiagramValidationInterceptor implements ChannelInterceptor {

    private final DatabaseDiagramService databaseDiagramService;
    private SimpMessagingTemplate messagingTemplate;

    private static final Pattern DIAGRAM_TOPIC_PATTERN = Pattern.compile("/topic/diagram/(\\d+)");
    private static final Pattern DIAGRAM_DESTINATION_PATTERN = Pattern.compile("/app/diagram/(\\d+)/.*");

    public DiagramValidationInterceptor(DatabaseDiagramService databaseDiagramService) {
        this.databaseDiagramService = databaseDiagramService;
    }

    @Autowired
    @Lazy
    public void setMessagingTemplate(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        StompCommand command = accessor.getCommand();

        if (command == StompCommand.SUBSCRIBE || command == StompCommand.SEND) {
            String destination = accessor.getDestination();

            if (destination != null) {
                Long diagramId = extractDiagramId(destination);

                if (diagramId != null) {
                    if (!validateDiagram(diagramId, accessor)) {
                        log.warn("❌ Rejected connection to diagram: {} from session: {}",
                                diagramId, accessor.getSessionId());

                        // ⭐ Send error BEFORE rejecting
                        sendErrorMessage(diagramId, accessor.getSessionId());

                        return null; // Reject
                    }
                }
            }
        }

        return message;
    }

    private Long extractDiagramId(String destination) {
        Matcher topicMatcher = DIAGRAM_TOPIC_PATTERN.matcher(destination);
        if (topicMatcher.matches()) {
            try {
                return Long.parseLong(topicMatcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }

        Matcher destMatcher = DIAGRAM_DESTINATION_PATTERN.matcher(destination);
        if (destMatcher.matches()) {
            try {
                return Long.parseLong(destMatcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }

    private boolean validateDiagram(Long diagramId, StompHeaderAccessor accessor) {
        try {
            databaseDiagramService.getDatabaseDiagramById(diagramId);
            log.info("✅ Diagram {} validated for session {}", diagramId, accessor.getSessionId());
            return true;
        } catch (Exception e) {
            log.error("❌ Diagram {} does not exist: {}", diagramId, e.getMessage());
            return false;
        }
    }

    /**
     * ⭐ Broadcast error tới /topic/validation-errors
     * Frontend subscribe vào topic này để nhận error
     */
    private void sendErrorMessage(Long diagramId, String sessionId) {
        if (messagingTemplate == null) {
            log.warn("⚠️ MessagingTemplate not available, cannot send error");
            return;
        }

        try {
            ValidationError error = new ValidationError(
                    "DIAGRAM_NOT_FOUND",
                    String.format("Diagram %d does not exist or you don't have access", diagramId),
                    diagramId,
                    sessionId,
                    System.currentTimeMillis());

            // ⭐ Broadcast tới topic (ai subscribe đều nhận được)
            messagingTemplate.convertAndSend("/topic/validation-errors", error);

            log.info("📤 Broadcast validation error for diagram {} to /topic/validation-errors", diagramId);

        } catch (Exception e) {
            log.error("Failed to send validation error: {}", e.getMessage());
        }
    }

    public record ValidationError(
            String errorCode,
            String message,
            Long diagramId,
            String sessionId,
            Long timestamp) {
    }
}