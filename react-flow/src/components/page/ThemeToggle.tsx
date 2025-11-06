import {
  IconButton,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const borderColor = useColorModeValue("#d0d7de", "#444");

  return (
    <Tooltip label="Theme" hasArrow placement="bottom">
      <IconButton
        aria-label="Toggle theme"
        icon={
          colorMode === "light" ? (
            <MoonIcon boxSize={"17px"} />
          ) : (
            <SunIcon boxSize={"20px"} />
          )
        }
        onClick={toggleColorMode}
        // variant="ghost"
        // mr={2}
        // ml={1.5}
        size="md"
        borderRadius={"50%"}
        border={"1px"}
        borderColor={borderColor}
      />
    </Tooltip>
  );
}
