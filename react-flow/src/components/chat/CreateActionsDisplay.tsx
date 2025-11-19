// src/components/chat/CreateActionsDisplay.tsx
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  Code,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FC, useState, useCallback } from "react";
import { FaPlus, FaLink } from "react-icons/fa";
import { ChatbotResponse } from "../../services/chatbotService";
import {
  findAttributeIdByName,
  findModelIdByName,
  delay,
} from "../../utils/nodeHelpers";

interface CreateActionsDisplayProps {
  createActions: ChatbotResponse["create"];
  allNodes: Map<string, any>;
  onCreateModel?: (modelName: string) => Promise<void>;
  onCreateAttribute?: (
    modelId: string,
    attributeName: string,
    dataType: string,
    isPrimaryKey?: boolean
  ) => Promise<void>;
  onCreateForeignKey?: (
    sourceModelId: string,
    sourceColumnName: string,
    targetModelName: string,
    targetColumnName: string
  ) => Promise<void>;
}

export const CreateActionsDisplay: FC<CreateActionsDisplayProps> = ({
  createActions,
  allNodes,
  onCreateModel,
  onCreateAttribute,
  onCreateForeignKey,
}) => {
  const createBg = useColorModeValue("green.50", "green.900");
  const toast = useToast();
  const [processingModels, setProcessingModels] = useState<Set<string>>(
    new Set()
  );
  const [processingAttrs, setProcessingAttrs] = useState<Set<string>>(
    new Set()
  );
  const [processingFKs, setProcessingFKs] = useState<Set<string>>(new Set());

  // Handler tạo model
  const handleCreateModel = useCallback(
    async (modelName: string) => {
      if (!onCreateModel) {
        toast({
          title: "Lỗi",
          description: "Chức năng chưa được kích hoạt",
          status: "error",
          duration: 2000,
        });
        return;
      }

      setProcessingModels((prev) => new Set(prev).add(modelName));

      try {
        await onCreateModel(modelName);

        toast({
          title: "Thành công",
          description: `Đã tạo bảng ${modelName}`,
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error creating model:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tạo bảng",
          status: "error",
          duration: 2000,
        });
      } finally {
        setProcessingModels((prev) => {
          const next = new Set(prev);
          next.delete(modelName);
          return next;
        });
      }
    },
    [onCreateModel, toast]
  );

  // Handler thêm attribute
  const handleAddAttribute = useCallback(
    async (
      modelId: string,
      attrData: { name: string; type: string; pk?: boolean }
    ) => {
      if (!onCreateAttribute) {
        toast({
          title: "Lỗi",
          description: "Chức năng chưa được kích hoạt",
          status: "error",
          duration: 2000,
        });
        return;
      }

      const attrKey = `${modelId}-${attrData.name}`;
      setProcessingAttrs((prev) => new Set(prev).add(attrKey));

      try {
        await onCreateAttribute(
          modelId,
          attrData.name,
          attrData.type,
          attrData.pk || false
        );

        toast({
          title: "Thành công",
          description: `Đã thêm thuộc tính ${attrData.name}`,
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error adding attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể thêm thuộc tính",
          status: "error",
          duration: 2000,
        });
      } finally {
        setProcessingAttrs((prev) => {
          const next = new Set(prev);
          next.delete(attrKey);
          return next;
        });
      }
    },
    [onCreateAttribute, toast]
  );

  // Handler tạo foreign key
  const handleCreateForeignKey = useCallback(
    async (
      sourceModelId: string,
      sourceColumnName: string,
      targetModelName: string,
      targetColumnName: string
    ) => {
      if (!onCreateForeignKey) {
        toast({
          title: "Lỗi",
          description: "Chức năng chưa được kích hoạt",
          status: "error",
          duration: 2000,
        });
        return;
      }

      const fkKey = `${sourceModelId}-${sourceColumnName}`;
      setProcessingFKs((prev) => new Set(prev).add(fkKey));

      try {
        await onCreateForeignKey(
          sourceModelId,
          sourceColumnName,
          targetModelName,
          targetColumnName
        );

        toast({
          title: "Thành công",
          description: `Đã tạo khóa ngoại ${sourceColumnName}`,
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error creating foreign key:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tạo khóa ngoại",
          status: "error",
          duration: 2000,
        });
      } finally {
        setProcessingFKs((prev) => {
          const next = new Set(prev);
          next.delete(fkKey);
          return next;
        });
      }
    },
    [onCreateForeignKey, toast]
  );

  return (
    <VStack align="stretch" spacing={2}>
      {createActions.map((model, idx) => {
        // Check if model already exists
        const existingModelId = findModelIdByName(allNodes, model.name);
        const isNewModel = !existingModelId;
        const modelId = existingModelId || `temp-${model.name}`;

        return (
          <Box
            key={idx}
            p={3}
            bg={createBg}
            borderRadius="md"
            borderLeft="3px solid"
            borderColor="green.500"
          >
            {/* Model Header */}
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Text fontSize="sm" fontWeight="bold" color="green.600">
                  Table
                </Text>
                <Badge colorScheme={isNewModel ? "green" : "blue"}>
                  {model.name}
                </Badge>
              </HStack>
              {isNewModel && (
                <Tooltip label="Tạo bảng mới">
                  <IconButton
                    aria-label="Create table"
                    icon={<FaPlus />}
                    size="xs"
                    colorScheme="green"
                    isLoading={processingModels.has(model.name)}
                    onClick={() => handleCreateModel(model.name)}
                  />
                </Tooltip>
              )}
            </HStack>

            {/* Attributes Section */}
            {model.attrs && model.attrs.length > 0 && (
              <Box mt={2} pl={2}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  mb={1}
                >
                  Attribute ({model.attrs.length}):
                </Text>
                <VStack align="stretch" spacing={1}>
                  {model.attrs.map((attr, attrIdx) => {
                    const attrKey = `${modelId}-${attr.name}`;
                    const isProcessing = processingAttrs.has(attrKey);

                    return (
                      <HStack
                        key={attrIdx}
                        fontSize="xs"
                        p={1.5}
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="sm"
                        justify="space-between"
                      >
                        <HStack spacing={2}>
                          <Code fontSize="10px" colorScheme="green">
                            {attr.name}
                          </Code>
                          <Badge size="sm" colorScheme="gray" fontSize="9px">
                            {attr.type}
                          </Badge>
                          {attr.pk && (
                            <Badge
                              size="sm"
                              colorScheme="yellow"
                              fontSize="9px"
                            >
                              PK
                            </Badge>
                          )}
                        </HStack>
                        <Tooltip label="Thêm thuộc tính">
                          <IconButton
                            aria-label="Add attribute"
                            icon={<FaPlus />}
                            size="xs"
                            variant="ghost"
                            colorScheme="green"
                            isLoading={isProcessing}
                            isDisabled={isNewModel}
                            onClick={() =>
                              handleAddAttribute(modelId, {
                                name: attr.name,
                                type: attr.type,
                                pk: attr.pk,
                              })
                            }
                          />
                        </Tooltip>
                      </HStack>
                    );
                  })}
                </VStack>
              </Box>
            )}

            {/* Foreign Keys Section */}
            {model.fks && model.fks.length > 0 && (
              <Box mt={2} pl={2}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  mb={1}
                >
                  🔗 Foreign key ({model.fks.length}):
                </Text>
                <VStack align="stretch" spacing={1}>
                  {model.fks.map((fk, fkIdx) => {
                    const [targetTable, targetColumn] =
                      fk.references.split(".");
                    const fkKey = `${modelId}-${fk.column}`;
                    const isProcessing = processingFKs.has(fkKey);

                    return (
                      <HStack
                        key={fkIdx}
                        fontSize="xs"
                        p={1.5}
                        bg={useColorModeValue("blue.50", "blue.900")}
                        borderRadius="sm"
                        justify="space-between"
                      >
                        <HStack spacing={1}>
                          <Code fontSize="10px" colorScheme="blue">
                            {fk.column}
                          </Code>
                          <Text fontSize="10px">→</Text>
                          <Code fontSize="10px" colorScheme="purple">
                            {targetTable}.{targetColumn}
                          </Code>
                        </HStack>
                        <Tooltip label="Tạo liên kết khóa ngoại">
                          <IconButton
                            aria-label="Create foreign key"
                            icon={<FaLink />}
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            isLoading={isProcessing}
                            isDisabled={isNewModel}
                            onClick={() =>
                              handleCreateForeignKey(
                                modelId,
                                fk.column,
                                targetTable,
                                targetColumn
                              )
                            }
                          />
                        </Tooltip>
                      </HStack>
                    );
                  })}
                </VStack>
              </Box>
            )}
          </Box>
        );
      })}
    </VStack>
  );
};
