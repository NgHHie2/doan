import { Button, IconButton, Tooltip } from "@chakra-ui/react";
import { List, Pencil } from "lucide-react";

interface TableListButtonProps {
  onClick: () => void;
}

export const TableListButton: React.FC<TableListButtonProps> = ({
  onClick,
}) => {
  return (
    <Tooltip label="View all tables" fontSize="sm" placement="left">
      <IconButton
        aria-label="List Tables"
        icon={<Pencil size={16} />}
        size="sm"
        onClick={onClick}
        bg="#333"
        color="white"
        border="1px solid #444"
        _hover={{ bg: "#1c1c1c" }}
      >
        Tables
      </IconButton>
    </Tooltip>
  );
};
