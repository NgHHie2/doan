import { Box, Button, IconButton, Tooltip } from "@chakra-ui/react";
import { Workflow } from "lucide-react";

interface AutoAlignButtonProps {}

export const AutoAlignButton: React.FC<AutoAlignButtonProps> = ({}) => {
  return (
    <Tooltip label={"Auto align"} fontSize="sm" placement="left">
      <IconButton
        aria-label="Auto align"
        icon={<Workflow size={16} />}
        size="sm"
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
