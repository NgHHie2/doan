import {
  Avatar,
  Tooltip,
  useColorModeValue,
  Stack,
  Text,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";

export const AccountGroup = () => {
  const bgColor = useColorModeValue("white", "#333");
  const iconColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("white", "#444"); // 🌟 border responsive
  const tooltipPlacement = useBreakpointValue<
    "top" | "bottom" | "left" | "right"
  >({
    base: "left",
    sm: "bottom",
  });

  return (
    <Tooltip label="..." placement={tooltipPlacement} hasArrow>
      <Stack
        direction={{ base: "column", sm: "row" }} // xs/sm = dọc, sm+ = ngang
        align="center"
      >
        <Avatar
          h="30px"
          w="30px"
          border={`2px solid ${borderColor}`} // 🌟 border màu theo theme
          name="Uchiha Sasuke"
          src="https://cdn.myanimelist.net/r/84x124/images/characters/9/131317.webp?s=d4b03c7291407bde303bc0758047f6bd"
          mt={{ base: 0, sm: 0 }}
          ml={{ base: 0, sm: 0 }}
        />
        <Avatar
          h="30px"
          w="30px"
          border={`2px solid ${borderColor}`}
          name="Baki Ani"
          src="https://cdn.myanimelist.net/r/84x124/images/characters/7/284129.webp?s=a8998bf668767de58b33740886ca571c"
          mt={{ base: -5, sm: 0 }} // dọc: chồng nhẹ
          ml={{ base: 0, sm: -5 }} // ngang: chồng nhẹ
        />
        <Box
          textColor={iconColor}
          bg={bgColor}
          h="30px"
          w="30px"
          border={`2px solid ${borderColor}`}
          fontSize={"xs"}
          mt={{ base: -5, sm: 0 }}
          ml={{ base: 0, sm: -5 }}
          borderRadius={"50%"}
          zIndex={100}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          +3
        </Box>
      </Stack>
    </Tooltip>
  );
};
