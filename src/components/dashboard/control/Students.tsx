import Edit from "@/components/icons/Edit";
import Garbage from "@/components/icons/Garbage";
import { auth, database } from "@/firebase/firebase";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import FloatingLabelInput from "../utils/FloatingLabel";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { ChangeEvent, useEffect, useState } from "react";

import { StudentsInterface } from "./types/types";
import useAuth from "../utils/hook/useAuth";

let idUserUniversal: string = "";

const validarCPF = (cpfvalue: any): boolean => {
  if (typeof cpfvalue !== "string") return false;

  cpfvalue = cpfvalue.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

  if (cpfvalue.length !== 11 || !!cpfvalue.match(/(\d)\1{10}/)) return false; // Evita CPFs inválidos como "111.111.111-11"

  cpfvalue = cpfvalue.split("").map((el: string | number) => +el); // Converte para array de números

  const rest = (count: number) =>
    ((cpfvalue
      .slice(0, count - 12)
      .reduce(
        (soma: number, el: number, index: number) =>
          soma + el * (count - index),
        0
      ) *
      10) %
      11) %
    10;

  return rest(10) === cpfvalue[9] && rest(11) === cpfvalue[10];
};

const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validarTelefone = (telefone: string): boolean => {
  const dddsValidos = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19", // SP
    "21",
    "22",
    "24", // RJ
    "27",
    "28", // ES
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38", // MG
    "41",
    "42",
    "43",
    "44",
    "45",
    "46", // PR
    "47",
    "48",
    "49", // SC
    "51",
    "53",
    "54",
    "55", // RS
    "61", // DF
    "62",
    "64", // GO
    "63", // TO
    "65",
    "66", // MT
    "67", // MS
    "68", // AC
    "69", // RO
    "71",
    "73",
    "74",
    "75",
    "77", // BA
    "79", // SE
    "81",
    "87", // PE
    "82", // AL
    "83", // PB
    "84", // RN
    "85",
    "88", // CE
    "86",
    "89", // PI
    "91",
    "93",
    "94", // PA
    "92",
    "97", // AM
    "95", // RR
    "96", // AP
    "98",
    "99", // MA
  ];

  telefone = telefone.replace(/\D/g, "");

  if (telefone.length !== 11) return false;

  const ddd = telefone.substring(0, 2);
  const numero = telefone.substring(2);

  if (!dddsValidos.includes(ddd)) return false;
  if (!numero.startsWith("9")) return false;

  return true;
};

const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase() // Garante que o restante das letras estejam minúsculas
    .split(" ") // Separa as palavras pelo espaço
    .filter((word) => word.trim() !== "") // Remove espaços extras
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
    .join(" "); // Junta as palavras novamente
};

