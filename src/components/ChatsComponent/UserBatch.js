import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBatch = ({user, handleFunction}) => {

  return (
    <Box
    p={'2px 5px'}
    borderRadius={'md'}
    m={1}
    cursor={'pointer'}
    color='white'
    background='purple'
    fontSize={15}
    onClick={handleFunction}
    >
        {user?.name}
        <CloseIcon pl={2}/>
    </Box>
  )
}

export default UserBatch