import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Text,
  } from "@chakra-ui/react";
  
  import { useEffect, useRef, useState } from "react";
  
  export default function RegisterPage() {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
  
    return (
      <Flex
        //   bg={"red"}
        w={["100vw"]}
        h={"100vh"}
        justifyContent={"center"}
        align={"center"}
      >
        <Flex
          // bg="blue"
          position={"absolute"}
          top={"10px"}
          left={"10px"}
          w={["150px"]}
        >
          <Link href="/">retorna</Link>
        </Flex>
        <Flex
          // bg="blue"
          w={["550px"]}
          h={["550px"]}
          justifyContent={"center"}
          align={"center"}
          flexDirection={"column"}
        >
          <Text fontSize="4xl" letterSpacing={"0.6rem"}>
            Cadastro
          </Text>
          <Text fontSize="1xl">Complete os itens a seguir:</Text>
  
          <Flex
            mt="35px"
            w={"100%"}
            justifyContent={"center"}
            align={"center"}
            flexDirection={"column"}
            //   bg="red"
          >
            <Input
              type="text"
              placeholder="Nome"
              w={["350px"]}
              bg="white"
              color="black"
              borderColor="gray.300"
              borderWidth="1px" // Borda mais fina
              fontSize="sm" // Tamanho da letra menor
              _focus={{
                borderColor: "black", // Muda a cor da borda para preta ao focar
                boxShadow: "0 0 0 1px black", // Adiciona uma sombra de borda preta
              }}
              _hover={{
                borderColor: "gray.500", // Quando o mouse passa sobre o campo
              }}
              size="lg" // Tamanho do input
              borderRadius="md" // Bordas arredondadas
              p={4} // Padding do input
            />
          </Flex>
          <Flex
            mt="15px"
            w={"100%"}
            justifyContent={"center"}
            align={"center"}
            flexDirection={"column"}
            //   bg="red"
          >
            <Input
              type="text"
              placeholder="CPF"
              w={["350px"]}
              bg="white"
              color="black"
              borderColor="gray.300"
              borderWidth="1px" // Borda mais fina
              fontSize="sm" // Tamanho da letra menor
              _focus={{
                borderColor: "black", // Muda a cor da borda para preta ao focar
                boxShadow: "0 0 0 1px black", // Adiciona uma sombra de borda preta
              }}
              _hover={{
                borderColor: "gray.500", // Quando o mouse passa sobre o campo
              }}
              size="lg" // Tamanho do input
              borderRadius="md" // Bordas arredondadas
              p={4} // Padding do input
            />
          </Flex>
          <Flex
            mt="15px"
            w={"100%"}
            justifyContent={"center"}
            align={"center"}
            flexDirection={"column"}
            //   bg="red"
          >
            <Input
              type="email"
              placeholder="Email"
              w={["350px"]}
              bg="white"
              color="black"
              borderColor="gray.300"
              borderWidth="1px" // Borda mais fina
              fontSize="sm" // Tamanho da letra menor
              _focus={{
                borderColor: "black", // Muda a cor da borda para preta ao focar
                boxShadow: "0 0 0 1px black", // Adiciona uma sombra de borda preta
              }}
              _hover={{
                borderColor: "gray.500", // Quando o mouse passa sobre o campo
              }}
              size="lg" // Tamanho do input
              borderRadius="md" // Bordas arredondadas
              p={4} // Padding do input
            />
          </Flex>
          <Flex
            mt="15px"
            w={"100%"}
            justifyContent={"center"}
            align={"center"}
            flexDirection={"column"}
            //   bg="red"
          >
            <InputGroup w="350px">
              {/* Definindo a largura do input */}
              <Input
                type="password"
                placeholder="Senha"
                bg="white"
                color="black"
                borderColor="gray.300"
                borderWidth="1px" // Borda fina
                fontSize="sm" // Tamanho da letra menor
                _focus={{
                  borderColor: "black", // Muda a cor da borda para preta ao focar
                  boxShadow: "0 0 0 1px black", // Adiciona uma sombra de borda preta
                }}
                _hover={{
                  borderColor: "gray.500", // Quando o mouse passa sobre o campo
                }}
                size="lg" // Tamanho do input
                borderRadius="md" // Bordas arredondadas
                p={4} // Padding do input
              />
            </InputGroup>
          </Flex>
          <Flex mt="20px">
            <Button
              className="relative text-white overflow-hidden group"
              w={"350px"}
              h={"50px"}
              // style={{ background: "var(--roxo1)" }}
              bg='roxo1'
              color={"white"}
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                Cadastrar
              </span>
  
              {/* Pseudo-elemento para o efeito de cortina */}
              <span
                // style={{ background: "var(--cinza" }}
                // bg='cinza'
                className="absolute inset-0 block w-full h-full bg-white transform scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300 ease-out"
              ></span>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
  