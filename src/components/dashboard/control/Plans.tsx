import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FloatingLabelInput from "../utils/FloatingLabel";
import useAuth from "../utils/hook/useAuth";

import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase/firebase";
import Garbage from "@/components/icons/Garbage";
import { useRouter } from "next/router";

export default function Plans() {
  const [update, setUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<
    { id: string; nome: string; dias: string; valor: string; obs?: string }[]
  >([]);

  const {
    isOpen: isOpenNewPlan,
    onOpen: onOpenNewPlan,
    onClose: onCloseNewPlan,
  } = useDisclosure();

  const {
    isOpen: isOpenDeletePlan,
    onOpen: onOpenDeletePlan,
    onClose: onCloseDeletePlan,
  } = useDisclosure();

  const uid = useAuth();
  const router = useRouter()

  const newPlanFunction = () => {
    setUpdate((prev) => !prev);
    onCloseNewPlan();
  };

  const deletePlan = async (id: string) => {

    try {
      const fetchDeletePlan = await fetch(
        "/api/dashboard/plans/deleteplan",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, id }),
        }
      );

      const response = await fetchDeletePlan.json();

      if (response.delete) {
        setUpdate(!update);
        onCloseDeletePlan();
        return;
      }

      router.reload();
    } catch (error) {
      router.reload();
      console.error(error);
    }

  }

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);

      try {
        const plansCollection = collection(database, "admins", uid, "plans");
        const plansSnapshot = await getDocs(plansCollection);

        const plansList = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as {
          id: string;
          nome: string;
          dias: string;
          valor: string;
          obs?: string;
        }[];

        setPlans(plansList);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [uid, update]);

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
          onClick={onOpenNewPlan}
          transition="ease-in-out"
        >
          Cadastrar Plano
        </Button>

        <Modal isOpen={isOpenNewPlan} onClose={onCloseNewPlan} isCentered>
          <ModalOverlay />
          <ModalContent minWidth="fit-content" h="fit-content">
            <ModalCloseButton color="#fff" />
            <ModalBody>
              <NewPlan onCloseNewPlanFunction={newPlanFunction} />
            </ModalBody>
          </ModalContent>
        </Modal>

        {plans.length > 0 ? (
          plans.map((plan) => {
            return (
              <>
                <Flex
                  flexDirection={"column"}
                  w={"80%"}
                  gap="4px"
                  key={plan.id}
                >
                  <Flex h={"auto"} flexDirection={"row"}>
                    <Flex w={"6px"} height={"full"} bg={["roxo1"]}>
                      &nbsp;
                    </Flex>
                    <Flex
                      bg="#fff"
                      w={"full"}
                      h={"45px"}
                      // justifyContent={"space-between"}
                      align={"center"}
                      px={"8px"}
                      rounded={"0 8px 8px 0px"}
                    >
                      <Flex gap={"10px"} w={["40%"]}>
                        <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
                          Plano
                        </Text>
                        <Text>{plan.nome}</Text>
                      </Flex>
                      <Flex gap={"10px"} w={["40%"]}>
                        <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
                          Valor R$
                        </Text>
                        <Text>{plan.valor}</Text>
                      </Flex>
                      <Flex gap={"10px"} w={["40%"]}>
                        <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
                          Período
                        </Text>
                        <Text>{plan.dias}</Text>
                        <Text>dias</Text>
                      </Flex>
                      <Flex
                        h={"45px"}
                        justifyContent={"right"}
                        align={"center"}
                        px={"10px"}
                        gap={["10px"]}
                        w={["20%"]}
                      >
                        <Box
                          bg="cinza"
                          px={["5px"]}
                          onClick={onOpenDeletePlan}
                          cursor={"pointer"}
                        >
                          <Garbage w={20} h={20} />
                        </Box>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>

                <Modal
                  isOpen={isOpenDeletePlan}
                  onClose={onCloseDeletePlan}
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
                          Tem certeza que gostaria de deletar o Plano?
                        </Text>
                      </Flex>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant={"buttonCancelModal"}
                        onClick={onCloseDeletePlan}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant={"buttonDeleteModal"}
                        onClick={() => {deletePlan(plan.id)}}
                        ml={3}
                      >
                        Deletar
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            );
          })
        ) : (
          <>Nenhuma plano Cadastrado</>
        )}
      </Flex>
    </>
  );
}

const NewPlan = ({
  onCloseNewPlanFunction,
}: {
  onCloseNewPlanFunction: () => void;
}) => {
  const [message, setMessage] = useState<string>("");
  const [formValues, setFormValues] = useState({
    nome: "",
    dias: "",
    valor: "",
    obs: "",
  });

  const uid = useAuth();

  const savePlan = async () => {
    if (!formValues.nome || !formValues.dias || !formValues.valor) {
      setMessage("Complete os Itens obrigatórios");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    try {
      const newPlanFetch = await fetch("/api/dashboard/plans/addnewplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          nome: formValues.nome,
          dias: Number(formValues.dias), // Converte para número
          valor: Number(formValues.valor), // Converte para número
          obs: formValues.obs,
        }),
      });

      const response = await newPlanFetch.json();

      if (response.error) {
        setMessage(response.error);

        setTimeout(() => {
          setMessage("");
          setFormValues((prev) => ({ ...prev }));
        }, 3000);

        return;
      }

      onCloseNewPlanFunction();
    } catch (error) {
      setMessage("Erro ao salvar o Plano. Tente novamente");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Flex
      justifyContent="center"
      align="center"
      flexDirection="column"
      w="600px"
      h="450px"
      rowGap="10px"
    >
      <Flex
        w="100%"
        h="45px"
        position="absolute"
        top="0px"
        align="center"
        px="50px"
        zIndex={-1}
        bg="roxo1"
      >
        <Text color="#fff" fontWeight="bold" fontSize="md">
          Cadastrar Novo Plano
        </Text>
      </Flex>
      <Flex flexDirection="column" w="full" h="auto" gap="10px" mt="25px">
        {message ? (
          <Flex justifyContent="center" align="center">
            <Flex
              bg="roxo1"
              px="25px"
              py="5px"
              mt="15px"
              rounded="3px"
              justifyContent="center"
              align="center"
            >
              <Text fontSize="sm" color="#fff" fontWeight="semibold">
                {message}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <>
            <FloatingLabelInput
              label="Nome"
              name="nome"
              type="text"
              value={formValues.nome}
              onChange={(e) =>
                setFormValues({ ...formValues, nome: e.target.value })
              }
            />
            <Flex w="100%" gap="10px">
              <FloatingLabelInput
                label="Dias em Vigor"
                name="dias"
                type="number"
                value={formValues.dias}
                onChange={(e) =>
                  setFormValues({ ...formValues, dias: e.target.value })
                }
              />
              <FloatingLabelInput
                label="Valor do Plano (R$)"
                name="valor"
                type="number"
                value={formValues.valor}
                onChange={(e) =>
                  setFormValues({ ...formValues, valor: e.target.value })
                }
              />
            </Flex>
            <FloatingLabelInput
              label="Observações"
              name="obs"
              type="text"
              value={formValues.obs}
              onChange={(e) =>
                setFormValues({ ...formValues, obs: e.target.value })
              }
            />
            <Flex justifyContent="center" align="center">
              <Button variant="buttonFundoBranco" onClick={savePlan}>
                Cadastrar
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
