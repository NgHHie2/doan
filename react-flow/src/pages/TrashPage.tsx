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
import { Trash2 } from "lucide-react";

export function TrashPage() {
  const cardBg = useColorModeValue("white", "#161b22");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");
  const textColor = useColorModeValue("#24292f", "#e6edf3");
  const hoverBg = useColorModeValue("#f6f8fa", "#1c2128");
  const mutedText = useColorModeValue("#57606a", "#8b949e");

  return (
    <>
      <Box mb={8}>
        <Heading size="xl" mb={2} color={textColor} fontWeight="600">
          Trash
        </Heading>
        <Text color={mutedText} fontSize="14px">
          Deleted diagrams are stored here for 30 days
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
              <Icon as={Trash2} boxSize={12} color={mutedText} />
            </Box>
            <Heading size="md" color={textColor} fontWeight="600">
              Trash is empty
            </Heading>
            <Text color={mutedText} fontSize="14px" maxW="400px">
              Deleted diagrams will appear here and can be restored within 30
              days
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </>
  );
}
