import { Flex, Text, Input, Button } from "@chakra-ui/react";

export default function Horarios() {
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
        <Button
          my="8px"
          variant="buttonFundoBranco"
          //   onClick={onOpenNewPlan}
          transition="ease-in-out"
        >
          Add Horário
        </Button>
        {/* <Flex bg="white" align="center" gap="15px" px="25px" py="10px">
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
                    </Flex> */}
      </Flex>
    </>
  );
}
