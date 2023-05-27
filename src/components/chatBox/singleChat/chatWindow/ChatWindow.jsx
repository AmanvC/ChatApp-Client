import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { isSameSender } from "../../../../config/ChatLogic";
import { getRandomColor } from "../../../../config/RandomColor";

const ChatWindow = ({ messages, selectedChat }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <Text textAlign="center" mb="20px" opacity="0.4">
        This is the beginning of the chat.
      </Text>
      {messages?.map((message, index) => (
        <Box display="flex" flexDir="column" key={message._id}>
          {selectedChat?.isGroupChat ? (
            <>
              {message.sender._id !== currentUser._id &&
                !isSameSender(messages, index) && (
                  <HStack mt="20px">
                    <Avatar src={message.sender?.picture} size="xs" />
                    <small
                      //   style={{ color: getRandomColor(), fontWeight: "600" }}
                      style={{ color: "#565656", fontWeight: "600" }}
                    >
                      {message.sender?.name}
                    </small>
                  </HStack>
                )}
              <Box
                backgroundColor={
                  message.sender._id === currentUser._id ? "teal" : "#565656"
                }
                alignSelf={
                  message.sender._id === currentUser._id
                    ? "flex-end"
                    : "flex-start"
                }
                padding="5px 10px "
                borderRadius="10px"
                color="white"
                margin="4px 0"
                maxWidth="48%"
              >
                <Text>{message.content}</Text>
              </Box>
            </>
          ) : (
            <Text
              backgroundColor={
                message.sender._id === currentUser._id ? "teal" : "#565656"
              }
              alignSelf={
                message.sender._id === currentUser._id
                  ? "flex-end"
                  : "flex-start"
              }
              padding="5px 10px "
              borderRadius="10px"
              color="white"
              margin="5px 0"
              maxWidth="48%"
            >
              {message.content}
            </Text>
          )}
        </Box>
      ))}
    </>
  );
};

export default ChatWindow;
