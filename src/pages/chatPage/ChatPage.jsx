import { useState } from "react";
import "./chatPage.scss";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../../components/sideDrawer/SideDrawer";
import MyChats from "../../components/myChats/MyChats";
import ChatBox from "../../components/chatBox/ChatBox";

const ChatPage = () => {
  const [allChats, setAllChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="chatPage">
      <SideDrawer setAllChats={setAllChats} allChats={allChats} />
      <Box display="flex" h="90vh" p="10px" gap="20px">
        {/* <Box w="100%" display="flex" gap="20px"> */}
        <MyChats
          setAllChats={setAllChats}
          allChats={allChats}
          fetchAgain={fetchAgain}
        />
        <ChatBox
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          // flex="1"
        />
        {/* </Box> */}
      </Box>
    </div>
  );
};

export default ChatPage;
