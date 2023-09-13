import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProviders";
import UserBatch from "./UserBatch";
import chatApi from "../../api";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setSeletedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [renameloading, setRenameLoading] = useState();
  const [groupUser, setGroupUser] = useState([]);

  const toast = useToast();


  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setLoading(false);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await chatApi.put(
        `api/chats/rename`,
        {
          chatName: groupChatName,
          chatId: selectedChat._id,
        },
        config
      );
      setLoading(false);
      setFetchAgain((prev) => !prev);
      setSelectedChat(data);
      setRenameLoading(false);
      setgroupChatName("");
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(false);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await chatApi.get(`/api/user?search=${search}`, config);
      setSearchResult(data.filter((u) => u._id !== user._id));
      setLoading(false);
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

  const addUserToGroup = async (userToAdd) => {

    if (selectedChat.users.filter((u) => u._id === userToAdd?._id).length > 0) {
      toast({
        title: "User already added",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add somone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      setLoading(true);
      const { data } = await chatApi.put(
        "api/chats/addToGroup",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      toast({
        title: "User added to the group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      if (data) {
        setSelectedChat(data);
        setFetchAgain((prev) => !prev);
      }

      setLoading(false);
    } catch (error) {
      toast({
        title: "Failed to create group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

    }

    setSeletedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = async(userToRemove) => {

    if (user._id !== selectedChat.groupAdmin._id && userToRemove._id !== user?._id) {
        toast({
            title: "Only admin can remove a user",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;
    }

    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          setLoading(true);
          const { data } = await chatApi.put(
            "api/chats/removeFromGroup",
            {
              chatId: selectedChat._id,
              userId: userToRemove._id,
            },
            config
          );

          userToRemove._id === user._id ? setSelectedChat([]) : setSelectedChat(data);
          setFetchAgain((prev)=> !prev);
          fetchMessages();
          setLoading(false);
        
    } catch (error) {
        
    }

  };

  const handleLeaveGropup = async() => {

    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          setLoading(true);
          const { data } = await chatApi.put(
            "api/chats/removeFromGroup",
            {
              chatId: selectedChat._id,
              userId: user._id,
            },
            config
          );

          setSelectedChat([]);
          setFetchAgain((prev)=> !prev);
          setLoading(false);
        
    } catch (error) {
        
    }

  };

  useEffect(() => {
    if (selectedChat) {
      setGroupUser(selectedChat.users);
    }
  }, [selectedChat]);

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<ViewIcon />}
        display={{ base: "flex" }}
      ></IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"1.5rem"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            justifyContent={"center"}
          >
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {groupUser?.map((u) => {
                return (
                  <Box>
                    <UserBatch
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemoveUser(u)}
                    />
                  </Box>
                );
              })}
            </Box>

            <FormControl display={"flex"} mt={2}>
              <Input
                placeholder="enter chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
                onClick={(e) => setgroupChatName(e.target.value)}
              ></Input>
              <Button
                variant={"solid"}
                colorScheme="teal"
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="add users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {loading ? (
              <>
                <Spinner size={"lg"} />
              </>
            ) : (
              searchResult.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => addUserToGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleLeaveGropup} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
