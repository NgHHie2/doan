import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { Share2 } from "lucide-react";

export function SharedDiagramsPage() {
  const cardBg = useColorModeValue("white", "#161b22");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");
  const textColor = useColorModeValue("#24292f", "#e6edf3");
  const hoverBg = useColorModeValue("#f6f8fa", "#1c2128");
  const mutedText = useColorModeValue("#57606a", "#8b949e");

  return (
    <>
      <Box mb={8}>
        <Heading size="xl" mb={2} color={textColor} fontWeight="600">
          Shared with Me
        </Heading>
        <Text color={mutedText} fontSize="14px">
          Diagrams that others have shared with you
        </Text>
      </Box>

      <Card
        bg={cardBg}
        borderColor={borderColor}
        border="1px"
        textAlign="center"
        py={12}
      >
        <CardBody>
          <VStack spacing={4}>
            <Box bg={hoverBg} p={6} borderRadius="full">
              <Icon as={Share2} boxSize={12} color={mutedText} />
            </Box>
            <Heading size="md" color={textColor} fontWeight="600">
              No shared diagrams
            </Heading>
            <Text color={mutedText} fontSize="14px" maxW="400px">
              When team members share diagrams with you, they will appear here
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </>
  );
}
