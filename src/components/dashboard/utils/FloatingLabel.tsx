import { useState } from "react";
import { FormControl, FormLabel, Input, Flex, Text } from "@chakra-ui/react";
import InputMask from "react-input-mask";

interface FloatingLabelInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: string;
  disabled?: boolean;
  list?: string;
  w?: string;
  h?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  mask,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl w="full" position="relative">
      {/* Label flutuante */}
      <FormLabel
        position="absolute"
        top={isFocused || value ? "-6px" : "50%"}
        left="12px"
        transform={
          isFocused || value ? "scale(0.9) translateY(0)" : "translateY(-50%)"
        }
        transformOrigin="left top"
        fontSize={isFocused || value ? "12px" : "16px"}
        transition="all 0.2s ease-out"
        bg="cinza"
        px={1}
      >
        <Text color={disabled ? "gray.400" : "black"}>{label}</Text>
      </FormLabel>

      {/* Input com ou sem máscara */}

      {mask ? (
        <Flex
          h={"45px"}
          align={"center"}
          bg="cinza"
          justifyContent={"space-between"}
          {...props}
        >
          <Flex w={["6px"]} h={"100%"} bg="roxo1">
            &nbsp;
          </Flex>
          <Flex
            justifyContent={"center"}
            align={"center"}
            gap={"15px"}
            w={"full"}
          >
            <Input
              as={InputMask}
              mask={mask}
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              bg="transparent"
              _focus={{ outline: "none", boxShadow: "none" }}
              border="none"
              type={type}
              {...props}
            />
          </Flex>
        </Flex>
      ) : (
        <Flex
          h={"45px"}
          // w={["90%"]}
          align={"center"}
          bg="cinza"
        >
          <Flex w={["6px"]} h={"100%"} bg="roxo1">
            &nbsp;
          </Flex>
          <Flex
            justifyContent={"center"}
            align={"center"}
            w={"full"}
            h={"full"}
          >
            <Input
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              bg="transparent"
              _focus={{ outline: "none", boxShadow: "none" }}
              border="none"
              type={type}
              {...props}
            />
          </Flex>
        </Flex>
      )}
    </FormControl>
  );
};

export default FloatingLabelInput;
