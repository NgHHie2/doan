// src/components/TableListDialog.tsx
import React, { useState, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Divider,
  Badge,
  useDisclosure,
  Tooltip,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useStore } from "reactflow";
import type { ReactFlowState } from "reactflow";
import {
  Search,
  Table,
  Edit2,
  Trash2,
  Key,
  Link as LinkIcon,
} from "lucide-react";
import { Model, Attribute } from "../SchemaVisualizer/SchemaVisualizer.types";

interface TableListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFieldNameUpdate?: (attributeId: string, newName: string) => void;
  onFieldTypeUpdate?: (attributeId: string, newType: string) => void;
  onToggleKeyType?: (
    modelId: string,
    attributeId: string,
    keyType: "NORMAL" | "PRIMARY" | "FOREIGN"
  ) => void;
  onDeleteAttribute?: (modelId: string, attributeId: string) => void;
  onAddAttribute?: (modelId: string) => void;
  onDeleteModel?: (modelId: string) => void;
  onModelNameUpdate?: (
    modelId: string,
    oldName: string,
    newName: string
  ) => void;
}

export const TableListDialog: React.FC<TableListDialogProps> = ({
  isOpen,
  onClose,
  onFieldNameUpdate,
  onFieldTypeUpdate,
  onToggleKeyType,
  onDeleteAttribute,
  onAddAttribute,
  onDeleteModel,
  onModelNameUpdate,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingModelName, setEditingModelName] = useState(false);
  const [modelNameValue, setModelNameValue] = useState("");

  // Get all nodes from ReactFlow store
  const allNodes = useStore((state: ReactFlowState) => state.nodeInternals);

  // Convert to array and filter
  const tables = useMemo(() => {
    const nodesArray = Array.from(allNodes.values());
    return nodesArray
      .filter((node) => node.data?.attributes)
      .map((node) => node.data as Model)
      .filter((model) =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allNodes, searchQuery]);

  // Get selected table details
  const selectedTable = useMemo(() => {
    return tables.find((table) => table.id === selectedTableId);
  }, [tables, selectedTableId]);

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setEditingField(null);
    setEditingModelName(false);
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      setModelNameValue(table.name);
    }
  };

  const handleFieldEdit = (fieldId: string, currentValue: string) => {
    setEditingField(fieldId);
    setEditingValue(currentValue);
  };

  const handleFieldSave = (attributeId: string, type: "name" | "dataType") => {
    if (!editingValue.trim()) return;

    if (type === "name" && onFieldNameUpdate) {
      onFieldNameUpdate(attributeId, editingValue);
    } else if (type === "dataType" && onFieldTypeUpdate) {
      onFieldTypeUpdate(attributeId, editingValue);
    }

    setEditingField(null);
    setEditingValue("");
  };

  const handleModelNameSave = () => {
    if (!selectedTable || !modelNameValue.trim()) return;
    if (modelNameValue !== selectedTable.name && onModelNameUpdate) {
      onModelNameUpdate(selectedTable.id, selectedTable.name, modelNameValue);
    }
    setEditingModelName(false);
  };

  const handleToggleKey = (
    attributeId: string,
    currentType: "NORMAL" | "PRIMARY" | "FOREIGN"
  ) => {
    if (!selectedTable) return;

    const nextType: "NORMAL" | "PRIMARY" | "FOREIGN" =
      currentType === "NORMAL"
        ? "PRIMARY"
        : currentType === "PRIMARY"
        ? "FOREIGN"
        : "NORMAL";

    if (onToggleKeyType) {
      onToggleKeyType(selectedTable.id, attributeId, nextType);
    }
  };

  const getKeyIcon = (attr: Attribute) => {
    if (attr.isPrimaryKey)
      return { icon: "🔑", color: "#FFD700", label: "Primary Key" };
    if (attr.isForeignKey)
      return { icon: "🔗", color: "#87CEEB", label: "Foreign Key" };
    return { icon: "○", color: "#999", label: "Normal Field" };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" maxH="90vh">
        <ModalHeader borderBottom="1px solid" borderColor="gray.700">
          <HStack>
            <Table size={20} />
            <Text>Table Manager</Text>
            <Badge colorScheme="blue" ml={2}>
              {tables.length} tables
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0}>
          <HStack align="stretch" spacing={0} h="70vh">
            {/* Left Panel - Table List */}
            <Box
              w="300px"
              borderRight="1px solid"
              borderColor="gray.700"
              overflowY="auto"
              bg="gray.800"
            >
              {/* Search Box */}
              <Box p={3} borderBottom="1px solid" borderColor="gray.700">
                <Input
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                  //   leftElement={<Search size={16} />}
                  bg="gray.900"
                />
              </Box>

              {/* Table List */}
              <VStack spacing={0} align="stretch">
                {tables.map((table) => (
                  <Box
                    key={table.id}
                    p={3}
                    cursor="pointer"
                    bg={
                      selectedTableId === table.id ? "blue.600" : "transparent"
                    }
                    _hover={{
                      bg:
                        selectedTableId === table.id ? "blue.600" : "gray.700",
                    }}
                    borderBottom="1px solid"
                    borderColor="gray.700"
                    onClick={() => handleTableSelect(table.id)}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">
                          {table.name}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {table.attributes?.length || 0} fields
                        </Text>
                      </VStack>
                      <HStack spacing={1}>
                        {table.attributes?.some((a) => a.isPrimaryKey) && (
                          <Badge colorScheme="yellow" fontSize="xs">
                            PK
                          </Badge>
                        )}
                        {table.attributes?.some((a) => a.isForeignKey) && (
                          <Badge colorScheme="blue" fontSize="xs">
                            FK
                          </Badge>
                        )}
                      </HStack>
                    </HStack>
                  </Box>
                ))}

                {tables.length === 0 && (
                  <Box p={6} textAlign="center" color="gray.500">
                    <Text>No tables found</Text>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Right Panel - Table Details */}
            <Box flex={1} overflowY="auto" bg="gray.900" p={4}>
              {selectedTable ? (
                <VStack spacing={4} align="stretch">
                  {/* Table Header */}
                  <Box
                    p={4}
                    bg="gray.800"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.700"
                  >
                    <HStack justify="space-between" mb={2}>
                      {editingModelName ? (
                        <HStack flex={1}>
                          <Input
                            value={modelNameValue}
                            onChange={(e) => setModelNameValue(e.target.value)}
                            size="md"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleModelNameSave();
                              if (e.key === "Escape")
                                setEditingModelName(false);
                            }}
                          />
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={handleModelNameSave}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setEditingModelName(false)}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      ) : (
                        <>
                          <HStack>
                            <Text fontSize="2xl" fontWeight="bold">
                              {selectedTable.name}
                            </Text>
                            <IconButton
                              aria-label="Edit table name"
                              icon={<Edit2 size={16} />}
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingModelName(true)}
                            />
                          </HStack>
                          <Tooltip label="Delete table">
                            <IconButton
                              aria-label="Delete table"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => {
                                if (
                                  onDeleteModel &&
                                  window.confirm(
                                    `Delete table "${selectedTable.name}"?`
                                  )
                                ) {
                                  onDeleteModel(selectedTable.id);
                                  setSelectedTableId(null);
                                }
                              }}
                            />
                          </Tooltip>
                        </>
                      )}
                    </HStack>

                    <HStack spacing={4} fontSize="sm" color="gray.400">
                      <Text>ID: {selectedTable.id}</Text>
                      <Text>Type: {selectedTable.modelType}</Text>
                      <Text>
                        Fields: {selectedTable.attributes?.length || 0}
                      </Text>
                    </HStack>
                  </Box>

                  {/* Fields Section */}
                  <Box>
                    <HStack justify="space-between" mb={3}>
                      <Text fontSize="lg" fontWeight="bold">
                        Fields
                      </Text>
                      {onAddAttribute && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => onAddAttribute(selectedTable.id)}
                        >
                          Add Field
                        </Button>
                      )}
                    </HStack>

                    <VStack spacing={2} align="stretch">
                      {selectedTable.attributes?.map((attr) => {
                        const keyInfo = getKeyIcon(attr);
                        return (
                          <Box
                            key={attr.id}
                            p={3}
                            bg="gray.800"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.700"
                            _hover={{ borderColor: "gray.600" }}
                          >
                            <HStack justify="space-between" mb={2}>
                              <HStack spacing={2}>
                                <Tooltip label={keyInfo.label}>
                                  <Box
                                    fontSize="16px"
                                    cursor="pointer"
                                    onClick={() => {
                                      const currentType = attr.isPrimaryKey
                                        ? "PRIMARY"
                                        : attr.isForeignKey
                                        ? "FOREIGN"
                                        : "NORMAL";
                                      handleToggleKey(attr.id, currentType);
                                    }}
                                  >
                                    {keyInfo.icon}
                                  </Box>
                                </Tooltip>

                                {editingField === `${attr.id}-name` ? (
                                  <HStack>
                                    <Input
                                      value={editingValue}
                                      onChange={(e) =>
                                        setEditingValue(e.target.value)
                                      }
                                      size="sm"
                                      w="150px"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          handleFieldSave(attr.id, "name");
                                        if (e.key === "Escape")
                                          setEditingField(null);
                                      }}
                                    />
                                    <Button
                                      size="xs"
                                      colorScheme="green"
                                      onClick={() =>
                                        handleFieldSave(attr.id, "name")
                                      }
                                    >
                                      Save
                                    </Button>
                                  </HStack>
                                ) : (
                                  <HStack>
                                    <Text
                                      fontWeight="bold"
                                      color={keyInfo.color}
                                    >
                                      {attr.name}
                                    </Text>
                                    <IconButton
                                      aria-label="Edit field name"
                                      icon={<Edit2 size={12} />}
                                      size="xs"
                                      variant="ghost"
                                      onClick={() =>
                                        handleFieldEdit(
                                          `${attr.id}-name`,
                                          attr.name
                                        )
                                      }
                                    />
                                  </HStack>
                                )}
                              </HStack>

                              <IconButton
                                aria-label="Delete field"
                                icon={<Trash2 size={14} />}
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => {
                                  if (
                                    onDeleteAttribute &&
                                    window.confirm(
                                      `Delete field "${attr.name}"?`
                                    )
                                  ) {
                                    onDeleteAttribute(
                                      selectedTable.id,
                                      attr.id
                                    );
                                  }
                                }}
                              />
                            </HStack>

                            <HStack spacing={4} fontSize="sm">
                              <HStack>
                                <Text color="gray.400">Type:</Text>
                                {editingField === `${attr.id}-type` ? (
                                  <HStack>
                                    <Input
                                      value={editingValue}
                                      onChange={(e) =>
                                        setEditingValue(e.target.value)
                                      }
                                      size="sm"
                                      w="120px"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          handleFieldSave(attr.id, "dataType");
                                        if (e.key === "Escape")
                                          setEditingField(null);
                                      }}
                                    />
                                    <Button
                                      size="xs"
                                      colorScheme="green"
                                      onClick={() =>
                                        handleFieldSave(attr.id, "dataType")
                                      }
                                    >
                                      Save
                                    </Button>
                                  </HStack>
                                ) : (
                                  <HStack>
                                    <Text color="blue.300">
                                      {attr.dataType}
                                    </Text>
                                    <IconButton
                                      aria-label="Edit field type"
                                      icon={<Edit2 size={12} />}
                                      size="xs"
                                      variant="ghost"
                                      onClick={() =>
                                        handleFieldEdit(
                                          `${attr.id}-type`,
                                          attr.dataType
                                        )
                                      }
                                    />
                                  </HStack>
                                )}
                              </HStack>

                              {attr.connection && (
                                <HStack>
                                  <LinkIcon size={14} color="#87CEEB" />
                                  <Text color="blue.300" fontSize="xs">
                                    → {attr.connection.targetModelId}.
                                    {attr.connection.targetAttributeId}
                                  </Text>
                                </HStack>
                              )}
                            </HStack>

                            <HStack mt={2} spacing={2}>
                              {attr.isNullable && (
                                <Badge colorScheme="gray" fontSize="xs">
                                  Nullable
                                </Badge>
                              )}
                              {attr.isUnique && (
                                <Badge colorScheme="purple" fontSize="xs">
                                  Unique
                                </Badge>
                              )}
                              {attr.isAutoIncrement && (
                                <Badge colorScheme="green" fontSize="xs">
                                  Auto Increment
                                </Badge>
                              )}
                              {attr.hasIndex && (
                                <Badge colorScheme="orange" fontSize="xs">
                                  Indexed
                                </Badge>
                              )}
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                </VStack>
              ) : (
                <Flex h="100%" align="center" justify="center" color="gray.500">
                  <VStack>
                    <Table size={48} opacity={0.3} />
                    <Text fontSize="lg">Select a table to view details</Text>
                  </VStack>
                </Flex>
              )}
            </Box>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
