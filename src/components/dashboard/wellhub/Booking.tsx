import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const uid = useAuth();

  useEffect(() => {
    const getBookings = async () => {
      try {
        const collectionBooking = collection(
          database,
          "admins",
          uid,
          "gympass_bookings"
        );
        const querySnapshot = await getDocs(collectionBooking);

        const filteredBookings = [];

        for (const doc of querySnapshot.docs) {
          if (doc.id.split("T")[0] === selectedDay.split("T")[0]) {
            let bookingData = doc.data();

            // Verifica se há um class_id antes de buscar a classe correspondente
            if (bookingData.class_id) {
              const classesCollection = collection(
                database,
                "admins",
                uid,
                "gympass_classes"
              );
              const classQuery = query(
                classesCollection,
                where("id", "==", bookingData.class_id)
              );
              const classSnapshot = await getDocs(classQuery);

              if (!classSnapshot.empty) {
                const classData = classSnapshot.docs[0].data();
                bookingData.class_name = classData.name; // Adiciona o nome da classe ao booking
              }
            }

            filteredBookings.push(bookingData);
          }
        }

        setBookings(filteredBookings);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      } finally {
        if (typeof setLoading === "function") {
          setLoading(false);
        }
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

      {bookings.length > 0 ? (
        bookings.map((booking, index) => {
          return (
            <Flex
              flexDirection={["column"]}
              w={["50%"]}
              gap="4px"
              key={booking.id}
            >
              <Flex h={["auto"]} flexDirection={"row"}>
                <Flex w={["6px"]} height={"full"} bg="roxo1">
                  &nbsp;
                </Flex>

                <Flex
                  bg="#fff"
                  w={["full"]}
                  h={["45px"]}
                  justifyContent={"space-between"}
                  align={"center"}
                  px={"8px"}
                  rounded={["0 8px 8px 0px"]}
                >
                  <Flex gap={"10px"}>
                    <Text bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
                      Aula
                    </Text>
                    <Text>{booking.class_name}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          );
        })
      ) : (
        <Flex>Nenhuma aula encontrada</Flex>
      )}
    </Flex>
  );
}
