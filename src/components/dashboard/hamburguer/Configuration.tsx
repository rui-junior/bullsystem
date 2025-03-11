import { Flex } from "@chakra-ui/react";

export default function Configuration() {
  return (
    <Flex
      w={"100%"}
      h={"auto"}
      align={"center"}
      p={"20px"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={"10px"}
    >
      <Flex w={['95%']} h={['auto']} p={'10px'} rounded={'8px'} bg='#fff'>
        gympass
      </Flex>
    </Flex>
  );
}
