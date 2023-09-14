import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import chatApi from "../../api";

import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate  = useNavigate();

  const toast = useToast();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the field",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      try {
        const { data } = await chatApi.post(
          "/api/user/login",
          {
            email,
            password,
          },
          config
        );

        toast({
          title: "Login successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/chats')
      } catch (error) {
        console.log("Error in Login", error);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="enter your email id"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          ></Input>
          <InputRightElement width={"4rem"}>
            <Button onClick={toggleShowPassword}>
              {showPassword ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        mt={"1rem"}
        onClick={handleLogin}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        variant={"solid"}
        width={"100%"}
        mt={"1rem"}
        onClick={() => {
          setEmail("guestuser@gmail.com");
          setPassword("123456778");
          handleLogin()
        }}
      >
        Login as Guest
      </Button>
    </VStack>
  );
};

export default Login;