export default function Students() {
  const [students, setStudents] = useState<StudentsInterface[]>([]);
  // const [userId, setUserId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentsInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const token = parseCookies().token;
  const router = useRouter();

  const {
    isOpen: isOpenDeleteStudent,
    onOpen: onOpenDeleteStudent,
    onClose: onCloseDeleteStudent,
  } = useDisclosure();
  const {
    isOpen: isOpenNewStudent,
    onOpen: onOpenNewStudent,
    onClose: onCloseNewStudent,
  } = useDisclosure();
  const {
    isOpen: isOpenEditStudent,
    onOpen: onOpenEditStudent,
    onClose: onCloseEditStudent,
  } = useDisclosure();

  const userId = useAuth();
  idUserUniversal = useAuth();

  // useEffect(() => {
  //   if (!token) {
  //     router.reload();
  //     return;
  //   }

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user?.uid) {
  //       setUserId(user.uid);
  //       idUserUniversal = user.uid;
  //     } else {
  //       setLoading(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(
          database,
          "admins",
          userId,
          "students"
        );
        const studentsSnapshot = await getDocs(studentsCollection);

        // const studentsList = studentsSnapshot.docs.map((doc) => ({
        //   // id: doc.id,
        //   // ...doc.data(),
        //   ...doc.data()
        // }));
        const studentsList: StudentsInterface[] = studentsSnapshot.docs.map(
          (doc) => {
            const data = doc.data() as Partial<StudentsInterface>;

            return {
              id: doc.id,
              nome: data.nome ?? "",
              email: (data.email ?? "").toLowerCase(),
              genero: data.genero ?? "",
              telefone: data.telefone ?? 0,
              cpf: data.cpf ?? 0,
              gympass_id: data.gympass_id ?? undefined,
              cep: data.cep ?? undefined,
              logradouro: data.logradouro ?? "",
              complemento: data.complemento ?? "",
              numero: data.numero ?? undefined,
              cidade: data.cidade ?? "",
              estado: data.estado ?? "",
            };
          }
        );

        setStudents(studentsList);
      } catch (error) {
        console.error("Erro ao buscar students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userId, update]);

  const deleteStudent = async (id: number) => {
    try {
      const deleteStudentData = await fetch(
        "/api/dashboard/students/deletestudents",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, id }),
        }
      );

      const response = await deleteStudentData.json();

      if (response.delete) {
        setUpdate(!update);
        onCloseDeleteStudent();
        return;
      }

      router.reload();
    } catch (error) {
      router.reload();
      console.error(error);
    }
  };

  const closeNewStudentModal = () => {
    setUpdate(!update);
    onCloseNewStudent();
  };

  const closeEditStudentModal = () => {
    setUpdate(!update);
    onCloseEditStudent();
  };

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
      <Button
        my={"8px"}
        variant={"buttonFundoBranco"}
        onClick={() => {
          onOpenNewStudent();
        }}
        transition={"ease-in-out"}
      >
        Cadastrar Aluno
      </Button>

      <Modal isOpen={isOpenNewStudent} onClose={onCloseNewStudent} isCentered>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" h="fit-content">
          <ModalCloseButton color="#fff" />
          <ModalBody>
            <NewStudents onCloseNewStudentModal={closeNewStudentModal} />
          </ModalBody>
        </ModalContent>
      </Modal>

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
              Alunos Registrados
            </Text>
          </Flex>
          <Flex
            w={["50%"]}
            h={["100%"]}
            align={["center"]}
            justifyContent={"center"}
          >
            <Text fontSize={["32px"]} textAlign={"center"} color="#fff">
              {students.length}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {students.length > 0 ? (
        students.map((element: any) => (
          <>
            <Flex flexDirection={"column"} w={"80%"} gap="4px" key={element.id}>
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
                      Nome
                    </Text>
                    <Text>{element.nome}</Text>
                  </Flex>
                  <Flex gap={"10px"} w={["40%"]}>
                    <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
                      Email
                    </Text>
                    <Text>{element.email}</Text>
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
                      // onClick={onOpenEditStudent}
                      onClick={() => {
                        setSelectedStudent(element);
                        onOpenEditStudent();
                      }}
                      cursor={"pointer"}
                    >
                      <Edit w={20} h={20} />
                    </Box>
                    <Box
                      bg="cinza"
                      px={["5px"]}
                      onClick={onOpenDeleteStudent}
                      cursor={"pointer"}
                    >
                      <Garbage w={20} h={20} />
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            <Modal
              isOpen={isOpenDeleteStudent}
              onClose={onCloseDeleteStudent}
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
                      Tem certeza que gostaria de deletar o Aluno?
                    </Text>
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant={"buttonCancelModal"}
                    onClick={onCloseDeleteStudent}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant={"buttonDeleteModal"}
                    onClick={() => {
                      element.cpf == ""
                        ? deleteStudent(element.email)
                        : deleteStudent(element.cpf);
                    }}
                    ml={3}
                  >
                    Deletar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal
              isOpen={isOpenEditStudent}
              onClose={onCloseEditStudent}
              isCentered
            >
              <ModalOverlay />
              <ModalContent minWidth="fit-content" h="fit-content">
                <ModalCloseButton color="#fff" />
                <ModalBody>
                  {selectedStudent && (
                    <EditStudent
                      dataStudent={selectedStudent} // Agora o modal recebe os dados corretos
                      closeEditStudent={closeEditStudentModal}
                    />
                  )}
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ))
      ) : (
        <Text>Nenhum estudante cadastrado.</Text>
      )}
    </Flex>
  );
}

