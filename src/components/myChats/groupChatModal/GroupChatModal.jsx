import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { makeRequest } from "../../../utils/axios";
import UserListItem from "../../sideDrawer/userListItem/UserListItem";
import UserBadgeItem from "./userBadgeItem/UserBadgeItem";

const GroupChatModal = ({ children, allChats, setAllChats }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const { currentUser, setSelectedChat } = useContext(AuthContext);
  const groupNameRef = useRef();

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCloseModal = () => {
    setSearchUser("");
    setGroupChatName("");
    setSelectedUsers([]);
    setSearchResults([]);
    onClose();
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

  const handleSelectUser = (user) => {
    for (const u of selectedUsers) {
      if (JSON.stringify(u) === JSON.stringify(user)) {
        toast({
          title: `${user?.name} is already selected!`,
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        return;
      }
    }
    setSelectedUsers([...selectedUsers, user]);
    setSearchUser("");
    setSearchResults([]);
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const handleSubmit = async () => {
    try {
      setFormSubmitLoading(true);
      const res = await makeRequest().post("/chats/create-group", {
        chatName: groupChatName,
        users: selectedUsers.map((user) => user._id),
      });
      setFormSubmitLoading(false);
      toast({
        title: res.data?.message || "Something went wrong!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setAllChats([res.data?.data, ...allChats]);
      setSelectedChat(res.data?.data);
      onClose();
    } catch (err) {
      setFormSubmitLoading(false);
      toast({
        title: "Something went wrong!",
        description: "Group could not be created!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal
        initialFocusRef={groupNameRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="2em"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton onClick={handleCloseModal} />
          <ModalBody>
            <Box display="flex" flexDir="column" alignItems="center" gap="4">
              <FormControl isRequired>
                <FormLabel userSelect="none">Enter Group Chat Name</FormLabel>
                <Input
                  ref={groupNameRef}
                  type="text"
                  placeholder="Group Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  userSelect="none"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel userSelect="none">Select Users</FormLabel>

                <Input
                  type="text"
                  placeholder="Select atleast 2 users"
                  value={searchUser}
                  userSelect="none"
                  onChange={handleSearchUser}
                />
              </FormControl>
            </Box>

            <Box display="flex" gap="5px" flexWrap="wrap" w="100%" mt="4">
              {selectedUsers.map((user) => (
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
                      handleFunction={() => handleSelectUser(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
              isDisabled={
                !groupChatName || selectedUsers?.length < 2 || formSubmitLoading
              }
            >
              {!formSubmitLoading ? "Create Group" : "Creating Group..."}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
