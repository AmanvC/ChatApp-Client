import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { NO_USER_IMAGE } from "../../../utils/constants";

const UserListItem = ({ user, handleFunction }) => {
  const { curentUser } = useContext(AuthContext);

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      backgroundColor="#b2d8d8"
      _hover={{
        background: "#66b2b2",
        color: "white",
      }}
      display="flex"
      alignItems="center"
      p="3.5"
      mb="3"
      borderRadius="lg"
      boxShadow="lg"
      w="100%"
    >
      <Avatar
        mr="5"
        size="lg"
        bg="#006666"
        color="white"
        name={user?.name}
        src={user?.picture}
      />
      <Box>
        <Text fontSize="1.5em">{user?.name}</Text>
        <Text>
          <small>
            <b>Email: </b>
            {user?.email}
          </small>
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
