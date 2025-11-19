// src/components/chat/DeleteActionsDisplay.tsx
import {
  Box,
  Text,
  VStack,
  HStack,
  Code,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";

interface DeleteActionsDisplayProps {
  deleteActions: string[];
}

export const DeleteActionsDisplay: FC<DeleteActionsDisplayProps> = ({
  deleteActions,
}) => {
  const deleteBg = useColorModeValue("red.50", "red.900");

  if (deleteActions.length === 0) return null;

  return (
    <Box
      p={2}
      bg={deleteBg}
      borderRadius="md"
      borderLeft="3px solid"
      borderColor="red.500"
    >
      <Text fontSize="xs" fontWeight="bold" color="red.600" mb={1}>
        🗑️ DELETE ({deleteActions.length} items)
      </Text>
      <VStack align="stretch" spacing={1}>
        {deleteActions.map((item, idx) => (
          <HStack
            key={idx}
            fontSize="xs"
            p={1}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="sm"
          >
            <Code fontSize="10px" colorScheme="red">
              {item}
            </Code>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
