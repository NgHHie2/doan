// src/components/ExportDiagramButton.tsx
import { Box, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ArrowUpFromLine } from "lucide-react";
import { ExportDialog } from "./ExportDialog";

interface ExportButtonProps {
  schemaData?: any;
}

export const ExportDiagramButton: React.FC<ExportButtonProps> = ({
  schemaData,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label="Export diagram" fontSize="sm" placement="left">
        <IconButton
          aria-label="Export"
          icon={<ArrowUpFromLine size={16} />}
          size="sm"
          onClick={onOpen}
          bg="#333"
          color="white"
          border="1px solid #444"
          _hover={{ bg: "#1c1c1c" }}
        />
      </Tooltip>

      <ExportDialog isOpen={isOpen} onClose={onClose} schemaData={schemaData} />
    </>
  );
};
