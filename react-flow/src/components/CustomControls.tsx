import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import {
  Plus,
  Minus,
  Maximize2,
  MousePointer2,
  Maximize,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useReactFlow } from "reactflow";
import { useState } from "react";

export const CustomControls = () => {
  const { zoomIn, zoomOut, fitView, getNodes, setNodes } = useReactFlow();
  const [isInteractive, setIsInteractive] = useState(true);

  const toggleInteractivity = () => {
    const newValue = !isInteractive;
    setIsInteractive(newValue);

    // Disable drag/select/connect on all nodes
    const updatedNodes = getNodes().map((node) => ({
      ...node,
      draggable: newValue,
      selectable: newValue,
      connectable: newValue,
    }));

    setNodes(updatedNodes);
  };

  const buttonStyle = {
    bg: "#333",
    color: "white",
    border: "1px solid #444",
    _hover: { bg: "#1c1c1c" },
    size: "sm" as const,
  };

  return (
    <Box
      position="absolute"
      bottom="10px"
      left="10px"
      display="flex"
      flexDirection="column"
      gap="6px"
      bg="transparent"
      p="6px"
      zIndex={10}
    >
      <Tooltip label="Zoom in" fontSize="sm" placement="left">
        <IconButton
          aria-label="Zoom in"
          icon={<ZoomIn size={16} />}
          onClick={() => zoomIn({ duration: 200 })}
          {...buttonStyle}
        />
      </Tooltip>

      <Tooltip label="Zoom out" fontSize="sm" placement="left">
        <IconButton
          aria-label="Zoom out"
          icon={<ZoomOut size={16} />}
          onClick={() => zoomOut({ duration: 200 })}
          {...buttonStyle}
        />
      </Tooltip>

      <Tooltip label="Fit view" fontSize="sm" placement="left">
        <IconButton
          aria-label="Fit view"
          icon={<Maximize size={16} />}
          onClick={() => fitView({ padding: 0.2, duration: 300 })}
          {...buttonStyle}
        />
      </Tooltip>

      <Tooltip label="Toggle interactivity" fontSize="sm" placement="left">
        <IconButton
          aria-label="Toggle interactivity"
          icon={<MousePointer2 size={16} />}
          onClick={toggleInteractivity}
          {...buttonStyle}
          opacity={isInteractive ? 1 : 0.5}
        />
      </Tooltip>
    </Box>
  );
};
