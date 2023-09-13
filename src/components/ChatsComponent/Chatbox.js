import React from 'react'
import { ChatState } from '../../context/chatProviders'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const Chatbox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState();


  return (
    <Box display={{base: selectedChat ? 'flex': 'none', md: 'flex'}}
      alignItems={'center'}
      flexDir={'column'}
      background={'white'}
      width={{base: '100%', md: '70%'}}
      borderRadius={'lg'}
      borderWidth={'2px'}
      p={3}
    >
      <SingleChat fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default Chatbox