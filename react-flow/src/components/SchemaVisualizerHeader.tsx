import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MdHistory } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiChevronDown, HiOutlineDotsVertical } from "react-icons/hi";
import { AccountGroup } from "./AccountGroup";
import { FloatingUnitButton } from "./page/FloatingUnitButton";
import { ThemeToggle } from "./page/ThemeToggle";
import { ManageMembersDialog } from "./ManageMembersDialog";

interface SchemaVisualizerHeaderProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export const SchemaVisualizerHeader: React.FC<SchemaVisualizerHeaderProps> = ({
  onChatToggle,
  isChatOpen = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue("#d0d7de", "#444");
  const bgColor = useColorModeValue("white", "#333");
  const iconColor = useColorModeValue("gray.700", "white");

  const tooltipPlacement = useBreakpointValue<
    "top" | "bottom" | "left" | "right"
  >({
    base: "left",
    md: "bottom",
  });

  const [menuOpen, setMenuOpen] = useState(false);

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
    <Box position="absolute" top={4} right={4} zIndex={1000}>
      <Stack
        direction={{ base: "column-reverse", sm: "row" }}
        align="center"
        spacing={2}
      >
        {/* Trên mobile: nút 3 chấm */}
        <Box display={{ base: "block", sm: "none" }}>
          <IconButton
            aria-label="Toggle menu"
            icon={<HiChevronDown />}
            {...buttonStyle}
            onClick={() => setMenuOpen(!menuOpen)}
            sx={{
              transition: "transform 0.2s ease",
              transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", // xoay lên khi mở menu
            }}
          />
        </Box>

        {/* Các nút menu khác */}
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={{ base: 2, sm: 1.5 }}
          display={{
            base: menuOpen ? "flex" : "none", // mobile show khi click
            sm: "flex", // desktop luôn show
          }}
          align="center"
        >
          <AccountGroup />
          <Tooltip label="Add member" placement={tooltipPlacement} hasArrow>
            <IconButton
              borderRadius="50%"
              aria-label="Add member"
              icon={<AiOutlineUsergroupAdd size={20} />}
              {...buttonStyle}
              onClick={onOpen}
            />
          </Tooltip>
          <Tooltip
            label="Activity history"
            placement={tooltipPlacement}
            hasArrow
          >
            <IconButton
              aria-label="Activity history"
              icon={<MdHistory size={20} />}
              {...buttonStyle}
              onClick={() => console.log("History clicked")}
            />
          </Tooltip>
          <FloatingUnitButton onClick={onChatToggle} />
          <ThemeToggle />
        </Stack>
        {/* Avatar luôn trên cùng */}
        <Tooltip label="Profile" placement={tooltipPlacement} hasArrow>
          <Avatar
            h="40px"
            w="40px"
            name="Hiep"
            cursor="pointer"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            transition="all 0.2s ease"
          />
        </Tooltip>
      </Stack>
      <ManageMembersDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
