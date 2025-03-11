import { Flex, Text, Input, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAuth from "../utils/hook/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "@/firebase/firebase";
import Garbage from "@/components/icons/Garbage";
import FormatDate from "../utils/FormatDate";

export default function Checkins() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [monthlyCheckinCount, setMonthlyCheckinCount] = useState<number>(0);

  const uid = useAuth();

  // useEffect(() => {
  //   if (!uid) return;

  //   const saveCheckins = async () => {
  //     try {
  //       const ref = collection(database, "admins", uid, "gympass_checkins");
  //       const docSnap = await getDocs(ref);

  //       if (docSnap.empty) {
  //         setCheckins([]);
  //         return;
  //       }

  //       const logsArray = docSnap.docs
  //         .filter((doc) => {
  //           const docDate = doc.id.split("T")[0];
  //           return docDate === selectedDay;
  //         })
  //         .map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));

  //       setCheckins(logsArray);
  //     } catch (error) {
  //       console.error("🚨 Erro ao buscar check-ins:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   saveCheckins();
  // }, [uid, selectedDay]);

  useEffect(() => {
    if (!uid) return;

    setMonthlyCheckinCount(0);

    const saveCheckins = async () => {
      try {
        const ref = collection(database, "admins", uid, "gympass_checkins");
        const docSnap = await getDocs(ref);

        if (docSnap.empty) {
          setCheckins([]);
          return;
        }

        const logsArray = docSnap.docs
          .filter((doc) => {
            const docDate = doc.id.split("T")[0];
            return docDate === selectedDay;
          })
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        // soma quantos checkins no mes
        docSnap.docs.filter((doc) => {
          const docDate = doc.id.split("T")[0];
          const docMonth = docDate.split("-")[1];
          if (docMonth == String(today.getMonth() + 1).padStart(2, "0")) {
            setMonthlyCheckinCount((prev) => prev + 1);
          }
        });

        setCheckins(logsArray);
      } catch (error) {
        console.error("🚨 Erro ao buscar check-ins:", error);
      } finally {
        setLoading(false);
      }
    };

    saveCheckins();
  }, [uid, selectedDay]);

  if (loading)
    return (
      <Flex w="100%" p="20px" flexDirection="column" alignItems="flex-start">
        <Text fontSize="md" fontWeight="medium">
          Carregando...
        </Text>
      </Flex>
    );

  return (
    <>
      <Flex
        w={"100%"}
        h={["auto"]}
        align={"center"}
        p={"20px"}
        flexDirection={"column"}
        alignItems={"flex-start"}
        gap={"10px"}
      >
        <Flex
          w={["auto"]}
          h={["auto"]}
          bg="white"
          align={"center"}
          gap={"15px"}
          px={"25px"}
          py={"10px"}
        >
          <Text bg="cinza" px={["15px"]} h={["25px"]} align={"center"}>
            Dia
          </Text>
          <Input
            type="date"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            maxW="200px"
            variant={"escolha"}
          />
        </Flex>

        <Flex>
          <Flex
            w={["250px"]}
            h={["120px"]}
            rounded={"8px"}
            m={["15px"]}
            bg="roxo1"
          >
            <Flex w={["50%"]} h={["100%"]} align={["center"]} p={"5px"}>
              <Text fontSize={["18px"]} textAlign={"center"} color="#fff">
                Checkins no Dia
              </Text>
            </Flex>
            <Flex
              w={["50%"]}
              h={["100%"]}
              align={["center"]}
              justifyContent={"center"}
            >
              <Text fontSize={["32px"]} textAlign={"center"} color="#fff">
                {checkins.length}
              </Text>
            </Flex>
          </Flex>

          <Flex
            w={["250px"]}
            h={["120px"]}
            rounded={"8px"}
            m={["15px"]}
            bg="roxo1"
          >
            <Flex w={["50%"]} h={["100%"]} align={["center"]} p={"5px"}>
              <Text fontSize={["18px"]} textAlign={"center"} color="#fff">
                Checkins no Mês
              </Text>
            </Flex>
            <Flex
              w={["50%"]}
              h={["100%"]}
              align={["center"]}
              justifyContent={"center"}
            >
              <Text fontSize={["32px"]} textAlign={"center"} color="#fff">
                {monthlyCheckinCount}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {checkins.length > 0 ? (
          checkins.map((item, index) => (
            <Flex key={item.id} h="auto" flexDirection="row" bg="#fff" w="60%">
              <Flex w="6px" height="full" bg="roxo1">
                &nbsp;
              </Flex>
              <Flex
                bg="#fff"
                w="full"
                h="45px"
                justifyContent="space-between"
                align="center"
                px="8px"
              >
                <Flex gap="10px">
                  <Text bg="cinza" px="5px" h="25px">
                    {index + 1}
                  </Text>
                  <Text>{item.nome}</Text>
                </Flex>
                <Flex gap="10px">
                  <Text bg="cinza" px="5px" h="25px">
                    Data
                  </Text>
                  <Text>
                    <FormatDate isoString={item.id} />
                  </Text>
                </Flex>
                <Flex gap="10px">
                  <Text bg="cinza" px="5px" h="25px">
                    Gympass
                  </Text>
                  <Text>{item.gympass_id}</Text>
                </Flex>
                <Box bg="cinza" px="5px" cursor="pointer">
                  <Garbage w={20} h={20} />
                </Box>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text>Nenhum Checkin Encontrado</Text>
        )}
      </Flex>
    </>
  );
}
