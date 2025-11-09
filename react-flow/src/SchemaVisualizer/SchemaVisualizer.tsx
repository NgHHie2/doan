// src/SchemaVisualizer/SchemaVisualizer.tsx
import React, { useState } from "react";
import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";

import { LoadingScreen } from "../components/LoadingScreen";
import { ControlPanel } from "../components/ControlPanel";
import { ReactFlowCanvas } from "../components/ReactFlowCanvas";
import { AddModelButton } from "../components/AddModelButton";
import { TableListButton } from "../components/TableListButton";
import { TableListDialog } from "../components/TableListDialog";
import { SchemaVisualizerHeader } from "../components/SchemaVisualizerHeader";
import FloatingChat from "../components/page/FloatingChat";

import { useSchemaVisualizer } from "../hooks/useSchemaVisualizer";
import { ExportDiagramButton } from "../components/ExportDiagramButton";
import { CustomControls } from "../components/CustomControls";
import { AutoAlignButton } from "../components/AutoAlignButton";

export const SchemaVisualizer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatWidth = 300;
  const canvasBg = useColorModeValue("#f5f5f5", "#1C1c1c");

  const {
    // Data state
    loading,
    error,
    schemaInfo,
    onlineUsernames,
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

    // Node handlers
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
    <Box height="100vh" width="100vw" bg={canvasBg} position="relative">
      {/* Header với Avatar, Theme Toggle, Chat, History, Add Member */}
      <SchemaVisualizerHeader
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onlineUsernames={onlineUsernames}
      />

      {/* Left side buttons */}
      <Box
        position="absolute"
        bottom="180px"
        left="10px"
        display="flex"
        flexDirection="column"
        gap="6px"
        bg="transparent"
        p="6px"
        zIndex={10}
      >
        <AddModelButton isConnected={isConnected} onAddModel={handleAddModel} />
        <TableListButton onClick={onOpen} />
        <ExportDiagramButton schemaData={schemaInfo} />
        <AutoAlignButton />
      </Box>

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

      {/* Floating Chat Panel - Tái sử dụng từ HomePage */}
      <FloatingChat isOpen={isChatOpen} width={chatWidth} />
    </Box>
  );
};
