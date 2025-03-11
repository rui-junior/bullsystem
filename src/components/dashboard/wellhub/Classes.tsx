import Edit from "@/components/icons/Edit";
import Garbage from "@/components/icons/Garbage";
import {
  Box,
  Flex,
  Text,
  Input,
  background,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  SkeletonText,
  Skeleton,
  ModalFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClassData, NewClassProps } from "./types/types";
import FloatingLabelInput from "../utils/FloatingLabel";
import useAuth from "../utils/hook/useAuth";

export default function ClasseWellhub() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState<ClassData[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<{
    name: string;
    description: string;
    product_id: number;
  }>({
    name: "",
    description: "",
    product_id: 0,
  });

  const [classToDelete, setClasstoDelete] = useState<{
    id: number;
    gym_id: number;
    product_id: number;
    nome: string;
  }>({
    id: 0,
    gym_id: 0,
    product_id: 0,
    nome: ""
  });

  const {
    isOpen: isOpenDeleteSlots,
    onOpen: onOpenDeleteSlots,
    onClose: onCloseDeleteSlots,
  } = useDisclosure();

  const router = useRouter();
  const uid = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/gympass/wellhubclasses");
        const result = await response.json();

        if (Array.isArray(result.classes)) {
          // Filtra apenas os itens com visible: true antes de salvar em data
          const filteredClasses = result.classes.filter(
            (item: { visible: boolean }) => item.visible === true
          );
          setData(filteredClasses);
        } else {
          router.reload();
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadTrigger]);

  const formatDate = (isoDate: string): string => {
    const cleanDate = isoDate.replace(/\[UTC\]$/, "");
    const date = new Date(cleanDate);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  const saveChanges = async (
    id: number,
    gym_id: number,
    product_id: number
  ) => {
    try {
      const response = await fetch("/api/gympass/updatewellhubclasses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: editedValues.name,
          description: editedValues.description,
          gym_id,
          product_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar as alterações");
      }

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                name: editedValues.name,
                description: editedValues.description,
              }
            : item
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
    }
  };

  const deleteClasses = async (
    id: number,
    gym_id: number,
    product_id: number,
  ) => {

    try {
      const deleteClassesFetch = await fetch("/api/gympass/deletewellhubclasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          uid,
          gym_id,
          product_id
        }),
      });

      const response = await deleteClassesFetch.json()

      if (!response.error) {
        setReloadTrigger((prev) => prev + 1);
        onCloseDeleteSlots();
        return;
      }

      router.reload()

    } catch (error) {
      // console.error("Erro ao salvar as alterações:", error);
      router.reload();
    }

  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedValues({ name: "", description: "", product_id: 0 });
  };
  
  const isSaveNewClasses = () => {

    setReloadTrigger((prev) => prev + 1);
    onClose()

  }


  if (error) return <div>Error: {error}</div>;


  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" h="fit-content">
          <ModalCloseButton color="#fff" />
          <ModalBody>
            <NewClass onCancel={() => isSaveNewClasses()} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDeleteSlots} onClose={onCloseDeleteSlots} isCentered>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" h="fit-content">
          <ModalCloseButton color="#fff" />
          <ModalBody>
            <Flex
              justifyContent={["center"]}
              align={["center"]}
              flexDirection={"column"}
              w={"100%"}
              h={"190px"}
              rowGap={"10px"}
              // position={"initial"}
              
            >
              <Flex
                w={"100%"}
                h={"45px"}
                position={"absolute"}
                top={"0px"}
                align={"center"}
                px={"50px"}
                zIndex={-1}
                bg="roxo1"
              >
                <Text
                  color={"#fff"}
                  fontWeight={"bold"}
                  fontFamily={"inherit"}
                  fontSize={"md"}
                >
                  Deletar Aula
                </Text>
              </Flex>
              <Text fontWeight={"semibold"} fontSize={"lg"}>
                Realmente deseja deletar a aula?
              </Text>
              <Flex
                position={"absolute"}
                bottom={"20px"}
                w={"100%"}
                align={"center"}
                justifyContent={"right"}
                pr={"25px"}
              >
                <Button
                  variant={"buttonCancelModal"}
                  onClick={onCloseDeleteSlots}
                >
                  Cancelar
                </Button>
                <Button
                  variant={"buttonDeleteModal"}
                  onClick={() =>
                    deleteClasses(
                      classToDelete.id,
                      classToDelete.gym_id,
                      classToDelete.product_id,
                    )
                  }
                  ml={3}
                >
                  Deletar
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex
        w={"100%"}
        h={["auto"]}
        align={"center"}
        p={"20px"}
        flexDirection={"column"}
        alignItems={"flex-start"}
        gap={"10px"}
      >
        <Button
          my={"8px"}
          variant={"buttonFundoBranco"}
          onClick={onOpen}
          transition={"ease-in-out"}
        >
          Nova Aula
        </Button>

        {loading ? (
          <Text fontSize={"md"} fontWeight={"medium"}>
            Carregando...
          </Text>
        ) : data?.length > 0 ? (
          data.map((item: ClassData) =>
            item.visible ? (
              <>
                <Flex
                  w={["85%"]}
                  h={["auto"]}
                  flexDirection={"row"}
                  key={item.id}
                >
                  <Flex w={["6px"]} height={"full"} bg="roxo1">
                    &nbsp;
                  </Flex>
                  <Flex
                    bg="#fff"
                    w={["full"]}
                    h={["45px"]}
                    justifyContent={"space-around"}
                    align={"center"}
                    px={"8px"}
                    rounded={["0 8px 8px 0px"]}
                  >
                    <Flex w={["30%"]} gap={"10px"} align={"left"}>
                      <Flex
                        bg="cinza"
                        px={["5px"]}
                        h={["25px"]}
                        align={"center"}
                      >
                        <Text>Nome</Text>
                      </Flex>
                      {editingId === item.id ? (
                        <Input
                          value={editedValues.name}
                          maxLength={200}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              name: e.target.value,
                            })
                          }
                          h={"30px"}
                          w={"80%"}
                          borderColor="roxo1"
                          borderWidth="1px"
                          rounded={"4px"}
                        />
                      ) : (
                        <Text>{item.name}</Text>
                      )}
                    </Flex>
                    <Flex
                      w={["30%"]}
                      gap={"10px"}
                      align={"center"}
                      justifyContent={["left"]}
                    >
                      <Flex
                        bg="cinza"
                        px={["5px"]}
                        h={["25px"]}
                        align={"center"}
                      >
                        Descrição
                      </Flex>
                      {editingId === item.id ? (
                        <Input
                          value={editedValues.description}
                          maxLength={200}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              description: e.target.value,
                            })
                          }
                          h={"30px"}
                          w={"90%"}
                          borderColor="roxo1"
                          borderWidth="1px"
                          rounded={"4px"}
                        />
                      ) : (
                        <Text>{item.description}</Text>
                      )}
                    </Flex>
                    <Flex w={["20%"]} gap={"10px"} justifyContent={["center"]}>
                      <Box bg="cinza" px={["5px"]}>
                        Data
                      </Box>
                      <Text>{formatDate(item.created_at)}</Text>
                    </Flex>
                    <Flex
                      w={["20%"]}
                      gap={"10px"}
                      justifyContent={"right"}
                      align={"center"}
                    >
                      {editingId === item.id ? (
                        <>
                          <Button
                            size={"sm"}
                            variant={"buttonSalvar"}
                            onClick={() =>
                              saveChanges(item.id, item.gym_id, item.product_id)
                            }
                          >
                            <Text>Salvar</Text>
                          </Button>
                          <Button
                            size={"sm"}
                            variant={"buttonCancelar"}
                            onClick={() => cancelEdit()}
                            // onClick={() => saveChanges(item.id, item.gym_id, item.product_id)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Box
                            bg="cinza"
                            px={["5px"]}
                            onClick={() => {
                              setEditingId(item.id);
                              setEditedValues({
                                name: item.name,
                                description: item.description,
                                product_id: item.product_id,
                              });
                            }}
                            cursor={"pointer"}
                          >
                            <Edit />
                          </Box>
                          <Box
                            bg="cinza"
                            px={["5px"]}
                            onClick={() => {
                              setClasstoDelete({
                                id: item.id,
                                gym_id: item.gym_id,
                                product_id: item.product_id,
                                nome: item.name
                              }),
                                onOpenDeleteSlots();
                            }}
                            cursor={"pointer"}
                          >
                            <Garbage w={22} h={22} />
                          </Box>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </>
            ) : null
          )
        ) : (
          <Flex
            w={["350px"]}
            flexDirection={"row"}
            bg="#fff"
            align={"center"}
            gap="20px"
          >
            <Flex w={["6px"]} height={"45px"} bg="roxo1">
              &nbsp;
            </Flex>
            <Flex bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
              <Text>Nenhuma Aula Cadastrada</Text>
            </Flex>
          </Flex>
        )}

      </Flex>
    </>
  );
}

