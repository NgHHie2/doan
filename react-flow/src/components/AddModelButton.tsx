import { Box, Button, IconButton, Tooltip } from "@chakra-ui/react";
import { Plus } from "lucide-react";

interface AddModelButtonProps {
  onAddModel: () => void;
  isConnected: boolean;
}

export const AddModelButton: React.FC<AddModelButtonProps> = ({
  onAddModel,
  isConnected,
}) => {
  return (
    <Tooltip
      label={isConnected ? "Add new table" : "Connect to add tables"}
      fontSize="sm"
      placement="left"
    >
      <IconButton
        aria-label="Add Table"
        icon={<Plus size={16} />}
        size="sm"
        onClick={onAddModel}
        isDisabled={!isConnected}
        bg="#333"
        color="white"
        border="1px solid #444"
        _hover={{ bg: "#1c1c1c" }}
        _disabled={{
          opacity: 0.4,
          cursor: "not-allowed",
        }}
      />
    </Tooltip>
  );
};
