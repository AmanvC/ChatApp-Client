import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  VStack,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfileModal from "./profileModal/ProfileModal";
import { makeRequest } from "../../utils/axios";
import UserListItem from "./userListItem/UserListItem";
import { NO_USER_IMAGE } from "../../utils/constants";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { getSenderName } from "../../config/ChatLogic";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const SideDrawer = ({ setAllChats, allChats }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchResultLoading, setSeachResultLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const {
    currentUser,
    logout,
    setSelectedChat,
    notification,
    setNotification,
  } = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearchUser = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length < 2) {
      setSearchResult(null);
      return;
    }
    setSeachResultLoading(true);
    try {
      const res = await makeRequest().get(`/users?search=${e.target.value}`);
      setSearchResult(res.data);
      setSeachResultLoading(false);
    } catch (err) {
      setSeachResultLoading(false);
      toast({
        title: "Something went wrong",
        desciption: err.response?.error?.message || "Error in search the user.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setChatLoading(true);
      const res = await makeRequest().post("/chats/create", { userId });
      if (!allChats.find((c) => c._id === res.data?.data[0]?._id)) {
        setAllChats([res.data?.data[0], ...allChats]);
      }
      setChatLoading(false);
      setSelectedChat(res.data.data[0]);
      onClose();
      setSearchResult(null);
      setSearch("");
    } catch (err) {
      setChatLoading(false);
      toast({
        title: "Something went wrong",
        desciption:
          err.response?.error?.message || "Error in fetching the chat.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        p="15px"
        boxShadow="1px 0px 15px black"
        color="black"
        fontFamily="Work sans"
      >
        <Button variant="outline" colorScheme="teal" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass" />
          <Text display={{ base: "none", md: "block" }} px="2">
            Search User
          </Text>
        </Button>
        <Text fontSize="4xl" fontWeight="600">
          Chat-App
        </Text>
        <Box>
          <Menu>
            <MenuButton>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="3xl" margin="0px 5px" />
            </MenuButton>
            <MenuList textAlign="center" fontWeight="600" boxShadow="lg">
              {notification.length === 0
                ? "No new messages."
                : notification.map((notif) => (
                    <MenuItem
                      fontWeight="600"
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSenderName(
                            currentUser,
                            notif.chat.users
                          )}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              backgroundColor="transparent"
              // _hover={{ bg: "gray.100" }}
              p="30px 15px"
            >
              <Avatar
                size="md"
                cursor="pointer"
                src={
                  currentUser?.picture ? currentUser?.picture : NO_USER_IMAGE
                }
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={currentUser}>
                <MenuItem fontWeight="900">{currentUser?.name}</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem fontWeight="900" onClick={() => logout()}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px" mb="20px">
            Search by Username or Email
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" mb="6" gap="10px">
              <Input
                placeholder="Start Typing..."
                value={search}
                onChange={handleSearchUser}
              />
            </Box>
            {searchResultLoading ? (
              <VStack mt="20px">
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
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {chatLoading && <LoadingSpinner />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
