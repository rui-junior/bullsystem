import { Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAuth from "../utils/hook/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "@/firebase/firebase";

export default function Booking() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState("");
  const uid = useAuth();

  useEffect(() => {
    const getBookings = async () => {
      try {
        const collectioBooking = collection(
          database,
          "admins",
          `${uid}`,
          "gympass_bookings"
        );

        const querySnapshot = await getDocs(collectioBooking);

        const filteredBookings = [];

        for (const doc of querySnapshot.docs) {
          if (doc.id.split("T")[0] === selectedDay.split("T")[0]) {
            filteredBookings.push(doc.data());
          }
        }

        setBookings(filteredBookings);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };

    getBookings();
  }, [uid, selectedDay]);

  if (loading)
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
        <Text fontSize={"md"} fontWeight={"medium"}>
          Carregando...
        </Text>
      </Flex>
    );

  return (
    <Flex
      w={"100%"}
      h={"auto"}
      align={"center"}
      p={"20px"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      gap={"15px"}
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

      <Flex w={["90%"]} h={["auto"]} gap={"8px"} flexDirection={"column"}>
        {bookings.length > 0 ? (
          // bookings.map((item) =>
            [...Array(16)].map((_, index) => {
              const hour = index + 6; // Define o horário de 6 a 21

              // if (hour == item.occur_date.split("T")[1].split(":")[0]) {
                return (
                  <Flex h="auto" flexDirection="row">
                    <Flex
                      w="50px"
                      height="full"
                      bg="roxo1"
                      align="center"
                      justifyContent={'center'}
                    >
                      <Text fontWeight="semibold" color="#fff">
                        {hour}h
                      </Text>
                    </Flex>

                    <Flex
                      bg="#fff"
                      w="full"
                      minH={['45px']}
                      h="auto"
                      gap={['8px']}
                      wrap={'wrap'}
                      align="center"
                      px="8px"
                      py="8px"
                      rounded="0 8px 8px 0px"
                    >
                      {
                        bookings.map((item) => {
                          
                          if(hour == item.occur_date.split("T")[1].split(":")[0]){
                            return(
                              <>
                              <Flex bg='cinza' p={['4px']} px={['8px']} rounded={'4px'}>{item.nome}</Flex>
                              </>
                            )
                          }
                        })
                      }
                    </Flex>
                  </Flex>
                );
              // }

              // return null;
            })
          // )
        ) : (
          <>Nenhuma agenda para a data selecionada</>
        )}
      </Flex>
    </Flex>
  );
}

// return (
//   <Flex h={["auto"]} flexDirection={"row"}>
//     <Flex
//       w={["auto"]}
//       px={"8px"}
//       height={"full"}
//       bg="roxo1"
//       align={"center"}
//     >
//       <Text fontWeight={"semibold"} color={"#fff"}>
//         {item.occur_date.split("T")[1].split(":")[0]}h
//       </Text>
//     </Flex>

//     <Flex
//       bg="#fff"
//       w={["full"]}
//       h={["45px"]}
//       // justifyContent={"space-between"}
//       align={"center"}
//       px={"8px"}
//       rounded={["0 8px 8px 0px"]}
//       gap={'8px'}
//     >
//       <Flex bg='cinza' p={'2px'} px={'6px'} rounded={'4px'}>
//         {item.nome}
//       </Flex>
//     </Flex>
//   </Flex>
// );
