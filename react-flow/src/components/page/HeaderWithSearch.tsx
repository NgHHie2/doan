import { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  useColorModeValue,
  InputLeftElement,
  Tooltip,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { TbFilterBolt } from "react-icons/tb";
import { FloatingUnitButton } from "./FloatingUnitButton";

interface HeaderWithSearchProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export function HeaderWithSearch({
  onChatToggle,
  isChatOpen,
}: HeaderWithSearchProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const bgColor = useColorModeValue("#faf9f9ff", "#0d1117");
  const cardBg = useColorModeValue("white", "#161b22");

  return (
    <>
      <Box
        w="full"
        bg={bgColor}
        position="sticky"
        top={0}
        zIndex={5}
        h="60px"
        my={2}
        // pr={{ base: "0px", lg: "10px" }}
        // pl={{ base: "60px", lg: "0px" }}
        display="grid"
        alignItems="center"
      >
        <Flex justify="space-between" align="center" h="full">
          {/* Left: Search */}
          <HStack spacing={2} py={2} flex={1} h="full">
            <InputGroup h="full" maxW="800px">
              <InputLeftElement h="full" pr="2">
                <Tooltip label="Search" hasArrow placement="bottom">
                  <IconButton
                    aria-label="Search"
                    icon={<Search size={"20"} />}
                    variant="ghost"
                    size="md"
                    ml={"12px"}
                    borderRadius="30px"
                    onClick={() => console.log("Search:", searchQuery)}
                  />
                </Tooltip>
              </InputLeftElement>
              <InputRightElement h="full" pl="2">
                <Tooltip label="Advanced filter" hasArrow placement="bottom">
                  <IconButton
                    aria-label="Filter"
                    icon={<TbFilterBolt size="22" />}
                    variant="ghost"
                    size="md"
                    mr={"12px"}
                    borderRadius="full"
                    onClick={onOpen}
                  />
                </Tooltip>
              </InputRightElement>
              <Input
                placeholder="Search diagrams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={cardBg}
                borderRadius="30px"
                h="full"
                fontSize="md"
                pl={"50px"}
              />
            </InputGroup>
          </HStack>

          {/* Right: Header Unit Button + Theme Toggle */}
          <HStack spacing={2} h="full" align="center">
            <FloatingUnitButton onClick={onChatToggle} />
            <ThemeToggle />
          </HStack>
        </Flex>
      </Box>

      {/* Advanced Search Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "90%", sm: "400px", md: "500px", lg: "600px" }}
          borderRadius="lg"
        >
          <ModalHeader>Advanced Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Name */}
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Diagram name" borderRadius="md" />
            </FormControl>

            {/* Owner */}
            <FormControl mb={3}>
              <FormLabel>Owner</FormLabel>
              <Select placeholder="Select owner" borderRadius="md">
                <option>Me</option>
                <option>Team</option>
              </Select>
            </FormControl>

            {/* Date Range */}
            <FormControl mb={3}>
              <FormLabel>Date Range</FormLabel>
              <HStack spacing={3}>
                <Input type="date" placeholder="Start date" borderRadius="md" />
                <Input type="date" placeholder="End date" borderRadius="md" />
              </HStack>
            </FormControl>

            {/* Buttons */}
            <Flex justify="flex-end" pb={2} mt={6} gap={3}>
              <Button
                variant="outline"
                onClick={() => console.log("Reset filters")}
              >
                Reset
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => console.log("Advanced Search")}
              >
                Search
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
