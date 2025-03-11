import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { databaseRealtime, database, auth } from "@/firebase/firebase";
import { child, get, onValue, ref, remove } from "firebase/database";

// icons
import Backward from "../icons/Backward";
import Class from "../icons/Class";
import Time from "../icons/Time";
import Student from "../icons/Student";
import Checking from "../icons/Checking";
import Logs from "../icons/Logs";
import Hamburguer from "../icons/Hamburguer";
import Close from "../icons/Close";
import SettingsIcon from "../icons/Settings";
import Calendar from "../icons/Calendar";
import Plans from "../icons/Plans";
import Money from "../icons/Money";

// components
import Classes from "./wellhub/Classes";
import Slots from "./wellhub/Slots";
import Checkins from "./wellhub/Checkins";
import Students from "./control/Students";
import Log from "./wellhub/Logs";
import Booking from "./wellhub/Booking";
import Configuration from "./hamburguer/Configuration";
import Planos from './control/Plans'

import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, or, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import useAuth from "./utils/hook/useAuth";
import Receita from "./control/Receita";
import Horarios from "./control/Horarios";

export default function MenuDashboard({
  onMenuClick,
}: {
  onMenuClick: (component: JSX.Element) => void;
}) {
  const menu = [
    {
      settings: [
        {
          title: "",
          submenu: [
            { title: "Conf.", link: Configuration, icon: SettingsIcon },
            { title: "Horários", link: Slots, icon: Time },
            { title: "Checkins", link: Checkins, icon: Checking },
            { title: "Logs", link: Log, icon: Logs },
          ],
        },
      ],
      client: [
        {
          title: "Gympass",
          submenu: [
            { title: "Aulas", link: Classes, icon: Class },
            { title: "Horários", link: Slots, icon: Time },
            { title: "Agenda", link: Booking, icon: Calendar },
            { title: "Checkins", link: Checkins, icon: Checking },
            { title: "Logs", link: Log, icon: Logs },
          ],
        },
        {
          title: "Controle",
          submenu: [
            { title: "Alunos", link: Students, icon: Student },
            { title: "Horários", link: Horarios, icon: Time },
            { title: "Receita", link: Receita, icon: Money },
            { title: "Despesa", link: "", icon: Backward },
            { title: "Planos", link: Planos, icon: Plans },
          ],
        },
      ],
    },
  ];

  // const menu = [
  //   {
  //     title: "Gympass",
  //     submenu: [
  //       { title: "Aulas", link: Classes, icon: Class },
  //       { title: "Horários", link: Slots, icon: Time },
  //       { title: "Checkins", link: Checkins, icon: Checking },
  //       { title: "Logs", link: Log, icon: Logs },
  //     ],
  //   },
  //   {
  //     title: "Controle",
  //     submenu: [
  //       { title: "Alunos", link: Students, icon: Student },
  //       { title: "Receita", link: "", icon: Backward },
  //       { title: "Despesa", link: "", icon: Backward },
  //     ],
  //   },
  // ];

  const [checkins, setCheckins] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [alertStudentMessage, setAlertStudentMessage] =
    useState<boolean>(false);
  const [alertLogMessage, setAlertLogMessage] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const router = useRouter();

  const currentMenu = showSettings ? menu[0].settings : menu[0].client;

  const uid = useAuth();

  useEffect(() => {
    const dbRefSuccess = ref(databaseRealtime, "checkins/success");
    const dbRefErrors = ref(databaseRealtime, "checkins/errors");
    const dbRefBooking = ref(databaseRealtime, "booking/success");


    // Listener para check-ins bem-sucedidos
    const unsubscribeSuccess = onValue(dbRefSuccess, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const checkinList = Object.entries(data).map(([id, info]) => ({
          id,
          info,
        }));
        setCheckins(checkinList);
      } else {
        setCheckins([]);
      }
    });

    // Listener para check-ins com erro
    const unsubscribeErrors = onValue(dbRefErrors, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const errorList = Object.entries(data).map(([id, info]) => ({
          id,
          info,
        }));
        setErrors(errorList);
      } else {
        setErrors([]);
      }
    });

    // Listener para bookins bem-sucedidos
    const unsubscribeBooking = onValue(dbRefBooking, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const checkinList = Object.entries(data).map(([id, info]) => ({
          id,
          info,
        }));
        setBookings(checkinList);
      } else {
        setBookings([]);
      }
    });



    return () => {
      unsubscribeSuccess();
      unsubscribeErrors();
      unsubscribeBooking();
    };



  }, [uid]);

  const verifyUser = async (checkins: any[], uid: string) => {
    for (const element of checkins) {
      try {
        const studentsCollection = collection(
          database,
          "admins",
          uid,
          "students"
        );

        const q = query(
          studentsCollection,
          where("gympass_id", "==", element.info.gympass_id)
        );
        const querySnapshot = await getDocs(q);

        // Se o usuário NÃO existe no Firestore, cadastra um novo estudante
        if (querySnapshot.empty) {
          try {
            const addNewStudentGympass = await fetch(
              "/api/dashboard/students/addnewstudent",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: uid,
                  nome: `${element.info.user.first_name} ${element.info.user.last_name}`,
                  email: element.info.user.email,
                  genero: "",
                  telefone: element.info.user.phone_number,
                  cpf: "",
                  gympass_id: element.info.gympass_id,
                  cep: "",
                  logradouro: "",
                  complemento: "",
                  numero: "",
                  cidade: "",
                  estado: "",
                }),
              }
            );

            const response = await addNewStudentGympass.json();

            if (!response.error) {
              await createNewCheckin(element, uid);
              await removeItemFromRealtimeDatabase(element.id);
            }
          } catch (error) {
            console.error("Erro ao adicionar novo estudante:", error);
          }
          continue;
        }

        // Se o usuário já existe, apenas registra o check-in
        try {
          await createNewCheckin(element, uid);
          await removeItemFromRealtimeDatabase(element.id);
        } catch (error) {
          console.error("Erro ao registrar check-in:", error);
        }
      } catch (error) {
        console.error("Erro ao verificar estudantes:", error);
      }
    }
  };

  const verifyErrors = async (errors: any[], uid: string) => {
    for (const element of errors) {
      const date = new Date(Number(element.info.timestamp));
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      try {
        const response = await fetch("/api/gympass/createnewerror", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            error: element.info.error,
            gym_id: element.info.gym_id,
            gympass_id: element.info.gympass_id,
            username: `${element.info.user.first_name} ${element.info.user.last_name}`,
            email: element.info.user.email,
            day,
            month,
            year,
            time: `${hours}:${minutes}`,
          }),
        });

        const data = await response.json();

        if (!data.error) {
          try {
            const snapshot = await get(
              child(ref(databaseRealtime), `checkins/errors/${element.id}`)
            );

            if (snapshot.exists()) {
              await remove(
                ref(databaseRealtime, `checkins/errors/${element.id}`)
              );
              setAlertLogMessage(true);
              return;
            }
          } catch (error) {
            console.error("Erro ao remover item do Realtime Database:", error);
          }
        }
      } catch (error) {
        // console.error("Erro ao enviar erro para API:", error);
        router.reload();
      }
    }
  };

  const verifyBookings = async (booking: any[], uid: string) => {

    for (const element of booking) {
      try {
        const studentsCollection = collection(
          database,
          "admins",
          uid,
          "students"
        );

        const q = query(
          studentsCollection,
          or(
            where("gympass_id", "==", element.info.user.unique_token),
            where("email", "==", element.info.user.email)
          )
        )
        
        const querySnapshot = await getDocs(q);

        // Se o usuário NÃO existe no Firestore, cadastra um novo estudante
        if (querySnapshot.empty) {
          try {
            const addNewStudentGympass = await fetch(
              "/api/dashboard/students/addnewstudent",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: uid,
                  nome: `${element.info.user.name}`,
                  email: element.info.user.email,
                  genero: "",
                  telefone: element.info.user.phone_number,
                  cpf: "",
                  gympass_id: element.info.user.unique_token,
                  cep: "",
                  logradouro: "",
                  complemento: "",
                  numero: "",
                  cidade: "",
                  estado: "",
                }),
              }
            );

            const response = await addNewStudentGympass.json();

            if (!response.error) {
              await createNewBooking(element, uid);
            }
          } catch (error) {
            console.error("Erro ao adicionar novo estudante:", error);
          }
          continue;
        }
      
        // Se o usuário já existe, apenas registra o check-in
        try {
          await createNewBooking(element, uid);
        } catch (error) {
          console.error("Erro ao registrar check-in:", error);
        }
      } catch (error) {
        console.error("Erro ao verificar estudantes:", error);
      }
    }
  };

  // Função para criar um novo check-in no Firebase
  const createNewCheckin = async (
    element: {
      info: {
        user: { first_name: any; last_name: any; email: any };
        gympass_id: any;
        validated_at: any;
        gym_product: string;
        gym_product_id: number;
      };
    },
    uid: string
  ) => {
    const response = await fetch("/api/gympass/createnewcheckin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: uid,
        nome: `${element.info.user.first_name} ${element.info.user.last_name}`,
        email: element.info.user.email,
        gympass_id: element.info.gympass_id,
        validated: element.info.validated_at,
        gym_product: element.info.gym_product,
        gym_product_id: element.info.gym_product_id,
      }),
    });

    return response.json();
  };

  // Função para criar um novo booking no Firebase
  const createNewBooking = async (element: any, uid: string) => {

    const dataFetch = await fetch("/api/gympass/createnewbooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: uid,
        nome: element.info.user.name,
        email: element.info.user.email,
        gympass_id: element.info.user.unique_token,
        booking_number: element.info.slot.booking_number,
        class_id: element.info.slot.class_id,
        gym_id: element.info.slot.gym_id,
        slot_id: element.info.slot.id,
        booking_id: element.id
      }),
    });

    const response = await dataFetch.json()

    if(!response.error){
      try {
        const snapshot = await get(
          child(ref(databaseRealtime), `booking/success/${element.id}`)
        );

        if (snapshot.exists()) {
          await remove(
            ref(databaseRealtime, `booking/success/${element.id}`)
          );
          setAlertLogMessage(true);
          return;
        }
      } catch (error) {
        console.error("Erro ao remover item do Realtime Database:", error);
      }
    }

    return dataFetch.json();
  };

  // Função para remover um item do Realtime Database
  const removeItemFromRealtimeDatabase = async (id: string) => {
    try {
      const itemRef = (ref(databaseRealtime), `checkins/success/${id}`);

      const snapshot = await get(
        child(ref(databaseRealtime), `checkins/success/${id}`)
      );

      if (snapshot.exists()) {
        await remove(ref(databaseRealtime, `checkins/success/${id}`));
        setAlertStudentMessage(true);
        return;
      }
    } catch (error) {
      console.error("Erro ao remover item do Realtime Database:", error);
    }
  };

  useEffect(() => {
    if (checkins.length > 0) {
      verifyUser(checkins, uid);
    }
  }, [checkins]);

  useEffect(() => {
    if (errors.length > 0) {
      verifyErrors(errors, uid);
    }
  }, [errors]);

  useEffect(() => {
    if (bookings.length > 0) {
      verifyBookings(bookings, uid);
    }
  }, [bookings]);


  return (
    <>
      <Flex
        bg={showSettings ? "roxo1" : "#fff"}
        h="100vh"
        w="380px"
        flexDirection="column"
        align="center"
        // pt="50px"
        gap="10px"
      >
        <Flex w={"100%"} h={"50px"} align={"center"} pt={"20px"} pl={"20px"}>
          {showSettings ? (
            <Box
              cursor={"pointer"}
              onClick={() => setShowSettings(false)}
              color="#fff"
            >
              <Close i={3} />
            </Box>
          ) : (
            <Box cursor={"pointer"} onClick={() => setShowSettings(true)}>
              <Hamburguer w={30} h={25} />
            </Box>
          )}
        </Flex>

        {showSettings
          ? currentMenu.map((item, index) => (
              <Flex
                key={index}
                w="90%"
                p="10px"
                flexDirection="column"
                gap="5px"
              >
                <Flex w="100%" py="5px">
                  <Text color="black">{item.title}</Text>
                </Flex>

                {item.submenu && (
                  <Flex w="100%" wrap="wrap" rowGap="5px" columnGap="5px">
                    {item.submenu.map((subItem, subIndex) => (
                      <Flex
                        key={subIndex}
                        bg="cinza"
                        rounded="4px"
                        w="85px"
                        h="99px"
                        justifyContent="center"
                        align="center"
                        flexDirection="column"
                        cursor="pointer"
                        onClick={() => {
                          onMenuClick(React.createElement(subItem.link));
                          // if (subItem.link) {
                          //   onMenuClick(React.createElement(subItem.link));
                          // } else {
                          //   console.warn(
                          //     "Link não definido para:",
                          //     subItem.title
                          //   );
                          // }
                        }}
                      >
                        <Flex w="30%" h="30%">
                          {React.createElement(subItem.icon)}
                        </Flex>
                        <Text fontSize="sm">{subItem.title}</Text>
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Flex>
            ))
          : currentMenu.map((item, index) => (
              <Flex
                key={index}
                w="90%"
                p="10px"
                flexDirection="column"
                gap="5px"
              >
                <Flex w="100%" py="5px">
                  <Text color="black">{item.title}</Text>
                </Flex>

                {item.submenu && (
                  <Flex w="100%" wrap="wrap" rowGap="5px" columnGap="5px">
                    {item.submenu.map((subItem, subIndex) => (
                      <Flex
                        key={subIndex}
                        bg="cinza"
                        rounded="4px"
                        w="85px"
                        h="99px"
                        justifyContent="center"
                        align="center"
                        flexDirection="column"
                        cursor="pointer"
                        onClick={() => {
                          onMenuClick(React.createElement(subItem.link));
                          // if (subItem.link) {
                          //   onMenuClick(React.createElement(subItem.link));
                          // } else {
                          //   console.warn(
                          //     "Link não definido para:",
                          //     subItem.title
                          //   );
                          // }
                        }}
                      >
                        <Flex w="30%" h="30%">
                          {React.createElement(subItem.icon)}
                        </Flex>
                        <Text fontSize="sm">{subItem.title}</Text>
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Flex>
            ))}
      </Flex>
    </>
  );
}

const Settings = () => {
  return (
    <Flex
      w="100%"
      p="20px"
      flexDirection="column"
      align="center"
      bg="red"
    ></Flex>
  );
};
