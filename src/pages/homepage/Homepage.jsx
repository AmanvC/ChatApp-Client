import Login from "../../components/login/Login";
import Signup from "../../components/signup/Signup";
import "./homepage.scss";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

const Homepage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p="3"
        bg="white"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        w="100%"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          fontWeight="600"
          textAlign="center"
        >
          AV Chat App
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p="4"
        borderRadius="lg"
        borderWidth="1px"
        mb="40px"
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="cyan">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
