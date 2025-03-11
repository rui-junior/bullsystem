import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClassData, ModalNewSlostInterface } from "./types/types";
import AddTime from "@/components/icons/AddTime";
import Garbage from "@/components/icons/Garbage";
import useAuth from "../utils/hook/useAuth";

const extractDateTime = (dateTimeString: string) => {
  const cleanedString = dateTimeString.replace(/\[UTC\]$/, ""); // Remove a tag UTC, se houver

  const dateObj = new Date(cleanedString);

  const day = String(dateObj.getDate()).padStart(2, "0"); // Dia com dois dígitos
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Mês (começa do zero)
  const year = String(dateObj.getFullYear()).slice(-2); // Apenas os últimos 2 dígitos do ano

  const hours = String(dateObj.getHours()).padStart(2, "0"); // Pegando o horário local
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const date = `${day}/${month}/${year}`;
  const time = `${hours}:${minutes}`;

  return { date, time };
};

export default function Slots() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenDeleteSlots,
    onOpen: onOpenDeleteSlots,
    onClose: onCloseDeleteSlots,
  } = useDisclosure();

  const [data, setData] = useState<ClassData[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  // const [selectedSlots, setSelectedSlots] = useState<any>(null);
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  const uid = useAuth();
  const router = useRouter();

  const getSlotsQueryString = (month: string) => {
    const [year, monthNumber] = month.split("-").map(Number);

    const firstDay = new Date(year, monthNumber - 1, 1);
    const lastDay = new Date(year, monthNumber, 0);

    const formatDate = (date: Date) => {
      const offset = "+03:00";
      return date.toISOString().replace("Z", offset);
    };

    const from = formatDate(firstDay);
    const to = formatDate(new Date(lastDay.setHours(23, 59, 59)));

    return `slots?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
      to
    )}`;
  };

  useEffect(() => {
    const fetchDataAndSlots = async () => {
      try {
        const response = await fetch("/api/gympass/wellhubclasses");
        const result = await response.json();

        if (Array.isArray(result.classes)) {
          const filteredClasses = result.classes.filter(
            (item: { visible: boolean }) => item.visible === true
          );

          const classesWithSlots = await Promise.all(
            filteredClasses.map(async (classItem: ClassData) => {
              const slotResponse = await fetch(
                "/api/gympass/getlistwellhubslots",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    class_id: classItem.id,
                    gym_id: classItem.gym_id,
                    product_id: classItem.product_id,
                    slots_query: getSlotsQueryString(selectedMonth),
                  }),
                }
              );

              const slotData = await slotResponse.json();

              return {
                ...classItem,
                slots: slotData.results.length > 0 ? slotData.results : [],
              };
            })
          );

          setData(classesWithSlots);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndSlots();
  }, [reloadTrigger, selectedMonth]);

  // useEffect(() => {
  //   const saveDataToFirebase = async () => {
  //     if (data.length === 0) return; // Evita gravações desnecessárias

  //     try {
  //       await setDoc(
  //         doc(database, "admins", `${uid}`, "gympass_slots", id_booking),
  //         {
  //           nome,
  //           email,
  //           gympass_id,
  //           booking_number,
  //           class_id,
  //           gym_id,
  //           slot_id,
  //           booking_id,
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Erro geral ao salvar no Firebase:", error);
  //     }
  //   };

  //   saveDataToFirebase();
  // }, [data]);

  const handleOpenModal = (item: ClassData) => {
    setSelectedClass(item);
    onOpen();
  };

  const closeNewSlotsModal = () => {
    setReloadTrigger((prev) => prev + 1);
    onClose();
  };

  const deleteSlots = async (
    slots_id: number,
    class_id: number,
    gym_id: number,
    uid: string
  ) => {
    try {
      const response = await fetch("/api/gympass/deletewellhubslots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slots_id, class_id, gym_id, uid }),
      });

      const data = await response.json();

      if (!data.error) {
        setReloadTrigger((prev) => prev + 1);
        onCloseDeleteSlots();
        return;
      }

      router.reload();
    } catch (error) {
      console.error("Erro ao deletar slot:", error);
    }
  };

  if (loading)
    return (
      <Flex
        w={"100%"}
        h={["auto"]}
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

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent minWidth="fit-content" h="fit-content">
          <ModalCloseButton color="#fff" />
          <ModalBody>
            {selectedClass && (
              <>
                <ModalNewSlots
                  item={selectedClass}
                  onCancel={closeNewSlotsModal}
                />
              </>
            )}
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
            Mês
          </Text>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            maxW="200px"
            variant={"escolha"}
          />
        </Flex>

        {data.length > 0 ? (
          data.map((item: ClassData) => {
            return (
              <Flex
                flexDirection={["column"]}
                w={["50%"]}
                gap="4px"
                key={item.id}
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
                      <Text
                        bg="cinza"
                        px={["5px"]}
                        h={["25px"]}
                        align={"center"}
                      >
                        Aula
                      </Text>
                      <Text>{item.name}</Text>
                    </Flex>
                    <Flex h={["45px"]} align={"center"} px={"10px"}>
                      <Box
                        bg="cinza"
                        p={["5px"]}
                        cursor={"pointer"}
                        onClick={() => {
                          handleOpenModal(item);
                        }}
                      >
                        <AddTime w={22} h={22} f={1} />
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>

                {item.slots &&
                  item.slots.map((element: any) => (
                    <Flex
                      ml={["25px"]}
                      w={["90%"]}
                      h={"auto"}
                      flexDirection={"row"}
                      key={element.id}
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
                              Data
                            </Text>
                            <Text fontSize={"sm"}>
                              {extractDateTime(element.occur_date).date}
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
                              Horário
                            </Text>
                            <Text fontSize={"sm"}>
                              {extractDateTime(element.occur_date).time}
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
                              nº Vagas
                            </Text>
                            <Text fontSize={"sm"}>{element.total_booked}</Text>
                          </Flex>
                        </Flex>

                        <Flex align={"center"} px={"10px"} gap={"10px"}>
                          <Box
                            bg="cinza"
                            px={["5px"]}
                            onClick={onOpenDeleteSlots}
                            cursor={"pointer"}
                          >
                            <Garbage w={20} h={20} />
                          </Box>
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
                            <Flex
                              mt={"50px"}
                              justifyContent={"center"}
                              // bg="cinza"
                            >
                              <Text
                                fontWeight={"semibold"}
                                fontSize={"lg"}
                                color={"cinza2"}
                              >
                                Tem certeza que gostaria de deletar o Horário?
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
                                deleteSlots(
                                  element.id,
                                  element.class_id,
                                  item.gym_id,
                                  uid
                                )
                              }
                              ml={3}
                            >
                              Deletar
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </Flex>
                  ))}
              </Flex>
            );
          })
        ) : (
          <>não há nada</>
        )}
      </Flex>
    </>
  );
}

