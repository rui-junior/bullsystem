import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

import Backward from "../icons/Backward";
import Class from "../icons/Class";
import Time from "../icons/Time";
import Student from "../icons/Student";

import Classes from "./wellhub/Classes";
import Slots from "./wellhub/Slots";
import Students from "./control/Students";

export default function Dashboard({
  onMenuClick,
}: {
  onMenuClick: (component: JSX.Element) => void;
}) {
  const menu = [
    {
      title: "Gympass",
      submenu: [
        { title: "Aulas", link: Classes, icon: Class },
        { title: "Horários", link: Slots, icon: Time },
        { title: "Horários", link: "", icon: Backward },
      ],
    },
    {
      title: "Controle",
      submenu: [
        { title: "Alunos", link: Students, icon: Student },
        {
          title: "Receita",
          link: "",
          icon: Backward,
        },
        {
          title: "Despesa",
          link: "",
          icon: Backward,
        },
      ],
    },
  ];

  return (

      <Flex
        bg="#fff"
        h={["100vh"]}
        w={["380px"]}
        flexDirection={"column"}
        align={"center"}
        pt="50px"
        gap={"10px"}
      >
        {menu.map((item, index) => (
          <Flex
            w={"90%"}
            h={"auto"}
            p={"10px"}
            flexDirection={"column"}
            gap={"5px"}
            // bg="red"
          >
            <Flex w={"100%"} py={"5px"}>
              <Text color={"black"}>{item.title}</Text>
            </Flex>

            {item.submenu && (
              <Flex
                w={"100%"}
                h={"auto"}
                wrap={"wrap"}
                rowGap={"5px"}
                columnGap={"5px"}
              >
                {item.submenu.map((subItem, subIndex) => (
                  <Flex
                    bg="cinza"
                    rounded={"4px"}
                    w={["85px"]}
                    h={"99px"}
                    justifyContent={"center"}
                    align={"center"}
                    flexDirection={"column"}
                    cursor={"pointer"}
                    onClick={() =>
                      onMenuClick(React.createElement(subItem.link))
                    }
                  >
                    <Flex w={"30%"} h={"30%"}>
                      {React.createElement(subItem.icon)}
                    </Flex>
                    <Text fontSize={["sm"]}>{subItem.title}</Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>

  );
}