const NewStudents = ({
  onCloseNewStudentModal,
}: {
  onCloseNewStudentModal: () => void;
}) => {
  const [messageCEP, setMessageCEP] = useState("");
  const [message, setMessage] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [formValues, setFormValues] = useState({
    id: idUserUniversal,
    nome: "",
    email: "",
    genero: "",
    telefone: "",
    cpf: "",
    gympass_id: "",
    cep: "",
    logradouro: "",
    complemento: "",
    numero: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    if (!formValues.cep) return;

    const cep = formValues.cep.replace(/\D/g, "");

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(async () => {
      if (cep.length < 8) {
        setMessageCEP("Complete o CEP");
        setDisabled(true);
        return;
      }

      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const address = await response.json();

          if (address.erro) {
            setMessageCEP("CEP inexistente");
            setFormValues({
              ...formValues,
              ["logradouro"]: "",
              ["cidade"]: "",
              ["estado"]: "",
              ["complemento"]: "",
              ["numero"]: "",
            });
            setDisabled(true);
          } else {
            setFormValues((prev) => ({
              ...prev,
              estado: address.uf,
              cidade: address.localidade,
              logradouro: address.logradouro,
            }));
            setMessageCEP("");
            setDisabled(false);
          }
        } catch (error) {
          setMessageCEP("Erro ao conectar");
        }
      }
    }, 800);

    setTimeoutId(newTimeoutId);

    return () => clearTimeout(newTimeoutId);
  }, [formValues.cep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (["telefone", "cpf", "cep", "numero", "gympass_id"].includes(name)) {
      value = value.replace(/[^0-9]/g, ""); // Mantém apenas números
    }

    if (name === "cpf" && value.length === 11) {
      if (!validarCPF(value)) {
        setMessage("CPF inválido");

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
          setMessage("");
          setFormValues((prev) => ({ ...prev, ["cpf"]: "" }));
        }, 3000);

        return;
      } else {
        setMessage(""); // Remove erro se CPF for válido
      }
    }

    setFormValues((prev) => ({ ...prev, [name]: value }));

    setMessageCEP("");
    // setDisabled(false);
  };

  const saveStudent = async () => {
    if (
      !formValues.nome ||
      !formValues.email ||
      !formValues.telefone ||
      !formValues.genero ||
      !formValues.cpf
    ) {
      setTimeout(() => {
        setMessage("");
      }, 3000);

      setMessage("Complete corretamente os campos obrigatórios.");
      return;
    }

    if (formValues.email) {
      if (!validarEmail(formValues.email)) {
        setMessage("E-mail Inválido");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      } else {
        setFormValues({
          ...formValues,
          email: formValues.email.trim().toLowerCase(),
        });
        setMessage("");
      }
    }

    if (formValues.nome.length < 5) {
      setMessage("Nome Inválido");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    } else {
      setMessage("");
    }

    if (formValues.telefone) {
      if (!validarTelefone(formValues.telefone)) {
        setMessage("Telefone Inválido");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      } else {
        setMessage("");
      }
    }

    if (formValues.complemento.length > 1) {
      const complementoCapitalized = capitalizeWords(formValues.complemento);
      setFormValues({ ...formValues, ["complemento"]: complementoCapitalized });
    }

    try {
      const response = await fetch("/api/dashboard/students/addnewstudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idUserUniversal,
          nome: capitalizeWords(formValues.nome),
          email: formValues.email.toLowerCase(),
          genero: formValues.genero,
          telefone: formValues.telefone,
          cpf: formValues.cpf,
          gympass_id: formValues.gympass_id,
          cep: formValues.cep,
          logradouro: formValues.logradouro,
          complemento: capitalizeWords(formValues.complemento),
          numero: formValues.numero,
          cidade: formValues.cidade,
          estado: formValues.estado,
        }),
      });

      const data = await response.json();

      if (data.error === false) {
        onCloseNewStudentModal();
      } else {
        setMessage("Erro ao cadastrar aluno.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Erro na requisição.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Flex
      justifyContent={["center"]}
      align={["center"]}
      flexDirection={"column"}
      w={"600px"}
      h={"650px"}
      rowGap={"10px"}
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

      <Flex flexDirection="column" w="full" h="auto" gap={"10px"} mt="25px">
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
          <></>
        )}

        {message == "" ? (
          <>
            <FloatingLabelInput
              label="Nome"
              name="nome"
              type="text"
              value={formValues.nome}
              onChange={handleChange}
            />
            <Flex flexDirection={"row"} gap={"15px"}>
              <FloatingLabelInput
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
              />
              <FloatingLabelInput
                label="Gênero"
                name="genero"
                type="text"
                list="genero-options"
                value={formValues.genero}
                onChange={handleChange}
              />
              <datalist id="genero-options">
                <option value="Masculino" />
                <option value="Feminino" />
              </datalist>
            </Flex>
            <Flex flexDirection={"row"} gap={"15px"}>
              <FloatingLabelInput
                label="Telefone"
                name="telefone"
                type="tel"
                mask="(99) 99999-9999"
                value={formValues.telefone}
                onChange={handleChange}
                // w="95%"
              />
              <FloatingLabelInput
                label="CPF"
                name="cpf"
                type="text"
                mask="999.999.999-99"
                value={formValues.cpf}
                onChange={handleChange}
              />
            </Flex>
            <Flex w={["30%"]}>
              <FloatingLabelInput
                label="Gympass Id"
                name="gympass_id"
                type="text"
                mask="9999999999999"
                value={formValues.gympass_id}
                onChange={handleChange}
                w="95%"
              />
            </Flex>

            <Flex flexDirection={"column"} gap={"10px"} my={"20px"}>
              <Flex flexDirection={"row"} columnGap={"15px"} align={"center"}>
                <Flex w={"30%"}>
                  <FloatingLabelInput
                    label="CEP"
                    name="cep"
                    type="text"
                    mask="99999-999"
                    // w="100%"
                    value={formValues.cep}
                    onChange={handleChange}
                  />
                </Flex>
                {messageCEP && (
                  <Flex
                    align={"center"}
                    h={"auto"}
                    bg="vermelho1"
                    rounded={"4px"}
                  >
                    <Text px={"15px"} py={"10px"} color={"#fff"}>
                      {messageCEP}
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex flexDirection={"row"} gap={"15px"}>
                <FloatingLabelInput
                  label="Logradouro"
                  name="logradouro"
                  type="text"
                  value={formValues.logradouro}
                  onChange={handleChange}
                  disabled={true}
                />
              </Flex>
              <Flex flexDirection={"row"} gap={"15px"}>
                <FloatingLabelInput
                  label="Complemento"
                  name="complemento"
                  type="text"
                  value={formValues.complemento}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                  disabled={isDisabled}
                />

                <FloatingLabelInput
                  label="Nº"
                  name="numero"
                  type="text"
                  value={formValues.numero}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                  disabled={isDisabled}
                />
              </Flex>
              <Flex flexDirection={"row"} gap={"15px"}>
                <FloatingLabelInput
                  label="Cidade"
                  name="cidade"
                  type="text"
                  value={formValues.cidade}
                  onChange={handleChange}
                  disabled={true}
                />
                <FloatingLabelInput
                  label="Estado"
                  name="estado"
                  type="text"
                  value={formValues.estado}
                  onChange={handleChange}
                  disabled={true}
                />
              </Flex>
            </Flex>
            <Flex justifyContent={"center"} align={"center"}>
              <Button
                variant={"buttonFundoBranco"}
                onClick={() => {
                  saveStudent();
                }}
              >
                Cadastrar
              </Button>
            </Flex>
          </>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

const EditStudent = ({
  dataStudent,
  closeEditStudent,
}: {
  dataStudent: any;
  closeEditStudent: () => void;
}) => {
  const [messageCEP, setMessageCEP] = useState("");
  const [message, setMessage] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [formValues, setFormValues] = useState({
    id: idUserUniversal,
    nome: dataStudent.nome,
    email: dataStudent.email,
    genero: dataStudent.genero,
    telefone: dataStudent.telefone,
    cpf: dataStudent.cpf,
    gympass_id: dataStudent.gympass_id,
    cep: dataStudent.cep,
    logradouro: dataStudent.logradouro,
    complemento: dataStudent.complemento,
    numero: dataStudent.numero,
    cidade: dataStudent.cidade,
    estado: dataStudent.estado,
  });

  useEffect(() => {
    if (!formValues.cep) return;

    const cep = formValues.cep.replace(/\D/g, "");

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(async () => {
      if (cep.length < 8) {
        setMessageCEP("Complete o CEP");
        setDisabled(true);
        return;
      }

      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const address = await response.json();

          if (address.erro) {
            setMessageCEP("CEP inexistente");
            setFormValues({
              ...formValues,
              ["logradouro"]: "",
              ["cidade"]: "",
              ["estado"]: "",
              ["complemento"]: "",
              ["numero"]: "",
            });
            setDisabled(true);
          } else {
            setFormValues((prev) => ({
              ...prev,
              estado: address.uf,
              cidade: address.localidade,
              logradouro: address.logradouro,
            }));
            setMessageCEP("");
            setDisabled(false);
          }
        } catch (error) {
          setMessageCEP("Erro ao conectar");
        }
      }
    }, 800);

    setTimeoutId(newTimeoutId);

    return () => clearTimeout(newTimeoutId);
  }, [formValues.cep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (["telefone", "cpf", "cep", "numero", "gympass_id"].includes(name)) {
      value = value.replace(/[^0-9]/g, ""); // Mantém apenas números
    }

    if (name === "cpf" && value.length === 11) {
      if (!validarCPF(value)) {
        setMessage("CPF inválido");

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
          setMessage("");
          setFormValues((prev) => ({ ...prev, ["cpf"]: "" }));
        }, 3000);

        return;
      } else {
        setMessage("");
      }
    }

    setFormValues((prev) => ({ ...prev, [name]: value }));

    setMessageCEP("");
    // setDisabled(false);
  };

  const saveEditStudent = async () => {
    if (
      !formValues.nome ||
      !formValues.email ||
      !formValues.telefone ||
      !formValues.genero ||
      !formValues.cpf
    ) {
      setTimeout(() => {
        setMessage("");
      }, 3000);

      setMessage("Complete corretamente os campos obrigatórios.");
      return;
    }

    if (formValues.email) {
      if (!validarEmail(formValues.email)) {
        setMessage("E-mail Inválido");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      } else {
        setFormValues({
          ...formValues,
          email: formValues.email.trim().toLowerCase(),
        });
        setMessage("");
      }
    }

    if (formValues.nome.length < 5) {
      setMessage("Nome Inválido");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    } else {
      setMessage("");
    }

    if (formValues.telefone) {
      if (!validarTelefone(formValues.telefone)) {
        setMessage("Telefone Inválido");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      } else {
        setMessage("");
      }
    }

    if (formValues.complemento.length > 1) {
      const complementoCapitalized = capitalizeWords(formValues.complemento);
      setFormValues({ ...formValues, ["complemento"]: complementoCapitalized });
    }

    try {
      const response = await fetch("/api/dashboard/students/editstudent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idUserUniversal,
          nome: capitalizeWords(formValues.nome),
          email: formValues.email.toLowerCase(),
          genero: formValues.genero,
          telefone: formValues.telefone,
          cpf: formValues.cpf,
          gympass_id: formValues.gympass_id,
          cep: formValues.cep,
          logradouro: formValues.logradouro,
          complemento: capitalizeWords(formValues.complemento),
          numero: formValues.numero,
          cidade: formValues.cidade,
          estado: formValues.estado,
        }),
      });

      const data = await response.json();

      if (!data.error) {
        closeEditStudent();
      } else {
        setMessage("Erro ao cadastrar aluno.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Erro interno ao servidor.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Flex
      justifyContent={["center"]}
      align={["center"]}
      flexDirection={"column"}
      w={"600px"}
      h={"650px"}
      rowGap={"10px"}
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
          Atualizar Cadastro
        </Text>
      </Flex>

      <Flex flexDirection="column" w="full" h="auto" gap={"10px"} mt="25px">
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
            <FloatingLabelInput
              label="Nome"
              name="nome"
              type="text"
              value={formValues.nome}
              onChange={handleChange}
            />
            <Flex flexDirection={"row"} gap={"15px"}>
              <FloatingLabelInput
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
              />
              <FloatingLabelInput
                label="Gênero"
                name="genero"
                type="text"
                list="genero-options"
                value={formValues.genero}
                onChange={handleChange}
              />
              <datalist id="genero-options">
                <option value="Masculino" />
                <option value="Feminino" />
              </datalist>
            </Flex>
            <Flex flexDirection={"row"} gap={"15px"}>
              <FloatingLabelInput
                label="Telefone"
                name="telefone"
                type="tel"
                mask="(99) 99999-9999"
                value={formValues.telefone}
                onChange={handleChange}
                // w="95%"
              />
              <FloatingLabelInput
                label="CPF"
                name="cpf"
                type="text"
                mask="999.999.999-99"
                value={formValues.cpf}
                onChange={handleChange}
              />
            </Flex>
            <Flex w={["30%"]}>
              <FloatingLabelInput
                label="Gympass Id"
                name="gympass_id"
                type="text"
                mask="9999999999999"
                value={formValues.gympass_id}
                onChange={handleChange}
                // w="95%"
              />
            </Flex>

            <Flex flexDirection={"column"} gap={"10px"} my={"20px"}>
              <Flex flexDirection={"row"} columnGap={"15px"} align={"center"}>
                <Flex w={"30%"}>
                  <FloatingLabelInput
                    label="CEP"
                    name="cep"
                    type="text"
                    mask="99999-999"
                    w="100%"
                    value={formValues.cep}
                    onChange={handleChange}
                  />
                </Flex>
                {messageCEP && (
                  <Flex
                    align={"center"}
                    h={"auto"}
                    bg="vermelho1"
                    rounded={"4px"}
                  >
                    <Text px={"15px"} py={"10px"} color={"#fff"}>
                      {messageCEP}
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex flexDirection={"row"} gap={"15px"}>
                <FloatingLabelInput
                  label="Logradouro"
                  name="logradouro"
                  type="text"
                  value={formValues.logradouro}
                  onChange={handleChange}
                  disabled={true}
                />
              </Flex>
              <Flex flexDirection={"row"} gap={"15px"}>
                <FloatingLabelInput
                  label="Complemento"
                  name="complemento"
                  type="text"
                  value={formValues.complemento}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                  disabled={isDisabled}
                />

                <FloatingLabelInput
                  label="Nº"
                  name="numero"
                  type="text"
                  value={formValues.numero}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                  disabled={isDisabled}
                />
              </Flex>
              <Flex flexDirection={"row"} gap={"15px"}>
                <FloatingLabelInput
                  label="Cidade"
                  name="cidade"
                  type="text"
                  value={formValues.cidade}
                  onChange={handleChange}
                  disabled={true}
                />
                <FloatingLabelInput
                  label="Estado"
                  name="estado"
                  type="text"
                  value={formValues.estado}
                  onChange={handleChange}
                  disabled={true}
                />
              </Flex>
            </Flex>
            <Flex justifyContent={"center"} align={"center"}>
              <Button
                variant={"buttonFundoBranco"}
                onClick={() => {
                  saveEditStudent();
                }}
              >
                Atualizar
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
