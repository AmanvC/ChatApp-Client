import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box } from "@chakra-ui/react";
import SingleChat from "./singleChat/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(AuthContext);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "65%" }}
      bg="white"
      color="black"
      flexDir="column"
      alignItems="center"
      p="5"
      borderRadius="lg"
      boxShadow="dark-lg"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
