// src/components/ModelFooter.tsx
import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Model } from "../SchemaVisualizer/SchemaVisualizer.types";

interface ModelFooterProps {
  model: Model;
  onAddAttribute: (modelId: string) => void;
}

export const ModelFooter: React.FC<ModelFooterProps> = ({
  model,
  onAddAttribute,
}) => {
  // 🌟 THÊM THEME COLORS
  const footerBg = useColorModeValue("#4a90e2", "#3d5787");
  const addHoverBg = useColorModeValue("green.500", "green.600");

  const attributeCount = model.attributes?.length;
  const primaryKeys = model.attributes.filter(
    (attr) => attr.isPrimaryKey
  ).length;
  const foreignKeys = model.attributes.filter(
    (attr) => attr.isForeignKey
  ).length;

  return (
    <Box>
      <Flex
        bg={footerBg} // 🌟 THAY ĐỔI
        px={2}
        py={1}
        fontSize="10px"
        color="rgba(255,255,255,0.9)"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="0 0 6px 6px"
        position="relative"
      >
        <Flex alignItems="center" gap={2}>
          <Box>{attributeCount} fields</Box>
          {primaryKeys > 0 && <Box>🔑 {primaryKeys}</Box>}
          {foreignKeys > 0 && <Box>🔗 {foreignKeys}</Box>}
        </Flex>

        <Tooltip label="Add new attribute" fontSize="xs">
          <IconButton
            aria-label="Add attribute"
            icon={<Plus size={12} />}
            size="xs"
            variant="ghost"
            colorScheme="green"
            onClick={() => onAddAttribute(model.id)}
            minWidth="16px"
            height="16px"
            p={0}
            color="rgba(255,255,255,0.7)"
            _hover={{
              bg: addHoverBg, // 🌟 THAY ĐỔI
              color: "white",
            }}
            _active={{
              bg: "green.700",
            }}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
};
