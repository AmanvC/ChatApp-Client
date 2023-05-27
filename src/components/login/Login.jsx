import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await login(inputs.email, inputs.password);
    setLoading(false);
  };

  return (
    <VStack spacing="20px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChangeInput}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            onChange={handleChangeInput}
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
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 30 }}
        isLoading={loading}
        loadingText="Logging In"
        onClick={handleSubmit}
      >
        Log In
      </Button>
    </VStack>
  );
};

export default Login;
