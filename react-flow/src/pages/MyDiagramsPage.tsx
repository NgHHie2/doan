import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Flex,
  useColorModeValue,
  SimpleGrid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { CiGrid41 } from "react-icons/ci";
import { IoIosList } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import { BsDiagram3 } from "react-icons/bs";
import { DiagramList, Diagram } from "../components/page/DiagramList";

export function MyDiagramsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterName, setFilterName] = useState<string>("All Names");
  const [filterOwner, setFilterOwner] = useState<string>("All Owners");
  const [filterLatest, setFilterLatest] = useState<string>("All Time");

  // Sample data - replace with your API data
  const [diagrams, setDiagrams] = useState<Diagram[]>([
    {
      id: "1",
      name: "E-Commerce Database Schema",
      owner: {
        name: "John Doe",
        avatar: undefined,
      },
      updatedAt: "2025-11-01T10:30:00Z",
      updatedBy: {
        name: "Jane Smith",
        avatar: undefined,
      },
      createdAt: "2025-10-15T08:00:00Z",
      isStarred: true,
      image: "./luocdocsdl.png",
    },
    {
      id: "2",
      name: "User Authentication System",
      owner: {
        name: "Alice Johnson",
        avatar: undefined,
      },
      updatedAt: "2025-11-02T14:20:00Z",
      updatedBy: {
        name: "Bob Wilson",
        avatar: undefined,
      },
      createdAt: "2025-10-20T09:15:00Z",
      isStarred: false,
      image: "./Hinh1-7.png",
    },
    {
      id: "3",
      name: "Inventory Management Database",
      owner: {
        name: "John Doe",
        avatar: undefined,
      },
      updatedAt: "2025-10-28T16:45:00Z",
      updatedBy: {
        name: "John Doe",
        avatar: undefined,
      },
      createdAt: "2025-10-10T11:30:00Z",
      isStarred: false,
      image: "./Hinh1-19.png",
    },
  ]);

  const bgColor = useColorModeValue("#faf9f9ff", "#0d1117");
  const cardBg = useColorModeValue("white", "#161b22");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");
  const textColor = useColorModeValue("#24292f", "#e6edf3");
  const hoverBg = useColorModeValue("#f6f8fa", "#323b47ff");
  const mutedText = useColorModeValue("#57606a", "#8b949e");

  const handleCreateDiagram = () => {
    const newId = Date.now().toString();
    navigate(`/${newId}`);
  };

  const handleOpenDiagram = (diagramId: string) => {
    navigate(`/${diagramId}`);
  };

  const handleShare = (diagramId: string) => {
    toast({
      title: "Share dialog",
      description: `Sharing diagram ${diagramId}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    // Implement share logic
  };

  const handleRename = (diagramId: string) => {
    toast({
      title: "Rename dialog",
      description: `Renaming diagram ${diagramId}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    // Implement rename logic
  };

  const handleToggleStar = (diagramId: string) => {
    setDiagrams((prev) =>
      prev.map((d) =>
        d.id === diagramId ? { ...d, isStarred: !d.isStarred } : d
      )
    );
    const diagram = diagrams.find((d) => d.id === diagramId);
    toast({
      title: diagram?.isStarred ? "Removed from starred" : "Added to starred",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDuplicate = (diagramId: string) => {
    toast({
      title: "Duplicating diagram",
      description: `Creating a copy of diagram ${diagramId}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    // Implement duplicate logic
  };

  const handleDownload = (diagramId: string) => {
    toast({
      title: "Downloading diagram",
      description: `Downloading diagram ${diagramId}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    // Implement download logic
  };

  const handleHistory = (diagramId: string) => {
    toast({
      title: "Activity history",
      description: `Viewing history for diagram ${diagramId}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    // Implement history view logic
  };

  const handleDelete = (diagramId: string) => {
    toast({
      title: "Moved to trash",
      description: `Diagram ${diagramId} moved to trash`,
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
    // Implement delete logic
  };

  return (
    <Box w="full" maxW="100%" overflowX="hidden">
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading size="lg" color={textColor} fontWeight="400">
            My Diagrams
          </Heading>
        </Box>
        <HStack spacing={0} borderRadius="md" overflow="hidden" boxShadow="md">
          <IconButton
            aria-label="Grid view"
            icon={<CiGrid41 size={"22px"} />}
            colorScheme={view === "grid" ? "blue" : "gray"}
            onClick={() => setView("grid")}
            roundedRight={0}
            size="sm"
          />
          <IconButton
            aria-label="List view"
            icon={<IoIosList size={"25px"} />}
            colorScheme={view === "list" ? "blue" : "gray"}
            onClick={() => setView("list")}
            roundedLeft={0}
            size="sm"
          />
        </HStack>
      </Flex>

      <Flex mb={4}>
        {/* Filters */}
        <HStack spacing={2}>
          {/* Name Filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<FaCaretDown />} size="sm">
              {filterName}
            </MenuButton>
            <MenuList bg={cardBg}>
              {["All Names", "Diagram A", "Diagram B"].map((name) => (
                <MenuItem
                  bg={cardBg}
                  _hover={{ bg: hoverBg }}
                  key={name}
                  onClick={() => setFilterName(name)}
                >
                  {name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Owner Filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<FaCaretDown />} size="sm">
              {filterOwner}
            </MenuButton>
            <MenuList bg={cardBg}>
              {["All Owners", "Me", "Team"].map((owner) => (
                <MenuItem
                  bg={cardBg}
                  _hover={{ bg: hoverBg }}
                  key={owner}
                  onClick={() => setFilterOwner(owner)}
                >
                  {owner}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Latest Filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<FaCaretDown />} size="sm">
              {filterLatest}
            </MenuButton>
            <MenuList bg={cardBg}>
              {["All Time", "Today", "Last 7 Days", "Last 30 Days"].map(
                (time) => (
                  <MenuItem
                    bg={cardBg}
                    _hover={{ bg: hoverBg }}
                    key={time}
                    onClick={() => setFilterLatest(time)}
                  >
                    {time}
                  </MenuItem>
                )
              )}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Diagrams Grid or List */}
      {diagrams.length === 0 ? (
        <Card bg={"transparent"} textAlign="center" py={12} shadow={"none"}>
          <CardBody>
            <VStack spacing={4}>
              <Box bg={hoverBg} p={6} borderRadius="full">
                <Icon as={BsDiagram3} boxSize={12} color={mutedText} />
              </Box>
              <Heading size="md" color={textColor} fontWeight="600">
                No diagrams yet
              </Heading>
              <Text color={mutedText} fontSize="14px">
                Get started by creating your first diagram
              </Text>
              <Button
                colorScheme="blue"
                leftIcon={<Icon as={Plus} boxSize={4} />}
                onClick={handleCreateDiagram}
                mt={4}
              >
                Create Your First Diagram
              </Button>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <DiagramList
          diagrams={diagrams}
          view={view}
          onOpen={handleOpenDiagram}
          onShare={handleShare}
          onRename={handleRename}
          onToggleStar={handleToggleStar}
          onDuplicate={handleDuplicate}
          onDownload={handleDownload}
          onHistory={handleHistory}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}
