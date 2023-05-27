import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  SkeletonText,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import UserBadgeItem from "../../../myChats/groupChatModal/userBadgeItem/UserBadgeItem";
import UserListItem from "../../../sideDrawer/userListItem/UserListItem";
import { makeRequest } from "../../../../utils/axios";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchAllMessages,
}) => {
  const { selectedChat, currentUser, setSelectedChat } =
    useContext(AuthContext);
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRemoveUser = async (user) => {
    try {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
      const res = await makeRequest().patch("/chats/remove-user", {
        userId: user._id,
        chatId: selectedChat._id,
      });
      setSelectedChat(res?.data?.data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      toast({
        title: "User removed successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Something went wrong!",
        description: "Could remove user from the group!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddUser = async (user) => {
    try {
      for (const u of selectedChat?.users) {
        if (JSON.stringify(u) === JSON.stringify(user)) {
          toast({
            title: `${user.name} is already added in the group!`,
            status: "warning",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
          return;
        }
      }
      setAddUserLoading(true);
      const res = await makeRequest().patch("/chats/add-user", {
        userId: user._id,
        chatId: selectedChat._id,
      });
      setSelectedChat(res?.data?.data);
      setFetchAgain(!fetchAgain);
      setAddUserLoading(false);
      toast({
        title: "User Added successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      setAddUserLoading(false);
      toast({
        title: "Something went wrong!",
        description: "Cannot search user!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSearchUser = async (e) => {
    try {
      const query = e.target.value.trimStart();
      setSearchUser(query);
      if (!query) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const res = await makeRequest().get(`/users?search=${query}`);
      setLoading(false);
      setSearchResults(res.data);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Something went wrong!",
        description: "Cannot search user!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleUpdateGroupName = async () => {
    try {
      const res = await makeRequest().patch("/chats/rename-group", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      toast({
        title: "Group name updated successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      setLoading(false);
      toast({
        title: "Something went wrong!",
        description: "Group name cannot be updated!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await makeRequest().patch("/chats/remove-user", {
        userId: currentUser._id,
        chatId: selectedChat._id,
      });
      setSelectedChat(null);
      setFetchAgain(!fetchAgain);
      toast({
        title: "You are no longer a participant.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Something went wrong!",
        description: "Cannot exit the group!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const isCurrentUserAdmin = () => {
    const arr = selectedChat?.groupAdmins?.filter(
      (user) => user._id === currentUser._id
    );
    return arr.length === 1;
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        size="lg"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="2em"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" gap="5px" flexWrap="wrap" w="100%" mb="20px">
              {selectedChat?.users?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemoveUser(user)}
                  isCurrentUserAdmin={() => isCurrentUserAdmin()}
                />
              ))}
            </Box>
            <FormControl isRequired display="flex" gap="10px" mb="10px">
              <Input
                type="text"
                placeholder="Update Group Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                userSelect="none"
              />
              <Button variant="solid" onClick={handleUpdateGroupName}>
                Update
              </Button>
            </FormControl>
            {isCurrentUserAdmin() && (
              <FormControl>
                <Input
                  type="text"
                  placeholder="Add users..."
                  value={searchUser}
                  userSelect="none"
                  onChange={handleSearchUser}
                />
              </FormControl>
            )}

            <Box display="flex" gap="5px" flexWrap="wrap" w="100%">
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemoveUser(user)}
                />
              ))}
            </Box>

            <Box w="100%" mt="4">
              {loading ? (
                <VStack>
                  <Box
                    display="flex"
                    gap="10px"
                    w="100%"
                    boxShadow="lg"
                    bg="white"
                    p="20px"
                    borderRadius="10px"
                    alignItems="center"
                  >
                    <SkeletonCircle size="50px" />
                    <SkeletonText
                      flex="1"
                      noOfLines={2}
                      spacing="2"
                      skeletonHeight="4"
                    />
                  </Box>
                  <Box
                    display="flex"
                    gap="10px"
                    w="100%"
                    boxShadow="lg"
                    bg="white"
                    p="20px"
                    borderRadius="lg"
                    alignItems="center"
                  >
                    <SkeletonCircle size="50px" />
                    <SkeletonText
                      flex="1"
                      noOfLines={2}
                      spacing="2"
                      skeletonHeight="4"
                    />
                  </Box>
                  <Box
                    display="flex"
                    gap="10px"
                    w="100%"
                    boxShadow="lg"
                    bg="white"
                    p="20px"
                    borderRadius="10px"
                    alignItems="center"
                  >
                    <SkeletonCircle size="50px" />
                    <SkeletonText
                      flex="1"
                      noOfLines={2}
                      spacing="2"
                      skeletonHeight="4"
                    />
                  </Box>
                </VStack>
              ) : (
                searchResults
                  ?.slice(0, 3)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
