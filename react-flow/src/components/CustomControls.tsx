import {
  border,
  Box,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
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
import { useState, useEffect } from "react";
import { usePermission } from "../hooks/usePermission";

export const CustomControls = () => {
  const { zoomIn, zoomOut, fitView, getNodes, setNodes } = useReactFlow();
  const { canEdit } = usePermission(); // ✅ THÊM
  const [isInteractive, setIsInteractive] = useState(canEdit); // ✅ SỬA
  const borderColor = useColorModeValue("#d0d7de", "#444");
  const bgColor = useColorModeValue("white", "#333");
  const iconColor = useColorModeValue("gray.700", "white");
  const hoverBg = useColorModeValue("white", "#1c1c1c");

  // ✅ THÊM: Tự động disable khi VIEW mode
  useEffect(() => {
    if (!canEdit) {
      setIsInteractive(false);
      const updatedNodes = getNodes().map((node) => ({
        ...node,
        draggable: false,
        selectable: false,
        connectable: false,
      }));
      setNodes(updatedNodes);
    }
  }, [canEdit, getNodes, setNodes]);

  const toggleInteractivity = () => {
    if (!canEdit) return; // ✅ THÊM: Không cho toggle nếu VIEW mode

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
    bg: bgColor,
    color: iconColor,
    border: "1px solid",
    borderColor: borderColor,
    _hover: { bg: hoverBg },
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

      {/* ✅ SỬA: Thêm tooltip và disable khi VIEW mode */}
      <Tooltip
        label={
          canEdit ? "Toggle interactivity" : "View-only mode: editing disabled"
        }
        fontSize="sm"
        placement="left"
      >
        <IconButton
          aria-label="Toggle interactivity"
          icon={<MousePointer2 size={16} />}
          onClick={toggleInteractivity}
          {...buttonStyle}
          opacity={isInteractive ? 1 : 0.5}
          isDisabled={!canEdit} // ✅ THÊM: Disable button khi VIEW mode
          cursor={!canEdit ? "not-allowed" : "pointer"} // ✅ THÊM
        />
      </Tooltip>
    </Box>
  );
};
