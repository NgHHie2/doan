import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { IconButton, Box, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

export const FloatingUnitButton = ({ onClick }: { onClick?: () => void }) => {
  const bgColor = useColorModeValue("white", "#42474eff");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("#d0d7de", "#30363d");

  const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;
  const spinAnimation = `${spin} 3s linear infinite`;

  return (
    <Tooltip label="Ask Sherpa" placement="bottom" hasArrow gutter={13}>
      <IconButton
        aria-label="Deployment Unit"
        icon={<AiOutlineDeploymentUnit size={25} />}
        boxSize={"40px"}
        onClick={onClick}
        color={iconColor}
        borderRadius="full"
        border={"1px"}
        ml={3.5}
        borderColor={borderColor}
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: "scale(1.2)",
          bgGradient: "linear(to-br, blue.400, teal.400)",
          color: "white",
          boxShadow: "0 10px 25px rgba(88, 106, 167, 0.5)",
          svg: {
            animation: spinAnimation,
          },
        }}
      />
    </Tooltip>
  );
};

export default FloatingUnitButton;
