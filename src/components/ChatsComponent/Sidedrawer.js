import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Tooltip,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProviders";
import ProfileModal from "../Profile/ProfileModal";
import { Effect } from 'react-notification-badge'

import { useNavigate } from "react-router-dom";
import chatApi from "../../api";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import getSender from "../../Logics/getChatSender";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const Sidedrawer = () => {
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const { user, chats, setChats, selectedChats, setSelectedChat ,notification , setNotification } = ChatState();

  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    setLoading(true);
    if (!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await chatApi.get(`api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Searching Error",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await chatApi.post(
        "api/chats",
        {
          userId,
        },
        config
      );

      if(!chats.find((c)=>c._id === data._id))
      {
        setChats([...data, chats]);
      }

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error in fetching chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        width={"100%"}
        p={"1rem 0.5rem"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} ml={1}>Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"sans-serif"} color={'#b33939'}>
          Beslee Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chatId);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif?.chatId?.isGroupChat
                    ? `New Message in ${notif.chatId.chatName}`
                    : `New Message from ${getSender(user, notif.chatId.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer onClose={onClose} isOpen={isOpen} placement="left">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>Search</DrawerHeader>
            <DrawerBody>
              <Box display={"flex"} pb={"1rem"}>
                <Input
                  placeholder="search by email or name"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                ></Input>
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              <Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResults &&
                  searchResults.length > 0 &&
                  searchResults.map((user) => {
                    return (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      ></UserListItem>
                    );
                  })
                )}
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Sidedrawer;
