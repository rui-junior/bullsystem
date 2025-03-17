import { Flex, Text, Input, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAuth from "../utils/hook/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "@/firebase/firebase";
import Garbage from "@/components/icons/Garbage";
import FormatDate from "../utils/FormatDate";

export default function Checkins() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<any[]>([]);

  const uid = useAuth();

  useEffect(() => {
    if (!uid) return;

    const saveCheckins = async () => {
      try {
        const ref = collection(database, "admins", uid, "gympass_checkins");
        const docSnap = await getDocs(ref);

        if (docSnap.empty) {
          setCheckins([]);
          return;
        }

        const chackingFilter = docSnap.docs
          .filter((doc) => {
            const docDate = doc.id.split("T")[0].slice(0, 7);
            return docDate === selectedMonth;
          })
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCheckins(chackingFilter);
      } catch (error) {
        console.error("🚨 Erro ao buscar check-ins:", error);
      } finally {
        setLoading(false);
      }
    };

    saveCheckins();
  }, [uid, selectedMonth]);

  function formatCheckinTime(checkinId: string): string {
    const date = new Date(checkinId);
    
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: 'America/Sao_Paulo' 
    };
  
    return date.toLocaleTimeString('pt-BR', options);
  }

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
                {checkins.length}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {checkins.length > 0 ? (
          (() => {
            const [year, month] = selectedMonth.split("-").map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();

            const elements = [];

            for (let i = 1; i <= daysInMonth; i++) {
              // Cria a data do dia atual
              const date = new Date(year, month - 1, i);

              // Obtém o nome do dia da semana
              const dayName = date.toLocaleDateString("pt-BR", {
                weekday: "long",
              });

              // Formata a data como "DD/MM dia-da-semana"
              const formattedDate = `${String(i).padStart(2, "0")}/${String(
                month
              ).padStart(2, "0")} - ${dayName}`;

              // Filtra os check-ins do dia
              const checkinsDoDia = checkins.filter((item) => {
                const checkinDate = new Date(item.id);
                return (
                  checkinDate.getFullYear() === year &&
                  checkinDate.getMonth() + 1 === month &&
                  checkinDate.getDate() === i
                );
              });

              elements.push(
                <>
                  <Flex
                    flexDirection={["column"]}
                    w={["50%"]}
                    gap="2px"
                    key={i}
                  >
                    <Flex h={["auto"]} flexDirection={"row"}>
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
                        {formattedDate}
                      </Flex>
                    </Flex>
                    {checkinsDoDia.length > 0 ? (
                      checkinsDoDia.map((checkin) => (
                        <Flex
                          ml={["25px"]}
                          w={["90%"]}
                          h={"auto"}
                          flexDirection={"row"}
                          key={i}
                        >
                          <Flex w={["6px"]} height={"full"} bg="roxo2">
                            &nbsp;
                          </Flex>
                          <Flex
                            bg="#fff"
                            w={["full"]}
                            h={["40px"]}
                            justifyContent={"space-between"}
                            align={"center"}
                            px={"8px"}
                            rounded={["0 8px 8px 0px"]}
                          >
                            <Flex gap={"20px"} align={"center"}>
                              <Flex gap={"10px"} align={"center"}>
                                <Text
                                  bg="cinza"
                                  px={["5px"]}
                                  h={["20px"]}
                                  align={"center"}
                                  fontSize={"sm"}
                                >
                                  Nome
                                </Text>
                                <Text fontSize={"sm"}>{checkin.nome}</Text>
                              </Flex>
                              <Flex gap={"10px"} align={"center"}>
                                <Text
                                  bg="cinza"
                                  px={["5px"]}
                                  h={["20px"]}
                                  align={"center"}
                                  fontSize={"sm"}
                                >
                                  Validado
                                </Text>
                                <Text fontSize={"sm"}>
                                  {formatCheckinTime(checkin.id)}
                                </Text>
                              </Flex>
                              <Flex gap={"10px"} align={"center"}>
                                <Text
                                  bg="cinza"
                                  px={["5px"]}
                                  h={["20px"]}
                                  align={"center"}
                                  fontSize={"sm"}
                                >
                                  Aula
                                </Text>
                                <Text fontSize={"sm"}>
                                  {checkin.gym_product}
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                        // <div key={checkin.id}>Check-in ID: {checkin.id}</div>
                      ))
                    ) : (
                      <Flex
                        ml={["25px"]}
                        w={["90%"]}
                        h={"auto"}
                        flexDirection={"row"}
                        key={i}
                      >
                        <Flex w={["6px"]} height={"full"} bg="roxo2">
                          &nbsp;
                        </Flex>
                        <Flex
                          bg="#fff"
                          w={["full"]}
                          h={["40px"]}
                          justifyContent={"space-between"}
                          align={"center"}
                          px={"8px"}
                          rounded={["0 8px 8px 0px"]}
                        >
                          <Text fontSize={"sm"}>Nenhum Checkin</Text>
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                </>
              );

            }

            return <>{elements}</>;
          })
          
          ()
        ) : (
          <Text>Nenhum Check-in Encontrado</Text>
        )}
      </Flex>
    </>
  );
}
