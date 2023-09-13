import React, { useEffect } from "react";
import {useNavigate} from 'react-router-dom'

import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo)
    {
      navigate('/chats');
    }
  }, [navigate])


  
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w={"100%"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        margin={"5px auto"}
        textAlign={"center"}
      >
        <Text fontSize={"2xl"} color={"black"}>
          Bislee Chat
        </Text>
      </Box>
      <Box
        w={"100%"}
        bg={"white"}
        p={"5px"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded" colorScheme="blue" textColor={'black'}>
          <TabList mb={'1rem'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
