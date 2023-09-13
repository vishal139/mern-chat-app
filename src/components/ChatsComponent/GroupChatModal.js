import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProviders";
import chatApi from "../../api";
import UserListItem from "./UserListItem";
import UserBatch from "./UserBatch";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setSeletedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();

  const { user, setUser, chats, selectedChat, setChats, setSelectedChat } =
    ChatState();

  const toast = useToast();

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
      setLoading(false);
      setSearchResult(data);

      setSearchResult(
        data.filter((u) => u._id !== user._id)
      );

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

  const handleSubmit = async () => {
    if (groupChatName.trim() === "" || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the field",
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
      const { data } = await chatApi.post(
        "api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([...chats, data]);
      toast({
        title: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Failed to create group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }

    onClose();
    setgroupChatName('');
    setSeletedUsers([]);
  };
  const addUserToGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
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

    setSeletedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToRemove) => {
    setSeletedUsers(
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"1.5rem"}
            display={"flex"}
            justifyContent={"center"}
          >
            Creat Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            justifyContent={"center"}
          >
            <FormControl>
              <Input
                placeholder="enter chat name"
                mb={3}
                value={groupChatName}
                onChange={(e)=>setgroupChatName(e.target.value)}
                onClick={(e) => setgroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="add users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>

            <Box display={"flex"} w={"100%"} flexWrap={"wrap"}>
              {selectedUsers.map((user) => {
                return (
                  <UserBatch
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  ></UserBatch>
                );
              })}
            </Box>
            {loading ? (
              <div>loading...</div>
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
