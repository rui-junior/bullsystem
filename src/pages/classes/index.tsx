import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";


export default function () {
  const [classes, setClasses] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/classes"); // Agora fazemos a requisição para a nossa API no servidor
      const data = await response.json();

      //   setClasses(data.classes); // Salvando os dados no estado
      if (JSON.stringify(classes) !== JSON.stringify(data.classes)) {
        setClasses(data.classes);
      }

      setLoading(false); // Atualizando o estado de carregamento para false
      
    } catch (error: any) {
      setError(error); // Armazenando o erro no estado
      setLoading(false); // Atualizando o estado de carregamento para false
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Flex direction={"row"} justifyContent={"center"}>
        <Flex w={"50%"}>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            classes.map((element: any) => {
              console.log(element);
            })
          )}
        </Flex>
      </Flex>
    </>
  );
}
