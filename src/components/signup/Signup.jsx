import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { makeRequest } from "../../utils/axios";
import validator from "validator";

const Signup = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedPicture, setUploadedPicture] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false);

  const toast = useToast();

  const isPasswordSame = inputs.password === inputs.confirmPassword;

  const handleChangeInput = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async () => {
    try {
      if (
        uploadedPicture.type === "image/jpeg" ||
        uploadedPicture.type === "image/jpg" ||
        uploadedPicture.type === "image/png"
      ) {
        const formData = new FormData();
        formData.append("file", uploadedPicture);
        formData.append("upload_preset", "chat-app");
        formData.append("cloud_name", "dynbccy6c");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dynbccy6c/image/upload",
          formData
        );
        return res.data.url;
      } else {
        toast({
          title: "Invalid Image Type!",
          description: "Please upload only .jpeg, .jpg, .png image !",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        return null;
      }
    } catch (err) {
      toast({
        title: "Something went wrong!",
        description: "Image could not be uploaded, please try again!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return null;
    }
  };

  const isFormValid = () => {
    if (
      !inputs.name ||
      !inputs.email ||
      !passwordValid ||
      !inputs.confirmPassword ||
      inputs.password !== inputs.confirmPassword
    ) {
      return false;
    }
    return true;
  };

  const validatePassword = (e) => {
    const passwordValidity = validator.isStrongPassword(e.target.value);
    setPasswordValid(passwordValidity);
    setInputs((prev) => ({ ...prev, password: e.target.value }));
    if (e.target.value === "") {
      setPasswordValid(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let picture;
      if (uploadedPicture) {
        picture = await handleFileUpload();
        if (!picture) {
          setLoading(false);
          return;
        }
      }
      await makeRequest().post("/auth/signup", {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        picture,
      });
      setLoading(false);
      toast({
        title: "User created successfully.",
        description: "Please login to continue.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setInputs({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        picture: "",
      });
      setUploadedPicture(null);
    } catch (err) {
      setLoading(false);
      toast({
        title: "User cannot be created!",
        description: `${
          err.response.data.message || "Something went wrong, please try again!"
        }`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <VStack spacing="20px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={handleChangeInput}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChangeInput}
        />
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            onChange={validatePassword}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {!passwordValid && (
          <FormHelperText style={{ textAlign: "justify", color: "#E93E3E" }}>
            Atleast one uppercase, lowercase, special symbol, number, and
            minimum 8 characters long.
          </FormHelperText>
        )}
      </FormControl>
      <FormControl isRequired isInvalid={!isPasswordSame}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChangeInput}
        />

        {!isPasswordSame ? (
          <FormErrorMessage>Passwords should match!</FormErrorMessage>
        ) : null}
      </FormControl>
      <VStack w="100%" d="flex" alignItems="flex-start">
        <FormControl>
          <FormLabel textDecoration="underline" cursor="pointer">
            Upload picture
          </FormLabel>
          <Input
            type="file"
            p="1.5"
            display="none"
            accept="image/*"
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => setUploadedPicture(e.target.files[0])}
          />
        </FormControl>
        {uploadedPicture && (
          <HStack>
            <Image
              borderRadius="full"
              boxSize="80px"
              objectFit="cover"
              src={URL.createObjectURL(uploadedPicture)}
            />
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => setUploadedPicture(null)}
            >
              Delete
            </Button>
          </HStack>
        )}
      </VStack>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 30 }}
        isLoading={loading}
        loadingText="Signing Up"
        onClick={handleSubmit}
        isDisabled={!isFormValid()}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
