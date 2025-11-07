import {
  Box,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Workflow } from "lucide-react";

interface AutoAlignButtonProps {}

export const AutoAlignButton: React.FC<AutoAlignButtonProps> = ({}) => {
  const borderColor = useColorModeValue("#d0d7de", "#444");
  const bgColor = useColorModeValue("white", "#333");
  const iconColor = useColorModeValue("gray.700", "white");
  const hoverBg = useColorModeValue("white", "#1c1c1c");
  return (
    <Tooltip label={"Auto align"} fontSize="sm" placement="left">
      <IconButton
        aria-label="Auto align"
        icon={<Workflow size={16} />}
        size="sm"
        bg={bgColor}
        color={iconColor}
        border="1px solid"
        borderColor={borderColor}
        _hover={{ bg: hoverBg }}
        _disabled={{
          opacity: 0.4,
          cursor: "not-allowed",
        }}
      />
    </Tooltip>
  );
};
