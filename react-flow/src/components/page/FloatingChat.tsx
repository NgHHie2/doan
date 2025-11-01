import { Box, Input, Button, useColorModeValue, Flex } from "@chakra-ui/react";
import { FC } from "react";

interface FloatingChatProps {
  isOpen: boolean;
  width?: string;
}

const FloatingChat: FC<FloatingChatProps> = ({ isOpen, width = "360px" }) => {
  const bg = useColorModeValue("white", "#1A202C");

  return (
    <Box
      h="full"
      w={isOpen ? width : 0}
      ml={2}
      bg={bg}
      transform={isOpen ? "translateX(0)" : `translateX(${width})`}
      transition="transform 0.3s ease"
      display="flex"
      flexDirection="column"
      zIndex={10}
    >
      {/* Header */}
      <Box
        p={4}
        fontWeight="bold"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        Chat
      </Box>

      {/* Chat messages */}
      <Box flex="1" p={4} overflowY="auto">
        <Box mb={2}>Hello! How can I help you?</Box>
        <Box mb={2}>You can click the unit button to chat.</Box>
      </Box>

      {/* Input */}
      <Flex p={4} borderTop="1px solid" borderColor="gray.200" gap={2}>
        <Input placeholder="Type a message..." size="sm" flex="1" />
        <Button size="sm" colorScheme="blue">
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default FloatingChat;
