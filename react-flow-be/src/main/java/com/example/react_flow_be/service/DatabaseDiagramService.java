package com.example.react_flow_be.service;

import com.example.react_flow_be.entity.*;
import com.example.react_flow_be.repository.*;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DatabaseDiagramService {

    private final DatabaseDiagramRepository databaseDiagramRepository;

    @Transactional(readOnly = true)
    public List<DatabaseDiagram> getAllDatabaseDiagrams() {
        return databaseDiagramRepository.findAll();
    }

    public DatabaseDiagram getDatabaseDiagramById(Long id) {
        return databaseDiagramRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy diagram"));
    }

    @Transactional
    public Boolean updateDiagramName(Long id, String newName) {
        if (databaseDiagramRepository.updateNameById(id, newName) != 0)
            return true;
        return false;
    }

    @Transactional
    public DatabaseDiagram createSampleDatabaseDiagram() {
        DatabaseDiagram databaseDiagram = new DatabaseDiagram();
        databaseDiagram.setName("Blog System");
        databaseDiagram.setDescription("Sample blog system database schema");
        databaseDiagram.setType(Diagram.DiagramType.ER_DIAGRAM);
        databaseDiagram.setDatabaseType(DatabaseDiagram.DatabaseType.MYSQL);
        databaseDiagram.setVersion("8.0");
        databaseDiagram.setCharset("utf8mb4");
        databaseDiagram.setCollation("utf8mb4_unicode_ci");
        databaseDiagram.setIsPublic(false);
        databaseDiagram.setIsTemplate(true);
        databaseDiagram.setZoomLevel(1.0);
        databaseDiagram.setPanX(0.0);
        databaseDiagram.setPanY(0.0);
        return databaseDiagramRepository.save(databaseDiagram);
    }

}
