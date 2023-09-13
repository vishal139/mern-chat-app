import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProviders";
import Sidedrawer from "../components/ChatsComponent/Sidedrawer";
import Mychats from "../components/ChatsComponent/Mychats";
import Chatbox from "../components/ChatsComponent/Chatbox";

import { Box } from "@chakra-ui/react";
import chatApi from "../api";
const Chat = () => {
  const { user, setChats } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)


  const fetchAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await chatApi.get("api/chats", config);
      setChats(data);
    } catch (error) {
    }
  };

  useEffect(() => {
    if(user)
    {
      fetchAllChats();
    }
  }, [user]);


  return (
    <div style={{ width: "100%" }}>
      {user && <Sidedrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"90vh"}
        p={'1rem'}
      >
        {user && <Mychats fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <Chatbox fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};

export default Chat;
