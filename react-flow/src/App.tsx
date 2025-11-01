// src/App.tsx
import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { SchemaVisualizer } from "./SchemaVisualizer/SchemaVisualizer";
import { ReactFlowProvider } from "reactflow";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { MyDiagramsPage } from "./pages/MyDiagramsPage";
import { SharedDiagramsPage } from "./pages/SharedDiagramsPage";
import { TrashPage } from "./pages/TrashPage";
import { ProfilePage } from "./pages/ProfilePage";
import theme from "./theme";

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <WebSocketProvider>
          <ReactFlowProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />}>
                  <Route index element={<MyDiagramsPage />} />
                  <Route path="shared" element={<SharedDiagramsPage />} />
                  <Route path="trash" element={<TrashPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                <Route path="/:diagramId" element={<SchemaVisualizer />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
              </Routes>
            </BrowserRouter>
          </ReactFlowProvider>
        </WebSocketProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
