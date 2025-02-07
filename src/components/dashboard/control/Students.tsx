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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

export default function Students() {
  const [students, setStudents] = useState<any>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Captura o usuário autenticado e define o userId
  useEffect(() => {
    if (!token) {
      router.reload();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        setUserId(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Busca os estudantes quando o userId estiver disponível
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

        const studentsList = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentsList);
      } catch (error) {
        console.error("Erro ao buscar students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userId]); // Executa apenas quando userId estiver definido

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
        setUserId("");
        onCloseDeleteStudent();
        return;
      }

      router.reload();
    } catch (error) {
      router.reload();
      console.error(error);
    }
  };

  const newStudent = async () => {
    console.log("novo aluno");
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
        onClick={onOpenNewStudent}
        transition={"ease-in-out"}
      >
        Cadastrar Aluno
      </Button>

      {students.length > 0 ? (
        students.map((element: any) => (
          <>
            <Flex flexDirection={"column"} w={"50%"} gap="4px" key={element.id}>
              <Flex h={"auto"} flexDirection={"row"}>
                <Flex w={"6px"} height={"full"} bg="roxo1">
                  &nbsp;
                </Flex>
                <Flex
                  bg="#fff"
                  w={"full"}
                  h={"45px"}
                  justifyContent={"space-between"}
                  align={"center"}
                  px={"8px"}
                  rounded={"0 8px 8px 0px"}
                >
                  <Flex gap={"10px"}>
                    <Text bg="cinza" px={"5px"} h={"25px"} align={"center"}>
                      Nome
                    </Text>
                    <Text>{element.name}</Text>
                  </Flex>
                  <Flex h={"45px"} align={"center"} px={"10px"} gap={["10px"]}>
                    <Box
                      bg="cinza"
                      px={["5px"]}
                      // onClick={() => {
                      //   setEditingId(item.id);
                      //   setEditedValues({
                      //     name: item.name,
                      //     description: item.description,
                      //     product_id: item.product_id,
                      //   });
                      // }}
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
                    onClick={() => deleteStudent(element.id)}
                    ml={3}
                  >
                    Deletar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal
              isOpen={isOpenNewStudent}
              onClose={onCloseNewStudent}
              isCentered
            >
              <ModalOverlay />
              <ModalContent minWidth="fit-content" h="fit-content">
                <ModalCloseButton color="#fff" />
                <ModalBody>
                  <NewStudents />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ))
      ) : (
        <Text>Nenhum estudante encontrado.</Text>
      )}
    </Flex>
  );
}

const NewStudents = () => {
  return (
    <>
      <Flex
        justifyContent={["center"]}
        align={["center"]}
        flexDirection={"column"}
        w={"600px"}
        h={"600px"}
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

        <MyForm />
      </Flex>
    </>
  );
};

const FloatingLabelInput = ({
  label,
  mask,
  type,
  name,
  value,
  onChange,
  ...props
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl w="full" position="relative" mt={4}>
      <FormLabel
        position="absolute"
        top={isFocused || value ? "-6px" : "50%"}
        left="12px"
        transform={
          isFocused || value ? "scale(0.9) translateY(0)" : "translateY(-50%)"
        }
        transformOrigin="left top"
        fontSize={isFocused || value ? "12px" : "16px"}
        transition="all 0.2s ease-out"
        bg="cinza"
        px={1}
      >
        {label}
      </FormLabel>

      {mask ? (
        <Flex
          h={"45px"}
          align={"center"}
          bg="cinza"
          justifyContent={"space-between"}
          {...props}
        >
          <Flex w={["6px"]} h={"100%"} bg="roxo1">
            &nbsp;
          </Flex>
          <Flex
            justifyContent={"center"}
            align={"center"}
            gap={"15px"}
            w={"full"}
          >
            <Input
              as={InputMask}
              mask={mask}
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              bg="transparent"
              _focus={{ outline: "none", boxShadow: "none" }}
              border="none"
              type={type}
            />
          </Flex>
        </Flex>
      ) : (
        <Flex
          h={"45px"}
          // w={["90%"]}
          align={"center"}
          bg="cinza"
          {...props}
        >
          <Flex w={["6px"]} h={"100%"} bg="roxo1">
            &nbsp;
          </Flex>
          <Flex
            justifyContent={"center"}
            align={"center"}
            w={"full"}
            h={"full"}
          >
            <Input
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              bg="transparent"
              _focus={{ outline: "none", boxShadow: "none" }}
              border="none"
              type={type}
            />
          </Flex>
        </Flex>
      )}
    </FormControl>
  );
};

const MyForm = () => {
  const [formValues, setFormValues] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    endereco: "",
  });

  const handleChange = (e: any) => {
    let { name, value } = e.target;

    if (value.replace(/[^0-9]/g, "").length === 0) {
      value = "";
    }

    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Flex flexDirection="column" w="full" h="auto">
      <FloatingLabelInput
        label="Nome"
        name="nome"
        type="text"
        value={formValues.nome}
        onChange={handleChange}
      />
      <Flex flexDirection={'row'} gap={'15px'}>
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
          // w="95%"
        />
      </Flex>
      <FloatingLabelInput
        label="Endereço"
        name="endereço"
        type="text"
        value={formValues.endereco}
        onChange={handleChange}
      />
    </Flex>
  );
};