export function NewClass({ onCancel }: NewClassProps) {
  const [message, setMessage] = useState<string | null>("");
  const [formValues, setFormValues] = useState({
    nome: "",
    descricao: "",
    observacoes: "",
    aulavirtual: false,
  });

  const router = useRouter();
  const uid = useAuth();

  const createNewClass = async () => {
    const payload = {
      uid: uid,
      gym_id: 153,
      product_id: 305,
      name: formValues.nome,
      description: formValues.descricao,
      notes: formValues.observacoes,
      bookable: true,
      visible: true,
      is_virtual: formValues.aulavirtual,
    };

    if (!formValues.nome || !formValues.descricao) {
      setTimeout(() => {
        setMessage("");
      }, 4000);

      setMessage("Complete corretamente os campos.");
      return;
    }

    try {
      const newClassFecth = await fetch("/api/gympass/createnewwellhubclasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const response = await newClassFecth.json()

      if (!response.error) {

        onCancel()
        return
        
      }
      
      router.reload()


    } catch (error) {
      console.error("Erro ao criar classe:", error);
      router.reload()
    }
  };

  return (
    <Flex
      justifyContent={["center"]}
      align={["center"]}
      flexDirection={"column"}
      w={"500px"}
      h={"450px"}
      rowGap={"20px"}
    >
      <Flex
        w={"100%"}
        h={"45px"}
        position={"absolute"}
        top={"0px"}
        align={"center"}
        px={"50px"}
        zIndex={-1}
        bg="roxo1"
      >
        <Text
          color={"#fff"}
          fontWeight={"bold"}
          fontFamily={"inherit"}
          fontSize={"md"}
        >
          Cadastrar Novo Aluno
        </Text>
      </Flex>

      <Flex flexDirection="column" w="full" h="auto" gap={"15px"} mt="25px">
        {message != "" ? (
          <Flex justifyContent={"center"} align={"center"}>
            <Flex
              // w={"350px"}
              w={"auto"}
              h={"80px"}
              // style={{ background:"var(--roxo1)"}}
              bg={"roxo1"}
              // bg={"#ff5252"}
              // mt={"25px"}
              px={"25px"}
              py={"5px"}
              mt={"15px"}
              rounded={"3px"}
              justifyContent={"center"}
              align={"center"}
            >
              <Text fontSize={"sm"} color={"#fff"} fontWeight={"semibold"}>
                {message}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <>
            <Flex w={["100%"]}>
              <FloatingLabelInput
                label="Nome da Aula"
                name="nome"
                type="text"
                value={formValues.nome}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    nome: e.target.value,
                  }))
                }
              />
            </Flex>
            <Flex w={["100%"]}>
              <FloatingLabelInput
                label="Descrição"
                name="descricao"
                type="text"
                value={formValues.descricao}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
              />
            </Flex>
            <Flex w={["100%"]}>
              <FloatingLabelInput
                label="Observações"
                name="observacoes"
                type="text"
                value={formValues.observacoes}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
              />
            </Flex>
            <Flex
              w={["100%"]}
              h={"50px"}
              gap={"15px"}
              align={"center"}
              bg="cinza"
            >
              <Flex w={["6px"]} h={"100%"} bg="roxo1">
                &nbsp;
              </Flex>
              <Text fontWeight={"semibold"}>Aula Virtual</Text>
              <Switch
                isChecked={formValues.aulavirtual}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    aulavirtual: e.target.checked,
                  }))
                }
              />
            </Flex>

            <Flex justifyContent={"center"} align={"center"}>
              <Button
                variant={"buttonFundoBranco"}
                onClick={() => {
                  createNewClass();
                }}
              >
                Cadastrar
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
}

