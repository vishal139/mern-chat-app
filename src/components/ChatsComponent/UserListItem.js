import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg={"#E8E8E8"}
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w={"100%"}
      display={"flex"}
      alignItems={"center"}
      color={"black"}
      p={"0.5rem"}
      borderRadius={"lg"}
      m={'0.8rem 0rem'}
    >
      <Avatar
        mr={"2px"}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.image}
      ></Avatar>

      <Box mr={'1rem'} >
        <Text>{user.name}</Text>
        <Text fontSize={'xs'}>
            <b>Email :</b>
            {
                user.email
            }
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
