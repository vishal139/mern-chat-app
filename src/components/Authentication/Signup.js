import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import chatApi from "../../api";
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


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState(null);
  const toast = useToast();

  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const postImage = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    console.log({ pics, type: pics.type });

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnyzoqqtz");

      fetch("https://api.cloudinary.com/v1_1/dnyzoqqtz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the field",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
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
          '/api/user',
          {
            name,
            email,
            password,
            image: pic,
          },
          config,
        );


        
      toast({
        title: "Registration successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
     
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chats')

    
      } catch (error) {
        console.log('Error in regitration', error);
      }

      setLoading(false);
    } catch (err) {

      console.log(err);
    }
  };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        ></Input>
      </FormControl>
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
      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="enter password"
            onChange={(e) => {
              setconfirmPassword(e.target.value);
            }}
            value={confirmPassword}
          ></Input>
          <InputRightElement width={"4rem"}>
            <Button onClick={toggleShowPassword}>
              {showPassword ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          onChange={(e) => {
            console.log(e.target.files[0], "this is the value");
            postImage(e.target.files[0]);
          }}
          accept="image/*"
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        mt={"1rem"}
        isLoading={loading}
        onClick={handleSignup}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
