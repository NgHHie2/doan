package com.example.react_flow_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.react_flow_be.entity.Diagram;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiagramRepository extends JpaRepository<Diagram, Long>, JpaSpecificationExecutor<Diagram> {
    // List<Diagram> findByType(Diagram.DiagramType type);

    Optional<Diagram> findByName(String name);

    // Tìm diagrams không bị xóa
    List<Diagram> findByIsDeletedFalse();

    // Tìm diagrams đã xóa (trong trash)
    List<Diagram> findByIsDeletedTrue();

    // Count diagrams by deleted status
    @Query("SELECT COUNT(d) FROM Diagram d WHERE d.isDeleted = :isDeleted")
    Long countByIsDeleted(@Param("isDeleted") Boolean isDeleted);
}