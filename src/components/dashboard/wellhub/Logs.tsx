import {
  Flex,
  Text,
  Input,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/firebase/firebase";

import useAuth from "../utils/hook/useAuth";
import { useRouter } from "next/router";

import Garbage from "@/components/icons/Garbage";

export default function Logs() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logToDelete, setLogToDelete] = useState<any | null>(null); // Estado para armazenar o log que será deletado
  const router = useRouter();

  const {
    isOpen: isOpenDeleteLog,
    onOpen: onOpenDeleteLog,
    onClose: onCloseDeleteLog,
  } = useDisclosure();

  const uid = useAuth();

  useEffect(() => {
    const saveLogs = async () => {
      try {
        const ref = collection(database, "admins", uid, "gympass_logs");
        const docSnap = await getDocs(ref);

        if (docSnap.empty) {
          setLogs([]);
          return;
        }

        const logsArray = docSnap.docs
          .filter((doc) => doc.id.startsWith(selectedMonth.replace("-", "")))
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setLogs(logsArray);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      } finally {
        setLoading(false);
      }
    };

    saveLogs();
  }, [selectedMonth, uid]);

  const deleteLog = async () => {
    if (!logToDelete) return;

    try {
      await fetch("/api/gympass/deletelogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, id: logToDelete.id }),
      });

      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logToDelete.id));
      setLogToDelete(null);
      onCloseDeleteLog();
    } catch (error) {
      console.error(error);
      router.reload()
    }
  };

  if (loading)
    return (
      <Flex w="100%" p="20px" flexDirection="column" alignItems="flex-start">
        <Text fontSize="md" fontWeight="medium">
          Carregando...
        </Text>
      </Flex>
    );

  return (
    <Flex w="100%" p="20px" flexDirection="column" alignItems="flex-start" gap="10px">
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

      {logs.length > 0 ? (
        logs.map((item) => (
          <Flex key={item.id} h="auto" flexDirection="row" bg="#fff" w="90%">
            <Flex w="6px" height="full" bg="roxo1">&nbsp;</Flex>
            <Flex bg="#fff" w="full" h="45px" justifyContent="space-between" align="center" px="8px">
              <Flex gap="10px">
                <Text bg="cinza" px="5px" h="25px">Nome</Text>
                <Text>{item.username}</Text>
              </Flex>
              <Flex gap="10px">
                <Text bg="cinza" px="5px" h="25px">Erro</Text>
                <Text>{item.error}</Text>
              </Flex>
              <Flex gap="10px">
                <Text bg="cinza" px="5px" h="25px">Data</Text>
                <Text>
                  {`${item.id.substring(6, 8)}/${item.id.substring(4, 6)}/${item.id.substring(0, 4)}`}
                  &nbsp;&nbsp;{item.time}
                </Text>
              </Flex>
              <Flex gap="10px">
                <Text bg="cinza" px="5px" h="25px">Email</Text>
                <Text>{item.email}</Text>
              </Flex>
              <Box bg="cinza" px="5px" onClick={() => { setLogToDelete(item); onOpenDeleteLog(); }} cursor="pointer">
                <Garbage w={20} h={20} />
              </Box>
            </Flex>
          </Flex>
        ))
      ) : (
        <Text>Nenhum Log Cadastrado</Text>
      )}

      {/* Modal de confirmação para deletar log */}
      <Modal isOpen={isOpenDeleteLog} onClose={onCloseDeleteLog} isCentered>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" h="fit-content">
          <ModalCloseButton color="#000" />
          <ModalBody>
            <Flex mt="50px" justifyContent="center" bg="cinza">
              <Text fontWeight="semibold" fontSize="lg" color="cinza2">
                {logToDelete ? `Tem certeza que deseja deletar o log de ${logToDelete.username}?` : "Erro ao carregar log."}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="buttonCancelModal" onClick={onCloseDeleteLog}>
              Cancelar
            </Button>
            <Button variant="buttonDeleteModal" onClick={deleteLog} ml={3}>
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}


// export default function Logs() {
//   const today = new Date();
//   const [selectedMonth, setSelectedMonth] = useState(
//     `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
//   );
//   const [logs, setLogs] = useState<any[]>([]);
//   const [logToDelete, setLogToDelete] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const {
//     isOpen: isOpenDeleteLog,
//     onOpen: onOpenDeleteLog,
//     onClose: onCloseDeleteLog,
//   } = useDisclosure();

//   const uid = useAuth();

//   useEffect(() => {
//     const saveLogs = async () => {
//       try {
//         const ref = collection(database, "admins", uid, "gympass_logs");
//         const docSnap = await getDocs(ref);

//         if (docSnap.empty) {
//           setLogs([]);
//           return;
//         }

