import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Flex,
  Avatar,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  PenTool,
  Plus,
  FileText,
  LogOut,
  Folder,
  Clock,
  User,
} from "lucide-react";

interface Diagram {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  const headerBg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const handleLogout = async () => {
    try {
      // Gọi API logout trên server
      await fetch("http://localhost:8080/account/logout", {
        method: "POST", // hoặc 'GET' tùy server
        credentials: "include", // gửi cookie với request
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleCreateDiagram = () => {
    // TODO: Create new diagram via API
    const newId = Date.now().toString();
    navigate(`/${newId}`);
  };

  const handleOpenDiagram = (diagramId: string) => {
    navigate(`/${diagramId}`);
  };

  return (
    <Box minH="100vh">
      {/* Header */}
      <Box
        bg={headerBg}
        borderBottom="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                bg="blue.100"
                _dark={{ bg: "blue.900" }}
                p={2}
                borderRadius="full"
              >
                <Icon as={PenTool} boxSize={6} color="blue.500" />
              </Box>
              <Box>
                <Heading size="md">Diagram Builder</Heading>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  Create and manage your diagrams
                </Text>
              </Box>
            </HStack>

            <HStack spacing={2}>
              {user && (
                <HStack
                  spacing={2}
                  px={3}
                  py={1.5}
                  bg="gray.100"
                  _dark={{ bg: "gray.700" }}
                  borderRadius="lg"
                >
                  <Icon as={User} boxSize={4} />
                  <Text fontSize="sm" display={{ base: "none", sm: "block" }}>
                    {user.email}
                  </Text>
                </HStack>
              )}
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                leftIcon={<Icon as={LogOut} boxSize={4} />}
              >
                Logout
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="xl" mb={2}>
              My Diagrams
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Manage and organize your diagram projects
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            size="lg"
            leftIcon={<Icon as={Plus} boxSize={5} />}
            onClick={handleCreateDiagram}
          >
            New Diagram
          </Button>
        </Flex>

        {/* Diagrams Grid */}
        {diagrams.length === 0 ? (
          <Card bg={cardBg} textAlign="center" py={12}>
            <CardBody>
              <VStack spacing={4}>
                <Box
                  bg="gray.100"
                  _dark={{ bg: "gray.700" }}
                  p={6}
                  borderRadius="full"
                >
                  <Icon as={FileText} boxSize={12} color="gray.400" />
                </Box>
                <Heading size="md">No diagrams yet</Heading>
                <Text color="gray.600" _dark={{ color: "gray.400" }}>
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
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {diagrams.map((diagram) => (
              <Card
                key={diagram.id}
                bg={cardBg}
                cursor="pointer"
                onClick={() => handleOpenDiagram(diagram.id)}
                _hover={{
                  bg: hoverBg,
                  transform: "translateY(-4px)",
                  shadow: "lg",
                }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <VStack align="start" spacing={3}>
                    <Box
                      bg="blue.100"
                      _dark={{ bg: "blue.900" }}
                      p={2}
                      borderRadius="lg"
                    >
                      <Icon as={Folder} boxSize={6} color="blue.500" />
                    </Box>
                    <Heading size="md">{diagram.name}</Heading>
                    <HStack
                      spacing={1}
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      <Icon as={Clock} boxSize={3} />
                      <Text>
                        Updated:{" "}
                        {new Date(diagram.updatedAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                  >
                    Created: {new Date(diagram.createdAt).toLocaleDateString()}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={12}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="sm">Recent Activity</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                View your recent diagram edits and changes
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="sm">Templates</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Start with pre-built diagram templates
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="sm">Shared with Me</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Access diagrams shared by team members
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
