// src/components/SchemaVisualizerHeader.tsx
import React from "react";
import {
  Box,
  HStack,
  Avatar,
  IconButton,
  Tooltip,
  useColorModeValue,
  AvatarBadge,
} from "@chakra-ui/react";
import { History, Users } from "lucide-react";
import { ThemeToggle } from "./page/ThemeToggle";
import { FloatingUnitButton } from "./page/FloatingUnitButton";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { HiOutlineUserAdd } from "react-icons/hi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

interface SchemaVisualizerHeaderProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export const SchemaVisualizerHeader: React.FC<SchemaVisualizerHeaderProps> = ({
  onChatToggle,
  isChatOpen = false,
}) => {
  const borderColor = useColorModeValue("#d0d7de", "#444");
  const bgColor = useColorModeValue("white", "#333");
  const iconColor = useColorModeValue("gray.700", "white");

  const buttonStyle = {
    bg: bgColor,
    color: iconColor,
    border: "1px solid",
    borderColor: borderColor,

    size: "md" as const,
    borderRadius: "50%",
    transition: "all 0.2s ease",
  };

  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      zIndex={1000}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={0}
    >
      <HStack spacing={1.5}>
        {/* Add Member Button */}
        <Tooltip label="Add member" placement="bottom" hasArrow>
          <IconButton
            borderRadius={"50%"}
            aria-label="Add member"
            icon={<AiOutlineUsergroupAdd size={20} />}
            {...buttonStyle}
            onClick={() => console.log("Add member clicked")}
          />
        </Tooltip>

        {/* Activity History Button */}
        <Tooltip label="Activity history" placement="bottom" hasArrow>
          <IconButton
            aria-label="Activity history"
            icon={<MdHistory size={20} />}
            {...buttonStyle}
            onClick={() => console.log("History clicked")}
          />
        </Tooltip>

        {/* Chat Toggle Button - Sử dụng FloatingUnitButton */}
        <FloatingUnitButton onClick={onChatToggle} />

        {/* Theme Toggle - Sử dụng component có sẵn */}
        <ThemeToggle />

        {/* Avatar */}
        <Tooltip label="Profile" placement="bottom" hasArrow>
          <Avatar
            h={"42px"}
            w={"42px"}
            name="Hiep"
            cursor="pointer"
            // border="2px solid"
            // borderColor={borderColor}
            bg="gray.500"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            transition="all 0.2s ease"
          ></Avatar>
        </Tooltip>
      </HStack>
    </Box>
  );
};
