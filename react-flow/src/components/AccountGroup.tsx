// AccountGroup.tsx - Realtime updates với WebSocket
import { useEffect, useState } from "react";
import {
  Avatar,
  Tooltip,
  useColorModeValue,
  Stack,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { collaborationApiService } from "../services/collaborationApiService";
import { AccountDTO } from "../types/collaboration.types";

interface AccountGroupProps {
  onlineUsernames?: string[]; // ⭐ Nhận từ parent qua WebSocket
}

export const AccountGroup: React.FC<AccountGroupProps> = ({
  onlineUsernames = [],
}) => {
  const { diagramId } = useParams<{ diagramId: string }>();
  const [onlineUsers, setOnlineUsers] = useState<AccountDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("white", "#333");
  const borderColor = useColorModeValue("white", "#444");

  // Load user details when onlineUsernames change
  useEffect(() => {
    const loadOnlineUsers = async () => {
      if (!onlineUsernames || onlineUsernames.length === 0) {
        setOnlineUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load details for each username in parallel
        const promises = onlineUsernames.map(async (username) => {
          try {
            const email = `${username}@gmail.com`;
            return await collaborationApiService.searchAccountByEmail(email);
          } catch {
            return null;
          }
        });

        const results = await Promise.all(promises);
        setOnlineUsers(results.filter((r) => r !== null) as AccountDTO[]);
      } catch (error) {
        console.error("Failed to load online users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOnlineUsers();
  }, [onlineUsernames]);

  if (loading) {
    return <Spinner size="sm" />;
  }

  if (onlineUsers.length === 0) {
    return null;
  }

  const displayUsers = onlineUsers.slice(0, 3);
  const extraCount = onlineUsers.length - 3;

  return (
    <Tooltip
      label={onlineUsers.map((u) => u.name).join(", ")}
      placement="bottom"
      hasArrow
    >
      <Stack direction="row" align="center" spacing={-2}>
        {displayUsers.map((user, index) => (
          <Avatar
            key={user.username}
            h="30px"
            w="30px"
            border={`2px solid ${borderColor}`}
            name={user.name}
            zIndex={displayUsers.length - index}
          />
        ))}
        {extraCount > 0 && (
          <Box
            textColor="gray.600"
            bg={bgColor}
            h="30px"
            w="30px"
            border={`2px solid ${borderColor}`}
            fontSize="xs"
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            +{extraCount}
          </Box>
        )}
      </Stack>
    </Tooltip>
  );
};
