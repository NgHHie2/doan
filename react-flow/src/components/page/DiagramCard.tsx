import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useColorModeValue,
  Tooltip,
  Image,
  Portal,
} from "@chakra-ui/react";
import {
  Share2,
  Edit2,
  Star,
  Copy,
  Download,
  History,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { BsDiagram3 } from "react-icons/bs";
import { PiStar, PiStarFill } from "react-icons/pi";

interface DiagramCardProps {
  id: string;
  name: string;
  owner: {
    name: string;
    avatar?: string;
  };
  updatedAt: string;
  updatedBy: {
    name: string;
    avatar?: string;
  };
  image: string;
  createdAt: string;
  isStarred?: boolean;
  onOpen: (id: string) => void;
  onShare: (id: string) => void;
  onRename: (id: string) => void;
  onToggleStar: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDownload: (id: string) => void;
  onHistory: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DiagramCard({
  id,
  name,
  owner,
  updatedAt,
  updatedBy,
  createdAt,
  isStarred = false,
  image,
  onOpen,
  onShare,
  onRename,
  onToggleStar,
  onDuplicate,
  onDownload,
  onHistory,
  onDelete,
}: DiagramCardProps) {
  const cardBg = useColorModeValue("white", "#161b22");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");
  const textColor = useColorModeValue("#24292f", "#e6edf3");
  const mutedText = useColorModeValue("#57606a", "#8b949e");
  const hoverBg = useColorModeValue("#f6f8fa", "#323b47ff");
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const bgColor = useColorModeValue("#faf9f9ff", "#2b3039ff");

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening when clicking on menu or action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onOpen(id);
  };

  return (
    <Card
      bg={bgColor}
      border={"1px"}
      borderColor={borderColor}
      cursor="pointer"
      onClick={handleCardClick}
      _hover={{
        bg: bgColor,
        transform: "translateY(-2px)",
        shadow: "md",
      }}
      transition="all 0.2s"
      position="relative"
      p={0}
      borderRadius={"10px"}
    >
      <CardBody p={3}>
        <VStack align="stretch" spacing={1}>
          {/* Icon and Menu */}

          <Image
            src={image} // link ảnh hoặc biến
            alt={name}
            w={"full"}
            h={"200px"}
            objectFit="cover" // vừa khung, cắt phần thừa
            borderRadius="md" // bo góc nếu muốn
          />
          <Box
            display={"flex"}
            flexFlow={"row"}
            alignItems="center"
            justifyContent="space-between"
            pt={2}
            pb={1}
          >
            {/* Name */}
            <Heading
              size="xs"
              color={textColor}
              fontWeight="600"
              noOfLines={1}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {name}
            </Heading>
            <HStack justify="space-between" zIndex={100}>
              <Menu placement="top-start">
                <Tooltip label="More actions" placement="top">
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<MoreVertical size={18} />}
                    variant="ghost"
                    size="xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
                <Portal>
                  <MenuList bg={cardBg} borderColor={borderColor} zIndex={999}>
                    <MenuItem
                      icon={<Share2 size={15} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      Share
                    </MenuItem>
                    <MenuItem
                      icon={<Edit2 size={15} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRename(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      Rename
                    </MenuItem>
                    <MenuItem
                      icon={
                        isStarred ? (
                          <PiStarFill size={15} />
                        ) : (
                          <PiStar size={15} />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      {isStarred ? "Remove star" : "Add star"}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      icon={<Copy size={15} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      Make a copy
                    </MenuItem>
                    <MenuItem
                      icon={<Download size={15} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      Download
                    </MenuItem>
                    <MenuItem
                      icon={<History size={15} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onHistory(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      Activity history
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      icon={<Trash2 size={15} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                      }}
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      fontSize={"sm"}
                      py={1}
                    >
                      Move to trash
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </HStack>
          </Box>

          {/* Owner */}
          {/* <HStack spacing={2}>
            <Avatar size="xs" name={owner.name} src={owner.avatar} />
            <Text fontSize="xs" color={mutedText} noOfLines={1}>
              {owner.name}
            </Text>
          </HStack> */}

          {/* Updated info */}
          <HStack spacing={2} fontSize="xs" color={mutedText}>
            <Avatar size="2xs" name={updatedBy.name} src={updatedBy.avatar} />
            <Text noOfLines={1}>
              Updated {new Date(updatedAt).toLocaleDateString()} by{" "}
              {updatedBy.name}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
