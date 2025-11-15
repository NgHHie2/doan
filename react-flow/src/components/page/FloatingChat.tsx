import {
  Box,
  Input,
  IconButton,
  Flex,
  Image,
  Text,
  VStack,
  Badge,
  Spinner,
  Collapse,
  Code,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useState, useRef } from "react";
import { FaArrowUp, FaImage, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { useStore } from "reactflow";
import type { ReactFlowState } from "reactflow";
import { chatbotService, ChatbotResponse } from "../../services/chatbotService";

interface FloatingChatProps {
  isOpen: boolean;
  width?: number;
}

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  response?: ChatbotResponse;
}

const FloatingChat: FC<FloatingChatProps> = ({ isOpen, width = 400 }) => {
  const bg = useColorModeValue("white", "#161b22");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");
  const userMsgBg = useColorModeValue("blue.50", "blue.900");
  const botMsgBg = useColorModeValue("gray.50", "gray.800");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách nodes từ ReactFlow store
  const allNodes = useStore((state: ReactFlowState) => state.nodeInternals);

  // Convert nodes to models format for API
  const getModelsFromNodes = () => {
    const models: any[] = [];
    console.log("chat: ", allNodes.values());
    allNodes.forEach((node, key) => {
      console.log("key:", key, "node:", node);
    });

    allNodes.forEach((node) => {
      if (node.type === "model") {
        const model = {
          name: node.data?.name || node.id,
          attributes: [] as any[],
          fks: [] as any[],
        };

        (node.data?.attributes || []).forEach((attr: any) => {
          // 🎯 Tạo attribute (bao gồm cả FK)
          const cleanAttr: any = {
            name: attr.name,
            type: attr.dataType,
          };

          if (attr.isPrimaryKey) {
            cleanAttr.pk = true;
          }

          model.attributes.push(cleanAttr);

          // 🎯 Nếu là foreign key → thêm vào mảng fks
          if (attr.isForeignKey && attr.connection) {
            // Tìm target model và attribute name
            let targetModelName = "";
            let targetAttrName = "";

            // Tìm target model
            // console.log(attr.name);
            // console.log("targetId: ", attr.connection.targetModelId);
            const targetModel = Array.from(allNodes.values()).find(
              (n) => n.id === attr.connection.targetModelId
            );

            console.log("target: ", targetModel);
            if (targetModel) {
              targetModelName = targetModel.data?.name || targetModel.id;

              // Tìm target attribute
              const targetAttr = (targetModel.data?.attributes || []).find(
                (a: any) => a.id === attr.connection.targetAttributeId
              );
              if (targetAttr) {
                targetAttrName = targetAttr.name;
              }
            }

            // Chỉ thêm FK nếu tìm được đầy đủ thông tin
            if (targetModelName && targetAttrName) {
              model.fks.push({
                column: attr.name,
                references: `${targetModelName}.${targetAttrName}`,
              });
            }
          }
        });

        models.push(model);
      }
    });

    return models;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const models = getModelsFromNodes();

      const response = await chatbotService.sendMessage({
        diagram: { models },
        question: inputValue,
        history: "None",
        max_new_tokens: 2056,
        do_sample: false,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response.tomtat || response.message,
        response: response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentModels = getModelsFromNodes();

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
        <Flex justify="space-between" align="center">
          <Text>Sherpa AI</Text>
          <Badge colorScheme="green" fontSize="0.7em">
            {currentModels.length} models
          </Badge>
        </Flex>
      </Box>

      {/* Models Debug Panel */}
      <Box borderBottom="1px solid" borderColor={borderColor}>
        <Flex
          p={2}
          align="center"
          justify="space-between"
          cursor="pointer"
          onClick={() => setShowModels(!showModels)}
          fontSize="sm"
          bg={useColorModeValue("gray.50", "gray.900")}
          _hover={{ bg: useColorModeValue("gray.100", "gray.800") }}
        >
          <Text fontWeight="medium">📊 Current Models (Debug)</Text>
          <IconButton
            aria-label="Toggle models"
            icon={showModels ? <FaChevronUp /> : <FaChevronDown />}
            size="xs"
            variant="ghost"
          />
        </Flex>
        <Collapse in={showModels}>
          <Box p={2} maxH="150px" overflowY="auto" fontSize="xs">
            <Code p={2} borderRadius="md" display="block" whiteSpace="pre">
              {JSON.stringify(currentModels, null, 2)}
            </Code>
          </Box>
        </Collapse>
      </Box>

      {/* Chat messages */}
      <VStack flex="1" p={4} spacing={3} overflowY="auto" align="stretch">
        {messages.length === 0 && (
          <Box textAlign="center" color="gray.500" mt={8}>
            <Text fontSize="sm">👋 Xin chào!</Text>
            <Text fontSize="xs" mt={2}>
              Hãy hỏi tôi về thiết kế database
            </Text>
          </Box>
        )}

        {messages.map((msg) => (
          <Box
            key={msg.id}
            alignSelf={msg.type === "user" ? "flex-end" : "flex-start"}
            maxW="85%"
          >
            <Box
              bg={msg.type === "user" ? userMsgBg : botMsgBg}
              p={3}
              borderRadius="lg"
              fontSize="sm"
            >
              <Text>{msg.text}</Text>

              {msg.response && (
                <VStack mt={3} spacing={2} align="stretch">
                  {/* Action Badge */}
                  <Badge
                    colorScheme={
                      msg.response.action === "REFRESH" ? "green" : "blue"
                    }
                    alignSelf="flex-start"
                  >
                    {msg.response.action}
                  </Badge>

                  {/* CREATE Section */}
                  {msg.response.create.length > 0 && (
                    <Box
                      p={2}
                      bg={useColorModeValue("green.50", "green.900")}
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderColor="green.500"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="green.600"
                        mb={1}
                      >
                        ✨ CREATE ({msg.response.create.length} tables)
                      </Text>
                      <Code
                        fontSize="10px"
                        p={2}
                        borderRadius="sm"
                        display="block"
                        whiteSpace="pre-wrap"
                        maxH="120px"
                        overflowY="auto"
                      >
                        {JSON.stringify(msg.response.create, null, 2)}
                      </Code>
                    </Box>
                  )}

                  {/* DELETE Section */}
                  {msg.response.delete.length > 0 && (
                    <Box
                      p={2}
                      bg={useColorModeValue("red.50", "red.900")}
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderColor="red.500"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="red.600"
                        mb={1}
                      >
                        🗑️ DELETE ({msg.response.delete.length} items)
                      </Text>
                      <Code
                        fontSize="10px"
                        p={2}
                        borderRadius="sm"
                        display="block"
                      >
                        {JSON.stringify(msg.response.delete, null, 2)}
                      </Code>
                    </Box>
                  )}

                  {/* TOMTAT Section */}
                  {msg.response.tomtat && (
                    <Box
                      p={2}
                      bg={useColorModeValue("blue.50", "blue.900")}
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderColor="blue.500"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="blue.600"
                        mb={1}
                      >
                        📋 TÓM TẮT
                      </Text>
                      <Text
                        fontSize="xs"
                        color={useColorModeValue("gray.700", "gray.300")}
                      >
                        {msg.response.tomtat}
                      </Text>
                    </Box>
                  )}
                </VStack>
              )}
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box alignSelf="flex-start">
            <Flex align="center" gap={2} p={3} bg={botMsgBg} borderRadius="lg">
              <Spinner size="sm" />
              <Text fontSize="sm">Đang xử lý...</Text>
            </Flex>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </VStack>

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
            placeholder="Hỏi về database..."
            size="sm"
            flex="1"
            borderRadius={"5px"}
            border={"2px"}
            borderColor={borderColor}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
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
            isDisabled={isLoading}
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
            isLoading={isLoading}
            isDisabled={!inputValue.trim() && !selectedImage}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default FloatingChat;
