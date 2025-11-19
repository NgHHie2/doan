// src/hooks/useChatActions.ts
import { useCallback } from "react";
import {
  findAttributeIdByName,
  findModelIdByName,
  delay,
} from "../utils/nodeHelpers";

interface UseChatActionsProps {
  allNodes: Map<string, any>;
  // Original handlers từ useSchemaVisualizer
  onAddModel?: () => string;
  onAddAttribute?: (modelId: string) => string;
  onFieldNameUpdate?: (attributeId: string, attributeName: string) => void;
  onFieldTypeUpdate?: (attributeId: string, attributeType: string) => void;
  onToggleKeyType?: (
    modelId: string,
    attributeId: string,
    keyType: "NORMAL" | "PRIMARY" | "FOREIGN"
  ) => void;
  onForeignKeyConnect?: (
    attributeId: string,
    targetModelId: string,
    targetAttributeId: string
  ) => void;
  onModelNameUpdate?: (
    modelId: string,
    oldName: string,
    newName: string
  ) => void;
}

/**
 * Custom hook để wrap các handlers thành các functions dễ sử dụng hơn
 * cho AI chat actions
 */
export const useChatActions = ({
  allNodes,
  onAddModel,
  onAddAttribute,
  onFieldNameUpdate,
  onFieldTypeUpdate,
  onToggleKeyType,
  onForeignKeyConnect,
  onModelNameUpdate,
}: UseChatActionsProps) => {
  /**
   * Tạo model mới với tên cụ thể
   */
  const handleCreateModel = useCallback(
    async (modelName: string): Promise<void> => {
      if (!onAddModel || !onModelNameUpdate) {
        throw new Error("Required handlers not provided");
      }

      // 1. Tạo model mới
      const id = onAddModel();
      console.log("vjp pro: ", id);
      await delay(300);

      // 4. Rename model
      onModelNameUpdate(id, "Model", modelName);

      // 5. Đợi rename hoàn tất
      await delay(300);
    },
    [onAddModel, onModelNameUpdate, allNodes]
  );

  /**
   * Thêm attribute mới với tên, type và PK flag
   */
  const handleCreateAttribute = useCallback(
    async (
      modelId: string,
      attributeName: string,
      dataType: string,
      isPrimaryKey: boolean = false
    ): Promise<void> => {
      if (
        !onAddAttribute ||
        !onFieldNameUpdate ||
        !onFieldTypeUpdate ||
        !onToggleKeyType
      ) {
        throw new Error("Required handlers not provided");
      }

      // 1. Tạo attribute mới
      const id = onAddAttribute(modelId);

      // 2. Đợi attribute được tạo
      await delay(300);

      // 3. Tìm attribute vừa tạo
      const attributeId = id;

      // 4. Update name
      onFieldNameUpdate(attributeId, attributeName);
      await delay(100);

      // 5. Update type
      onFieldTypeUpdate(attributeId, dataType);
      await delay(100);

      // 6. Set primary key nếu cần
      if (isPrimaryKey) {
        onToggleKeyType(modelId, attributeId, "PRIMARY");
        await delay(100);
      }
    },
    [
      onAddAttribute,
      onFieldNameUpdate,
      onFieldTypeUpdate,
      onToggleKeyType,
      allNodes,
    ]
  );

  /**
   * Tạo foreign key connection
   */
  const handleCreateForeignKey = useCallback(
    async (
      sourceModelId: string,
      sourceColumnName: string,
      targetModelName: string,
      targetColumnName: string
    ): Promise<void> => {
      if (!onForeignKeyConnect || !onToggleKeyType) {
        throw new Error("Required handlers not provided");
      }

      // 1. Tìm source attribute ID
      const sourceAttributeId = findAttributeIdByName(
        allNodes,
        sourceModelId,
        sourceColumnName
      );
      if (!sourceAttributeId) {
        throw new Error(
          `Không tìm thấy attribute ${sourceColumnName} trong model ${sourceModelId}`
        );
      }

      // 2. Tìm target model ID
      const targetModelId = findModelIdByName(allNodes, targetModelName);
      if (!targetModelId) {
        throw new Error(`Không tìm thấy model ${targetModelName}`);
      }

      // 3. Tìm target attribute ID
      const targetAttributeId = findAttributeIdByName(
        allNodes,
        targetModelId,
        targetColumnName
      );
      if (!targetAttributeId) {
        throw new Error(
          `Không tìm thấy attribute ${targetColumnName} trong model ${targetModelName}`
        );
      }

      // 4. Set source attribute as foreign key
      onToggleKeyType(sourceModelId, sourceAttributeId, "FOREIGN");
      await delay(200);

      // 5. Create connection
      onForeignKeyConnect(sourceAttributeId, targetModelId, targetAttributeId);
      await delay(200);
    },
    [onForeignKeyConnect, onToggleKeyType, allNodes]
  );

  return {
    handleCreateModel,
    handleCreateAttribute,
    handleCreateForeignKey,
  };
};