// export function ClassesTable() {
//   const [data, setData] = useState<ClassData[]>([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [reloadTrigger, setReloadTrigger] = useState(0);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editedValues, setEditedValues] = useState<{
//     name: string;
//     description: string;
//     product_id: number;
//   }>({
//     name: "",
//     description: "",
//     product_id: 0,
//   });

//   const [classToDelete, setClasstoDelete] = useState<{
//     id: number;
//     gym_id: number;
//     product_id: number;
//   }>({
//     id: 0,
//     gym_id: 0,
//     product_id: 0,
//   });

//   const {
//     isOpen: isOpenDeleteSlots,
//     onOpen: onOpenDeleteSlots,
//     onClose: onCloseDeleteSlots,
//   } = useDisclosure();

//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/gympass/wellhubclasses");
//         const result = await response.json();

//         if (Array.isArray(result.classes)) {
//           // Filtra apenas os itens com visible: true antes de salvar em data
//           const filteredClasses = result.classes.filter(
//             (item: { visible: boolean }) => item.visible === true
//           );
//           setData(filteredClasses);
//         } else {
//           router.reload();
//         }
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [reloadTrigger]);

//   const formatDate = (isoDate: string): string => {
//     const cleanDate = isoDate.replace(/\[UTC\]$/, "");
//     const date = new Date(cleanDate);

