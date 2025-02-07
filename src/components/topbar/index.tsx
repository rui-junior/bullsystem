import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
} from "@chakra-ui/react";

import RightSide from "./RightSide";
// import "../../styles/Colors.module.css";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";

interface ChildProps {
  sendDataToParent: (data: string) => void; // Função para passar dados para o pai
}

const TopBar = ({ sendDataToParent }: ChildProps) => {
  const router = useRouter();

  // ** caso queira abrir a page no corpo da index
  // const handleClick = () => {
  //   // Passando dados para o componente pai ao clicar no botão
  //   sendDataToParent("LoginPage");
  // };




  return (
    <>
      <Flex
        // style={{ backgroundColor: "var(--cinza)" }}
        w={"100vw"}
        h={"55px"}
        justifyContent={"flex-start"}
        align={"center"}
        flexDirection={"row"}
        wrap={"nowrap"}
      >
        <Flex
          // bg="blue"
          h={"100%"}
          width={[
            "100%", // 0-30em
            "50%", // 30em-48em
            "25%", // 48em-62em
            "80%", // 62em+
          ]}
          align={"center"}
          justifyContent={"center"}
        >
          topbar
        </Flex>
        <Flex
          // bg="yellow"
          h={"100%"}
          width={[
            "100%", // 0-30em
            "50%", // 30em-48em
            "25%", // 48em-62em
            "20%", // 62em+
          ]}
          align={"center"}
          justifyContent={"center"}
        >
          <Flex
            flexDirection={"row"}
            justifyContent={"center"}
            align={"center"}
          >
            <Link href={"/login"}>Minha Conta</Link>
            {/* <Flex onClick={handleClick}>Minha Conta</Flex> */}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default TopBar;
