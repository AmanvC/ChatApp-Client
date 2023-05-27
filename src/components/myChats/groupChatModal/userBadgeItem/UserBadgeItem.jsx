import { CloseIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction, isCurrentUserAdmin }) => {
  return (
    <Box
      px="2"
      py="1"
      borderRadius="xl"
      variant="solid"
      fontSize="1em"
      backgroundColor="teal"
      color="white"
      display="flex"
      alignItems="center"
      gap="2"
      userSelect="none"
    >
      <Text>{user?.name}</Text>
      {isCurrentUserAdmin && (
        <CloseIcon fontSize="0.6em" cursor="pointer" onClick={handleFunction} />
      )}
    </Box>
  );
};

export default UserBadgeItem;