//         const logsArray = docSnap.docs
//           .filter((doc) => doc.id.startsWith(selectedMonth.replace("-", "")))
//           .map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));

//         setLogs(logsArray);
//       } catch (error) {
//         console.error("🚨 Erro ao buscar logs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     saveLogs();
//   }, [selectedMonth]);

//   const deleteLog = async () => {
//     if (!logToDelete) return;

//     try {
//       await fetch("/api/gympass/deletelogs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ uid, id: logToDelete.id }),
//       });

//       setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logToDelete.id)); // Remove o log deletado do estado
//       setLogToDelete(null);
//       onCloseDeleteLog();
//     } catch (error) {
//       console.error(error);
//     }
//   };


//   // console.log(logs)

//   if (loading)
//     return (
//       <Flex
//         w={"100%"}
//         h={"auto"}
//         align={"center"}
//         p={"20px"}
//         flexDirection={"column"}
//         alignItems={"flex-start"}
//         gap={"10px"}
//       >
//         <Text fontSize={"md"} fontWeight={"medium"}>
//           Carregando...
//         </Text>
//       </Flex>
//     );

//   return (
//     <>
//       <Flex
//         w={"100%"}
//         h={["auto"]}
//         align={"center"}
//         p={"20px"}
//         flexDirection={"column"}
//         alignItems={"flex-start"}
//         gap={"10px"}
//       >
//         <Flex
//           w={["auto"]}
//           h={["auto"]}
//           bg="white"
//           align={"center"}
//           gap={"15px"}
//           px={"25px"}
//           py={"10px"}
//         >
//           <Text bg="cinza" px={["15px"]} h={["25px"]} align={"center"}>
//             Mês
//           </Text>
//           <Input
//             type="month"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             maxW="200px"
//             variant={"escolha"}
//           />
//         </Flex>

//         {logs.length > 0 ? (
//           logs.map((item) => {
//             console.log(item)
//             return (
//               <>
//                 <Flex h={"auto"} flexDirection={"row"} bg="#fff" w={["90%"]}>
//                   <Flex w={"6px"} height={"full"} bg={["roxo1"]}>
//                     &nbsp;
//                   </Flex>
//                   <Flex
//                     bg="#fff"
//                     w={"full"}
//                     h={"45px"}
//                     justifyContent={"space-between"}
//                     align={"center"}
//                     px={"8px"}
//                     rounded={"0 8px 8px 0px"}
//                   >
//                     <Flex gap={"10px"} w={["auto"]}>
//                       <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
//                         Nome
//                       </Text>
//                       <Text>{item.username}</Text>
//                     </Flex>
//                     <Flex gap={"10px"} w={["auto"]}>
//                       <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
//                         Erro
//                       </Text>
//                       <Text>{item.error}</Text>
//                     </Flex>
//                     <Flex gap={"10px"} w={["auto"]}>
//                       <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
//                         Data
//                       </Text>
//                       <Text>
//                         {`${item.id.substring(6, 8)}/${item.id.substring(
//                           4,
//                           6
//                         )}/${item.id.substring(0, 4)}`}
//                         &nbsp;&nbsp;
//                         {item.time}
//                       </Text>
//                     </Flex>
//                     <Flex gap={"10px"} w={["auto"]}>
//                       <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
//                         Email
//                       </Text>
//                       <Text>{item.email}</Text>
//                     </Flex>
//                     <Flex w={["auto"]}>
//                       <Box
//                         bg="cinza"
//                         px={["5px"]}
//                         onClick={onOpenDeleteLog}
//                         cursor={"pointer"}
//                       >
//                         <Garbage w={20} h={20} />
//                       </Box>
//                     </Flex>
//                   </Flex>
//                 </Flex>

                
//               </>
//             );
//           })
//         ) : (
//           <Text>Nenhum Log Cadastrado</Text>
//         )}

// <Modal isOpen={isOpenDeleteLog} onClose={onCloseDeleteLog} isCentered>
//         <ModalOverlay />
//         <ModalContent minWidth="fit-content" h="fit-content">
//           <ModalCloseButton color="#fff" />
//           <ModalBody>
//             <Flex mt="50px" justifyContent="center" bg="cinza">
//               <Text fontWeight="semibold" fontSize="lg" color="cinza2">
//                 {logToDelete ? `Tem certeza que deseja deletar o log de ${logToDelete.username}?` : "Erro ao carregar log."}
//               </Text>
//             </Flex>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="buttonCancelModal" onClick={onCloseDeleteLog}>
//               Cancelar
//             </Button>
//             <Button variant="buttonDeleteModal" onClick={deleteLog} ml={3}>
//               Deletar
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//       </Flex>
//     </>
//   );
// }
