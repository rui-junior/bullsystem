import { Flex, Text, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function Receita() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  return (
    <>
      <Flex
        w="100%"
        h="auto"
        align="center"
        p="20px"
        flexDirection="column"
        alignItems="flex-start"
        gap="10px"
      >
        <Flex bg="white" align="center" gap="15px" px="25px" py="10px">
          <Text bg="cinza" px="15px" h="25px">
            Mês
          </Text>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            maxW="200px"
            variant="escolha"
          />
        </Flex>
      </Flex>
    </>
  );
}
