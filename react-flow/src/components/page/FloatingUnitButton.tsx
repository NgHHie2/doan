import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { IconButton, Box, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

export const FloatingUnitButton = ({ onClick }: { onClick?: () => void }) => {
  const bgColor = useColorModeValue("white", "#42474eff");
  const iconColor = useColorModeValue("black", "white");

  const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;
  const spinAnimation = `${spin} 3s linear infinite`;

  return (
    <Box
      position="fixed"
      bottom={10}
      right={10}
      zIndex={20}
      borderRadius="full"
      boxShadow="0 5px 15px rgba(0,0,0,0.3)"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: "scale(1.2)",
        boxShadow: "0 10px 25px rgba(88, 106, 167, 0.5)",
      }}
    >
      <Tooltip label="Navigator" placement="bottom" hasArrow gutter={20}>
        <IconButton
          aria-label="Deployment Unit"
          icon={<AiOutlineDeploymentUnit size={28} />}
          boxSize={"50px"}
          onClick={onClick}
          bg={bgColor}
          color={iconColor}
          borderRadius="full"
          transition="all 0.3s ease-in-out"
          _hover={{
            bgGradient: "linear(to-br, blue.400, teal.400)", // gradient nền khi hover
            color: "white",
            svg: {
              animation: spinAnimation, // chỉ icon xoay
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default FloatingUnitButton;
