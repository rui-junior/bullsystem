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

export default function ClasseWellhub() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" h="fit-content">
          <ModalCloseButton />
          <ModalBody>
            <NewClass onCancel={onClose} />
          </ModalBody>

          {/* <Button onClick={onClose}>Close</Button> */}
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
          variant={'buttonFundoBranco'}
          onClick={onOpen}
          transition={"ease-in-out"}
        >
          Nova Aula
        </Button>

        <ClassesTable />
      </Flex>
    </>
  );
}

export function NewClass({ onCancel }: NewClassProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [aulaVirtual, setAulaVirtual] = useState(false);
  const [message, setMessage] = useState<string | null>("");

  const router = useRouter();

  const createNewClasses = async () => {
    const payload = {
      name: nome,
      description: descricao,
      notes: observacoes,
      bookable: true,
      visible: true,
      is_virtual: aulaVirtual,
    };

    if (!nome || !descricao) {
      setTimeout(() => {
        setMessage("");
      }, 4000);

      setMessage("Complete corretamente os campos.");
      return;
    }

    try {
      const response = await fetch("/api/createnewwellhubclasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.classes !== undefined) {
          router.reload();
          onCancel();
        }
      } else {
        const errorData = await response.json();

        if (errorData !== undefined) {
          console.error("Erro ao criar classe:", errorData);
          onCancel();
        }
      }
    } catch (error) {
      console.error("Erro ao criar classe:", error);
      onCancel();
    }
  };

  return (
    <Flex
      bg={"#fff"}
      // px={["15px"]}
      // py={["25px"]}
      justifyContent={["center"]}
      align={["center"]}
      rounded={"8px"}
      flexDirection={"column"}
      w={"650px"}
      h={"400px"}
      rowGap={"10px"}
    >
      {message != "" ? (
        <Flex
          w={"350px"}
          h={"80px"}
          // style={{ background:"var(--roxo1)"}}
          // bg={"#ff5252"}
          bg={"roxo1"}
          // mt={"25px"}
          px={"25px"}
          py={"5px"}
          mt={"15px"}
          rounded={"3px"}
          justifyContent={"center"}
          align={"center"}
        >
          <Text fontSize={"md"} fontWeight={"semibold"} color={"#fff"}>
            {message}
          </Text>
        </Flex>
      ) : (
        <>
          {/* <Flex w={"90%"}>
            <Text
              bg="cinza"
              p="5px"
              px="10px"
              color={"black"}
              fontWeight={"semibold"}
            >
              Cadastrar Nova Aula
            </Text>
          </Flex> */}
          {/* Nome */}
          <Flex
            paddingEnd={"20px"}
            h={"45px"}
            w={["90%"]}
            align={"center"}
            justifyContent={'space-between'}
            gap={"10px"}
            bg="cinza"
          >
            <Flex w={["6px"]} h={"100%"} bg="roxo1">
              &nbsp;
            </Flex>
            <Flex px={["5px"]} h={["25px"]} align={"center"}>
              <Text>Nome</Text>
            </Flex>
            <Input
              h={"30px"}
              w={['85%']}
              rounded={"4px"}
              bg="#fff"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Flex>

          {/* Descrição */}
          <Flex
            paddingEnd={"20px"}
            h={"45px"}
            w={["90%"]}
            align={"center"}
            gap={"10px"}
            bg="cinza"
            justifyContent={'space-between'}
          >
            <Flex w={["6px"]} h={"100%"} bg="roxo1">
              &nbsp;
            </Flex>
            <Flex align={"center"}>
              <Text>Descrição</Text>
            </Flex>
            <Input
              h={"30px"}
              w={["80%"]}
              rounded={"4px"}
              bg="#fff"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Flex>

          {/* Observações */}
          <Flex
            paddingEnd={"20px"}
            w={["90%"]}
            h={["100px"]}
            align={"center"}
            justifyContent={'space-between'}
            gap={"10px"}
            bg="cinza"
          >
            <Flex w={["6px"]} h={"100%"} bg="roxo1">
              &nbsp;
            </Flex>
            <Flex align={"center"}>
              <Text>Observações</Text>
            </Flex>
            <Flex py={"10px"} w={["75%"]}>
              <Input
                h={"80px"}
                w={["100%"]}
                rounded={"4px"}
                bg="#fff"
                
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </Flex>
          </Flex>

          {/* Aula Virtual */}
          <Flex
            paddingEnd={"20px"}
            w={["90%"]}
            h={"45px"}
            align={"center"}
            gap={"20px"}
            bg="cinza"
            flexDirection={"row"}
          >
            <Flex w={["6px"]} h={"100%"} bg="roxo1">
              &nbsp;
            </Flex>
            <Flex align={"center"}>
              <Text>Aula Virtual</Text>
            </Flex>
            <FormControl display="flex" alignItems="center" w={"auto"}>
              <Switch
                id="aula-virtual"
                colorScheme="gray"
                isChecked={aulaVirtual}
                onChange={() => setAulaVirtual(!aulaVirtual)}
              />
            </FormControl>
          </Flex>

          {/* Botões */}
          <Flex gap={"10px"}>
            <Button variant="buttonSalvar" onClick={createNewClasses}>
              Salvar
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}

export function ClassesTable() {
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
  const {
    isOpen: isOpenDeleteSlots,
    onOpen: onOpenDeleteSlots,
    onClose: onCloseDeleteSlots,
  } = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/wellhubclasses");
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
      const response = await fetch("/api/updatewellhubclasses", {
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
    product_id: number
  ) => {
    try {
      const response = await fetch("/api/deletewellhubclasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          gym_id,
          product_id,
        }),
      });

      if (response.ok) {
        setReloadTrigger((prev) => prev + 1);
        onCloseDeleteSlots();
        return;
      }

      onCloseDeleteSlots();
    } catch (error) {
      // console.error("Erro ao salvar as alterações:", error);
      router.reload();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedValues({ name: "", description: "", product_id: 0 });
  };

  if (loading)
    return (
      // <Skeleton startColor='pink.500' endColor='orange.500' height='20px' />
      <Text fontSize={"md"} fontWeight={"medium"}>
        Carregando...
      </Text>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {data?.length > 0 ? (
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
                    <Flex bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
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
                    <Flex bg="cinza" px={["5px"]} h={["25px"]} align={"center"}>
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
                          onClick={onOpenDeleteSlots}
                          cursor={"pointer"}
                        >
                          <Garbage w={22} h={22} />
                        </Box>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Flex>

              <Modal
                isOpen={isOpenDeleteSlots}
                onClose={onCloseDeleteSlots}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Flex mt={"50px"} justifyContent={"center"} bg="cinza">
                      <Text
                        fontWeight={"semibold"}
                        fontSize={"lg"}
                        color={"cinza2"}
                      >
                        Tem certeza que gostaria de deletar a aula?
                      </Text>
                    </Flex>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      variant={"buttonCancelModal"}
                      onClick={onCloseDeleteSlots}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant={"buttonDeleteModal"}
                      onClick={() =>
                        deleteClasses(item.id, item.gym_id, item.product_id)
                      }
                      ml={3}
                    >
                      Deletar
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
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
    </>
  );
}
