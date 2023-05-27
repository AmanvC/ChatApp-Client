import {
  Avatar,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            textAlign="center"
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center">
            <VStack gap="8">
              <Image
                src={
                  user?.picture
                    ? user?.picture
                    : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-0.jpg"
                }
                borderRadius="full"
                boxSize="200px"
                alt={user?.name}
              />
              <Text fontSize="1.5em">{user?.email}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose} boxShadow="xl">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
