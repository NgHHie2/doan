// src/SchemaVisualizer/SchemaVisualizer.tsx
import React from "react";
import { Box, useDisclosure } from "@chakra-ui/react";

import { LoadingScreen } from "../components/LoadingScreen";
import { ControlPanel } from "../components/ControlPanel";
import { ReactFlowCanvas } from "../components/ReactFlowCanvas";
import { AddModelButton } from "../components/AddModelButton";
import { TableListButton } from "../components/TableListButton";
import { TableListDialog } from "../components/TableListDialog";

import { useSchemaVisualizer } from "../hooks/useSchemaVisualizer";
import { ExportDiagramButton } from "../components/ExportDiagramButton";
import { CustomControls } from "../components/CustomControls";
import { AutoAlignButton } from "../components/AutoAlignButton";

export const SchemaVisualizer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    // Data state
    loading,
    error,
    schemaInfo,
    isConnected,

    // ReactFlow state
    reactFlowNodes,
    reactFlowEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,

    // Enhanced drag handlers
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,

    // Action handlers
    handleDeleteModel,
    handleAddModel,
    handleReset,
    handleInitialize,

    // Node handlers (thêm vào đây)
    handleFieldNameUpdate,
    handleFieldTypeUpdate,
    handleToggleKeyType,
    handleAddAttribute,
    handleDeleteAttribute,
    handleModelNameUpdate,
  } = useSchemaVisualizer();

  if (loading) {
    console.log("Rendering loading screen");
    return <LoadingScreen message="Loading schema data..." />;
  }

  return (
    <Box height="100vh" width="100vw" bg="#1C1c1c" position="relative">
      <Box
        position="absolute"
        bottom="180px" // cao hơn Controls mặc định một chút
        left="10px"
        display="flex"
        flexDirection="column"
        gap="6px"
        bg="transparent"
        // border="1px solid #333"
        // boxShadow="0 0 6px rgba(0, 0, 0, 0.3)"
        // borderRadius="8px"
        p="6px"
        zIndex={10}
      >
        <AddModelButton isConnected={isConnected} onAddModel={handleAddModel} />
        <TableListButton onClick={onOpen} />
        <ExportDiagramButton schemaData={schemaInfo} />
        <AutoAlignButton />
      </Box>

      {/* <Controls /> */}
      <CustomControls />

      <ControlPanel
        schemaName={schemaInfo.name}
        isConnected={isConnected}
        loading={loading}
        onReset={handleReset}
      />

      <ReactFlowCanvas
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        schemaInfo={schemaInfo}
      />

      {/* Table List Dialog */}
      <TableListDialog
        isOpen={isOpen}
        onClose={onClose}
        onFieldNameUpdate={handleFieldNameUpdate}
        onFieldTypeUpdate={handleFieldTypeUpdate}
        onToggleKeyType={handleToggleKeyType}
        onDeleteAttribute={handleDeleteAttribute}
        onAddAttribute={handleAddAttribute}
        onDeleteModel={handleDeleteModel}
        onModelNameUpdate={handleModelNameUpdate}
      />
    </Box>
  );
};
