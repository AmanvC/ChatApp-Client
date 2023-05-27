import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { makeRequest } from "../../utils/axios";
import { AddIcon } from "@chakra-ui/icons";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { getSenderName } from "../../config/ChatLogic";
import GroupChatModal from "./groupChatModal/GroupChatModal";

const MyChats = ({ setAllChats, allChats, fetchAgain }) => {
  const { selectedChat, setSelectedChat, currentUser } =
    useContext(AuthContext);

  const toast = useToast();

  useEffect(() => {
    fetchChats();
  }, [fetchAgain, setSelectedChat]);

  const fetchChats = async () => {
    try {
      const res = await makeRequest().get("/chats/get-all");
      setAllChats(res.data.data);
    } catch (err) {
      toast({
        title: "Something went wrong!",
        description: "Failed to load chats!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="3"
      bg="white"
      w={{ base: "100%", md: "33%" }}
      borderRadius="lg"
      boxShadow="dark-lg"
    >
      <Box
        p="3"
        fontSize={{ base: "2em", md: "1.15em", lg: "1.55em" }}
        fontFamily="Work sans"
        color="black"
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        All Chats
        <GroupChatModal allChats={allChats} setAllChats={setAllChats}>
          <Button
            display="flex"
            p="3"
            fontSize={{ sm: "20px", md: "13px", lg: "16px" }}
            rightIcon={<AddIcon fontSize="12px" />}
          >
            Create Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p="3"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {allChats ? (
          <Stack overflowY="scroll" height="100%">
            {allChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat?._id ? "teal" : "#E8E8E8"}
                color={selectedChat?._id === chat?._id ? "white" : "black"}
                p="3"
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat?.isGroupChat
                    ? getSenderName(currentUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <LoadingSpinner />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