//     const day = String(date.getUTCDate()).padStart(2, "0");
//     const month = String(date.getUTCMonth() + 1).padStart(2, "0");
//     const year = date.getUTCFullYear();

//     return `${day}/${month}/${year}`;
//   };

//   const saveChanges = async (
//     id: number,
//     gym_id: number,
//     product_id: number
//   ) => {
//     try {
//       const response = await fetch("/api/gympass/updatewellhubclasses", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id: id,
//           name: editedValues.name,
//           description: editedValues.description,
//           gym_id,
//           product_id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Falha ao salvar as alterações");
//       }

//       setData((prevData) =>
//         prevData.map((item) =>
//           item.id === id
//             ? {
//                 ...item,
//                 name: editedValues.name,
//                 description: editedValues.description,
//               }
//             : item
//         )
//       );

//       setEditingId(null);
//     } catch (error) {
//       console.error("Erro ao salvar as alterações:", error);
//     }
//   };

//   const deleteClasses = async (
//     id: number,
//     gym_id: number,
//     product_id: number
//   ) => {
//     try {
//       const response = await fetch("/api/gympass/deletewellhubclasses", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id: id,
//           gym_id,
//           product_id,
//         }),
//       });

//       if (response.ok) {
//         setReloadTrigger((prev) => prev + 1);
//         onCloseDeleteSlots();
//         return;
//       }

//       onCloseDeleteSlots();
//     } catch (error) {
//       // console.error("Erro ao salvar as alterações:", error);
//       router.reload();
//     }
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditedValues({ name: "", description: "", product_id: 0 });
//   };