const ModalNewSlots: React.FC<ModalNewSlostInterface> = ({
  item,
  onCancel,
}) => {
  const [dateClass, setDateClass] = useState<string>("");
  const [duration, setHourDuration] = useState<number>(60);
  const [capacity, setCapacity] = useState<number>(1);
  const [booked, setBooked] = useState<number>(1);
  const [cancelUntil, setCancelUntil] = useState("");
  const [openBook, setOpenBook] = useState("");
  const [closeBook, setCloseBook] = useState("");
  const [instructor, setInstructor] = useState<string>(" ");
  const [room, setRoom] = useState<string>(" ");
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState({
    openBook: "",
    closeBook: "",
    cancelUntil: "",
  });
  const [disabled, setDisabled] = useState<boolean>(true);
  const timeZoneOffset = "-03:00";
  const router = useRouter();
  const uid = useAuth();

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleDateChange = (field: string, value: string) => {
    // const selectedDate = formatDateForInput(value);

    switch (field) {
      case "dateClass":
        setDateClass(value);
        setDisabled(false);
        break;

      case "openBook":
        if (value > dateClass) {
          showError("openBook", "Data inválida!");
          return;
        }
        setOpenBook(value);
        break;

      case "closeBook":
        if (value > dateClass || value < openBook) {
          showError("closeBook", "Data inválida!");
          return;
        }
        setCloseBook(value);
        break;

      case "cancelUntil":
        setCancelUntil(value);
        break;

      default:
        break;
    }
  };

  const showError = (field: string, message: string) => {
    setErrorMessage((prev) => ({ ...prev, [field]: message }));
    setTimeout(
      () => setErrorMessage((prev) => ({ ...prev, [field]: "" })),
      4000
    );
  };

  const saveSlots = async () => {
    if (
      !dateClass ||
      !duration ||
      !capacity ||
      !booked ||
      !openBook ||
      !closeBook ||
      !cancelUntil
    ) {
      setTimeout(() => {
        setMessage("");
      }, 4000);

      setMessage("Complete corretamente os campos.");
      return;
    }

    const payload: any = {
      uid: uid,
      occur_date: `${dateClass}:00${timeZoneOffset}`,
      length_in_minutes: duration,
      total_capacity: capacity,
      room: room,
      total_booked: booked,
      product_id: item.product_id,
      cancellable_until: `${cancelUntil}:00${timeZoneOffset}`,
      booking_window: {
        opens_at: `${openBook}:00${timeZoneOffset}`,
        closes_at: `${closeBook}:00${timeZoneOffset}`,
      },
      gym_id: item.gym_id,
      class_id: item.id,
    };

    if (instructor.trim() !== "") {
      payload.instructors = [{ name: instructor, substitute: false }];
    }

    try {
      const newSlotsFetch = await fetch("/api/gympass/createnewslots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const response = await newSlotsFetch.json();

      if (!response.error) {
        onCancel();
        return;
      }

      setTimeout(() => {
        setMessage("");
      }, 4000);

      setMessage("Erro interno. Tente novamente.");
      return;
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

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
            Cadastrar Novo Horário
          </Text>
        </Flex>

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
            <Flex w={"90%"}>
              <Text
                fontSize={"lg"}
                fontWeight={"semibold"}
                borderBottom={"2px"}
                borderBottomColor={"roxo1"}
              >
                {item.name}
              </Text>
            </Flex>
            {/* Data da Aula */}

            <Flex
              paddingEnd={"20px"}
              h={"45px"}
              w={["90%"]}
              align={"center"}
              gap={"20px"}
              bg="cinza"
              justifyContent={"space-between"}
            >
              <Flex w={["6px"]} h={"100%"} bg="roxo1">
                &nbsp;
              </Flex>
              <Flex px={["5px"]} h={["25px"]} align={"center"}>
                <Text variant={"textoModal"}>Data da Aula*</Text>
              </Flex>
              <Flex>
                <Input
                  type="datetime-local"
                  value={dateClass}
                  onChange={(e) =>
                    handleDateChange("dateClass", e.target.value)
                  }
                />
              </Flex>
            </Flex>

            {/* Número de Vagas e Duração da Aula em minutos */}
            <Flex w={["90%"]} justifyContent={"space-between"}>
              <Flex
                paddingEnd={"20px"}
                h={"45px"}
                w={["49%"]}
                align={"center"}
                gap={"20px"}
                bg="cinza"
                justifyContent={"space-between"}
              >
                <Flex w={["6px"]} h={"100%"} bg="roxo1">
                  &nbsp;
                </Flex>
                <Flex px={["5px"]} h={["25px"]} align={"center"}>
                  <Text variant={"textoModal"}>Capacidade*</Text>
                </Flex>
                <Flex>
                  <NumberInput
                    defaultValue={1}
                    value={capacity}
                    min={1}
                    w={"80px"}
                    onChange={(valueAsString, valueAsNumber) => {
                      setCapacity(valueAsNumber);
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
              </Flex>

              <Flex
                paddingEnd={"20px"}
                h={"45px"}
                w={["49%"]}
                align={"center"}
                gap={"20px"}
                bg="cinza"
                justifyContent={"space-between"}
              >
                <Flex w={["6px"]} h={"100%"} bg="roxo1">
                  &nbsp;
                </Flex>
                <Flex px={["5px"]} h={["25px"]} align={"center"}>
                  <Text variant={"textoModal"}>nº Vagas*</Text>
                </Flex>
                <Flex>
                  <NumberInput
                    defaultValue={1}
                    value={booked}
                    min={1}
                    max={capacity}
                    w={"80px"}
                    onChange={(valueAsString, valueAsNumber) => {
                      setBooked(valueAsNumber);
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
              </Flex>
            </Flex>

            <Flex w={["90%"]} justifyContent={"space-between"}>
            <Flex
                paddingEnd={"20px"}
                h={"45px"}
                w={["49%"]}
                align={"center"}
                gap={"20px"}
                bg="cinza"
                justifyContent={"space-between"}
              >
                <Flex w={["6px"]} h={"100%"} bg="roxo1">
                  &nbsp;
                </Flex>
                <Flex
                  h={["100%"]}
                  w={"auto"}
                  align={"center"}
                  flexDirection={"row"}
                  gap={"5px"}
                >
                  <Text variant={"textoModal"}>Duração aula</Text>
                  <Text fontWeight={"thin"} fontSize={"sm"}>
                    (min)
                  </Text>
                </Flex>
                <Flex>
                  <NumberInput
                    defaultValue={60}
                    value={duration}
                    min={1}
                    w={"80px"}
                    onChange={(valueAsString, valueAsNumber) => {
                      setHourDuration(valueAsNumber);
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
              </Flex>
              <Flex
                paddingEnd={"20px"}
                h={"45px"}
                w={["49%"]}
                align={"center"}
                gap={"20px"}
                bg="cinza"
                justifyContent={"space-between"}
              >
                <Flex w={["6px"]} h={"100%"} bg="roxo1">
                  &nbsp;
                </Flex>
                <Flex
                  h={["100%"]}
                  w={"auto"}
                  align={"center"}
                  flexDirection={"row"}
                  gap={"5px"}
                >
                  <Text variant={"textoModal"}>Sala</Text>
                </Flex>
                <Flex>
                <Input
                type="Text"
                bg="#fff"
                w={"55%"}
                value={room}
                maxLength={100}
                _focus={{
                  borderColor: "black1",
                }}
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
              />
                </Flex>
              </Flex>
            </Flex>

            {/* Abertura e Fechamento do Agendamento */}
            <Flex
              paddingEnd={"20px"}
              h={"45px"}
              w={["90%"]}
              align={"center"}
              gap={"20px"}
              bg="cinza"
              justifyContent={"space-between"}
            >
              <Flex w={["6px"]} h={"100%"} bg="roxo1">
                &nbsp;
              </Flex>
              <Flex px={["5px"]} h={["25px"]} align={"center"} gap={"5px"}>
                {errorMessage.openBook ? (
                  <Text color="red.500" fontWeight="bold">
                    {errorMessage.openBook}
                  </Text>
                ) : (
                  <>
                    <Text variant={"textoModal"}>Agend.</Text>
                    <Text fontWeight={"thin"} fontSize={"sm"}>
                      Abertura*
                    </Text>
                  </>
                )}
              </Flex>
              <Flex>
                <Input
                  type="datetime-local"
                  disabled={disabled}
                  max={dateClass} // Garante que a data não passe do limite
                  value={openBook}
                  onChange={(e) => handleDateChange("openBook", e.target.value)}
                />
              </Flex>
            </Flex>

            <Flex
              paddingEnd={"20px"}
              h={"45px"}
              w={["90%"]}
              align={"center"}
              gap={"20px"}
              bg="cinza"
              justifyContent={"space-between"}
            >
              <Flex w={["6px"]} h={"100%"} bg="roxo1">
                &nbsp;
              </Flex>
              <Flex px={["5px"]} h={["25px"]} align={"center"} gap={"5px"}>
                {errorMessage.closeBook ? (
                  <Text color="red.500" fontWeight="bold">
                    {errorMessage.closeBook}
                  </Text>
                ) : (
                  <>
                    <Text variant={"textoModal"}>Agend.</Text>
                    <Text fontWeight={"thin"} fontSize={"sm"}>
                      Fechamento*
                    </Text>
                  </>
                )}
              </Flex>
              <Flex>
                <Input
                  type="datetime-local"
                  disabled={disabled}
                  value={closeBook}
                  max={dateClass}
                  min={openBook}
                  onChange={(e) =>
                    handleDateChange("closeBook", e.target.value)
                  }
                />
              </Flex>
            </Flex>

            {/* Limite de Cancelamento */}
            <Flex
              paddingEnd={"20px"}
              h={"45px"}
              w={["90%"]}
              align={"center"}
              gap={"20px"}
              bg="cinza"
              justifyContent={"space-between"}
            >
              <Flex w={["6px"]} h={"100%"} bg="roxo1">
                &nbsp;
              </Flex>
              <Flex px={["5px"]} h={["25px"]} align={"center"}>
                <Text variant={"textoModal"}>Cancelamento até*</Text>
              </Flex>
              <Flex>
                <Input
                  type="datetime-local"
                  disabled={disabled}
                  value={cancelUntil}
                  max={dateClass}
                  min={openBook}
                  onChange={(e) =>
                    handleDateChange("cancelUntil", e.target.value)
                  }
                />
              </Flex>
            </Flex>

            <Flex
              paddingEnd={"20px"}
              h={"45px"}
              w={["90%"]}
              align={"center"}
              gap={"20px"}
              bg="cinza"
              justifyContent={"space-between"}
            >
              <Flex w={["6px"]} h={"100%"} bg="roxo1">
                &nbsp;
              </Flex>
              <Flex px={["5px"]} w={"auto"} h={["25px"]} align={"center"}>
                <Text variant={"textoModal"}>Instrutor</Text>
              </Flex>

              <Input
                type="Text"
                bg="#fff"
                w={"55%"}
                value={instructor}
                maxLength={100}
                _focus={{
                  borderColor: "black1",
                }}
                onChange={(e) => {
                  setInstructor(e.target.value);
                }}
              />
            </Flex>

            {/* Botões */}
            <Flex gap={"10px"}>
              <Button variant="buttonFundoBranco" onClick={saveSlots}>
                Salvar
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};
