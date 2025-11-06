import React, { useRef, useState } from "react";
import {
  Box,
  Icon,
  Text,
  Input,
  HStack,
  useToast,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { Circle, PencilLine } from "lucide-react";
import { DiDatabase } from "react-icons/di";
import { useParams } from "react-router-dom";

interface ControlPanelProps {
  schemaName: string;
  isConnected: boolean;
  loading: boolean;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  schemaName,
  isConnected,
  loading,
  onReset,
}) => {
  const { diagramId } = useParams();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(schemaName);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const editableRef = useRef<HTMLSpanElement>(null);

  const handleStartEditing = () => {
    setEditing(true);

    // Đợi DOM render xong
    setTimeout(() => {
      const el = editableRef.current;
      if (el) {
        el.focus();

        // Đặt con trỏ vào cuối text
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // false = cuối
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }, 0);
  };

  const handleSave = async (newText: string) => {
    if (!newText.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/schema/${diagramId}/new-name`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName: newText }),
        }
      );
      if (!res.ok) throw new Error("Update failed");
    } catch {
      toast({
        title: "Cập nhật thất bại",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      position="absolute"
      left={4}
      top={4}
      zIndex={1000}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
      bg="transparent"
    >
      {/* Icon database */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="#333"
        border="1px solid #444"
        borderRadius="full"
        p={2}
      >
        <Icon as={DiDatabase} boxSize={6} color="#e6edf3" />
      </Box>

      {/* Schema name (editable) */}
      <HStack
        bg={"#333"}
        border={editing ? "1px solid #888" : "1px solid #444"} // 🌟 đậm & sáng hơn khi edit
        borderRadius="xl"
        px={3}
        py={1}
        alignItems="center"
        spacing={1}
        transition="all 0.2s ease"
      >
        <Box
          as="span"
          ref={editableRef}
          contentEditable={editing}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            const newText = e.currentTarget.textContent?.trim() || "";
            if (newText && newText !== name) {
              setName(newText);
              handleSave(newText);
            }
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              setEditing(false);
            }
          }}
          cursor={editing ? "text" : "default"}
          outline="none"
          fontSize="md"
          fontWeight={600}
          color="white"
          whiteSpace="nowrap"
          minW="80px"
          userSelect={"none"}
        >
          {name}
        </Box>

        <IconButton
          aria-label="Edit name"
          icon={saving ? <Spinner size="xs" /> : <PencilLine size={16} />}
          size="xs"
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={handleStartEditing}
        />
      </HStack>

      {/* Connection status */}
      <HStack px={1} py={1} alignItems="center" spacing={2}>
        <Icon
          as={Circle}
          boxSize={2}
          color={isConnected ? "green.400" : "red.400"}
          fill={isConnected ? "green.400" : "red.400"}
        />
        <Text
          display={{ base: "none", md: "block" }}
          fontSize="sm"
          fontWeight={500}
          color="white"
          userSelect="none"
        >
          {isConnected ? "Connected" : "Disconnected"}
        </Text>
      </HStack>
    </Box>
  );
};