//   if (loading)
//     return (
//       // <Skeleton startColor='pink.500' endColor='orange.500' height='20px' />
//       <Text fontSize={"md"} fontWeight={"medium"}>
//         Carregando...
//       </Text>
//     );
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <>
//       <Modal isOpen={isOpenDeleteSlots} onClose={onCloseDeleteSlots} isCentered>
//         <ModalOverlay />
//         <ModalContent minWidth="fit-content" h="fit-content">
//           <ModalCloseButton color="#fff" />
//           <ModalBody>
//             <Flex
//               justifyContent={["center"]}
//               align={["center"]}
//               flexDirection={"column"}
//               w={"100%"}
//               h={"200px"}
//               rowGap={"10px"}
//               position={"initial"}
//             >
//               <Flex
//                 w={"100%"}
//                 h={"45px"}
//                 position={"absolute"}
//                 top={"0px"}
//                 align={"center"}
//                 px={"50px"}
//                 zIndex={-1}
//                 bg="roxo1"
//               >
//                 <Text
//                   color={"#fff"}
//                   fontWeight={"bold"}
//                   fontFamily={"inherit"}
//                   fontSize={"md"}
//                 >
//                   Cadastrar Novo Aluno
//                 </Text>
//               </Flex>
//               <Text fontWeight={"bold"} fontSize={"lg"}>
//                 Realmente deseja deletar a aula?
//               </Text>
//               <Flex
//                 position={"absolute"}
//                 bottom={"20px"}
//                 w={"100%"}
//                 align={"center"}
//                 justifyContent={"right"}
//                 pr={"25px"}
//               >
//                 <Button
//                   variant={"buttonCancelModal"}
//                   onClick={onCloseDeleteSlots}
//                 >
//                   Cancelar
//                 </Button>
//                 <Button
//                   variant={"buttonDeleteModal"}
//                   onClick={() =>
//                     deleteClasses(
//                       classToDelete.id,
//                       classToDelete.gym_id,
//                       classToDelete.product_id
//                     )
//                   }
//                   ml={3}
//                 >
//                   Deletar
//                 </Button>
//               </Flex>
//             </Flex>
//           </ModalBody>

