import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/chatProviders";
import chatApi from "../../api";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import getSender from "../../Logics/getChatSender";
import GroupChatModal from "./GroupChatModal";

const Mychats = ({ fetchAgain }) => {
  const toast = useToast();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await chatApi.get("api/chats", config);
      console.log(data, "this is the data");
      setChats(data);
    } catch (error) {
      toast({
        title: "Error in loading chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchAllChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={1}
        bg={"white"}
        borderRadius={"lg"}
        borderWidth={"2px"}
        width={{ base: "100%", md: "30%" }}
      >
        <Box
          fontSize={{ base: "20px", md: "20px" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          w={"100%"}
          pb={3}
          paddingX={3}
        >
          My Chats
          <GroupChatModal>
            <Button
              display={"flex"}
              fontSize={{ base: "17px", md: "10px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>

        <Box
          display={"flex"}
          flexDir={"column"}
          p={"100%"}
          w={"100%"}
          h={"100%"}
          padding={3}
          bg={"#F8F8F8"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) => {
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor={"pointer"}
                    bg={selectedChat !== chat ? "#E8E8E8" : "#38B2AC"}
                    color={selectedChat !== chat ? "black" : "white"}
                    p={"2px 4px"}
                    borderRadius={"lg"}
                    key={`chat._id` + Math.random() * 10}
                  >
                    <Text p={1}>
                      {!selectedChat?.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {/* <Text p={1}>
                      {!selectedChat?.isGroupChat &&
                      selectedChat?.user &&
                      selectedChat?.user?.length > 1
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text> */}
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Mychats;
