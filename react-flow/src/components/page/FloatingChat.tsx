import {
  Box,
  Input,
  IconButton,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useState, useRef } from "react";
import { FaArrowUp, FaImage, FaTimes } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";

interface FloatingChatProps {
  isOpen: boolean;
  width?: number;
}

const FloatingChat: FC<FloatingChatProps> = ({ isOpen, width = 300 }) => {
  const bg = useColorModeValue("white", "#161b22");
  const unbg = useColorModeValue("#161b22", "white");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    console.log("Send message or image:", selectedImage);
    setSelectedImage(null); // reset after send
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input file
    }
  };

  return (
    <Box
      position="fixed"
      right={0}
      top="70px"
      bottom={0}
      w={width + "px"}
      bg={bg}
      transform={isOpen ? "translateX(0)" : `translateX(${width}px)`}
      transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      display="flex"
      flexDirection="column"
      zIndex={10}
      borderColor={borderColor}
      borderTopLeftRadius="30px"
      borderTop={"1px solid"}
      borderLeft={"1px solid"}
      borderTopColor={borderColor}
      borderLeftColor={borderColor}
    >
      {/* Header */}
      <Box
        p={4}
        fontWeight="bold"
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        Sherpa
      </Box>

      {/* Chat messages */}
      <Box flex="1" p={4} overflowY="auto">
        <Box mb={2}>Hello! How can I help you?</Box>
        <Box mb={2}>You can click the unit button to chat.</Box>
      </Box>

      {/* Input + Image Preview */}
      <Box p={4} borderTop="1px solid" borderColor={borderColor}>
        {selectedImage && (
          <Box mb={2} position="relative" maxW="100px">
            <Image
              src={selectedImage}
              alt="preview"
              maxH="150px"
              objectFit="cover"
              borderRadius="md"
            />
            <IconButton
              aria-label="Remove image"
              icon={<LiaTimesSolid size={"18px"} />}
              size="xs"
              // colorScheme="blue"
              bg={borderColor}
              position="absolute"
              top={1}
              right={1}
              borderRadius="full"
              onClick={handleRemoveImage}
            />
          </Box>
        )}
        <Flex gap={2} alignItems="center">
          <Input
            placeholder="Type a message..."
            size="sm"
            flex="1"
            borderRadius={"5px"}
            border={"2px"}
            borderColor={borderColor}
          />

          {/* Attach image icon */}
          <IconButton
            aria-label="Attach image"
            icon={<FaImage size={"20px"} />}
            border={"2px"}
            borderColor={borderColor}
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          />
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            display="none"
          />

          {/* Send icon */}
          <IconButton
            aria-label="Send message"
            icon={<FaArrowUp />}
            size="sm"
            colorScheme="blue"
            onClick={handleSend}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default FloatingChat;