//           {/* <ModalFooter>
//             <Button variant={"buttonCancelModal"} onClick={onCloseDeleteSlots}>
//               Cancelar
//             </Button>
//             <Button
//               variant={"buttonDeleteModal"}
//               onClick={() =>
//                 deleteClasses(
//                   classToDelete.id,
//                   classToDelete.gym_id,
//                   classToDelete.product_id
//                 )
//               }
//               ml={3}
//             >
//               Deletar
//             </Button>
//           </ModalFooter> */}
//         </ModalContent>
//       </Modal>
//       {data?.length > 0 ? (
//         data.map((item: ClassData) =>
//           item.visible ? (
//             <>
//               <Flex
//                 w={["85%"]}
//                 h={["auto"]}
//                 flexDirection={"row"}
//                 key={item.id}
//               >
//                 <Flex w={["6px"]} height={"full"} bg="roxo1">
//                   &nbsp;
//                 </Flex>
//                 <Flex
//                   bg="#fff"
//                   w={["full"]}
//                   h={["45px"]}
//                   justifyContent={"space-around"}
//                   align={"center"}
//                   px={"8px"}
//                   rounded={["0 8px 8px 0px"]}
//                 >
//                   <Flex w={["30%"]} gap={"10px"} align={"left"}>
//                     <Flex bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
//                       <Text>Nome</Text>
//                     </Flex>
//                     {editingId === item.id ? (
//                       <Input
//                         value={editedValues.name}
//                         maxLength={200}
//                         onChange={(e) =>
//                           setEditedValues({
//                             ...editedValues,
//                             name: e.target.value,
//                           })
//                         }
//                         h={"30px"}
//                         w={"80%"}
//                         borderColor="roxo1"
//                         borderWidth="1px"
//                         rounded={"4px"}
//                       />
//                     ) : (
//                       <Text>{item.name}</Text>
//                     )}
//                   </Flex>
//                   <Flex
//                     w={["30%"]}
//                     gap={"10px"}
//                     align={"center"}
//                     justifyContent={["left"]}
//                   >
//                     <Flex bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
//                       Descrição
//                     </Flex>
//                     {editingId === item.id ? (
//                       <Input
//                         value={editedValues.description}
//                         maxLength={200}
//                         onChange={(e) =>
//                           setEditedValues({
//                             ...editedValues,
//                             description: e.target.value,
//                           })
//                         }
//                         h={"30px"}
//                         w={"90%"}
//                         borderColor="roxo1"
//                         borderWidth="1px"
//                         rounded={"4px"}
//                       />
//                     ) : (
//                       <Text>{item.description}</Text>
//                     )}
//                   </Flex>
//                   <Flex w={["20%"]} gap={"10px"} justifyContent={["center"]}>
//                     <Box bg="cinza" px={["5px"]}>
//                       Data
//                     </Box>
//                     <Text>{formatDate(item.created_at)}</Text>
//                   </Flex>
//                   <Flex
//                     w={["20%"]}
//                     gap={"10px"}
//                     justifyContent={"right"}
//                     align={"center"}
//                   >
//                     {editingId === item.id ? (
//                       <>
//                         <Button
//                           size={"sm"}
//                           variant={"buttonSalvar"}
//                           onClick={() =>
//                             saveChanges(item.id, item.gym_id, item.product_id)
//                           }
//                         >
//                           <Text>Salvar</Text>
//                         </Button>
//                         <Button
//                           size={"sm"}
//                           variant={"buttonCancelar"}
//                           onClick={() => cancelEdit()}
//                           // onClick={() => saveChanges(item.id, item.gym_id, item.product_id)}
//                         >
//                           Cancelar
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Box
//                           bg="cinza"
//                           px={["5px"]}
//                           onClick={() => {
//                             setEditingId(item.id);
//                             setEditedValues({
//                               name: item.name,
//                               description: item.description,
//                               product_id: item.product_id,
//                             });
//                           }}
//                           cursor={"pointer"}
//                         >
//                           <Edit />
//                         </Box>
//                         <Box
//                           bg="cinza"
//                           px={["5px"]}
//                           onClick={() => {
//                             setClasstoDelete({
//                               id: item.id,
//                               gym_id: item.gym_id,
//                               product_id: item.product_id,
//                             }),
//                               onOpenDeleteSlots();
//                           }}
//                           cursor={"pointer"}
//                         >
//                           <Garbage w={22} h={22} />
//                         </Box>
//                       </>
//                     )}
//                   </Flex>
//                 </Flex>
//               </Flex>

//               {/* <Modal
//                 isOpen={isOpenDeleteSlots}
//                 onClose={onCloseDeleteSlots}
//                 isCentered
//               >
//                 <ModalOverlay />
//                 <ModalContent>
//                   <ModalCloseButton />
//                   <ModalBody>
//                     <Flex mt={"50px"} justifyContent={"center"} bg="cinza">
//                       <Text
//                         fontWeight={"semibold"}
//                         fontSize={"lg"}
//                         color={"cinza2"}
//                       >
//                         Tem certeza que gostaria de deletar a aula?
//                       </Text>
//                     </Flex>
//                   </ModalBody>

//                   <ModalFooter>
//                     <Button
//                       variant={"buttonCancelModal"}
//                       onClick={onCloseDeleteSlots}
//                     >
//                       Cancelar
//                     </Button>
//                     <Button
//                       variant={"buttonDeleteModal"}
//                       onClick={() =>
//                         deleteClasses(item.id, item.gym_id, item.product_id)
//                       }
//                       ml={3}
//                     >
//                       Deletar
//                     </Button>
//                   </ModalFooter>
//                 </ModalContent>
//               </Modal> */}
//             </>
//           ) : null
//         )
//       ) : (
//         <Flex
//           w={["350px"]}
//           flexDirection={"row"}
//           bg="#fff"
//           align={"center"}
//           gap="20px"
//         >
//           <Flex w={["6px"]} height={"45px"} bg="roxo1">
//             &nbsp;
//           </Flex>
//           <Flex bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
//             <Text>Nenhuma Aula Cadastrada</Text>
//           </Flex>
//         </Flex>
//       )}
//     </>
//   );
// }
