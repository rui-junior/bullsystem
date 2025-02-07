import { firebaseAdmin } from "@/firebase/firebaseAdmin";
import { getDatabase, ref, onValue } from "firebase/database";
import { app, auth, database } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { parseCookies } from "nookies";

import { useEffect, useState } from "react";

import HeadDashboard from "@/components/dashboard/HeadDashboard";
import Menu from "@/components/dashboard/Menu";

import { Flex } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState<JSX.Element>(<></>); //inicia com o componente padrao
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter()

  const handleMenuClick = (component: JSX.Element) => {
    setActiveComponent(component); // Atualiza o componente a ser exibido
  };

  const checkAndCreateUser = async (userId: string) => {
    if (!userId) return;
  
    const userDocRef = doc(database, "admins", userId);
    const userDoc = await getDoc(userDocRef);
  
    if (!userDoc.exists()) {
      // Se o documento não existir, cria um novo
      await setDoc(userDocRef, {
        createdAt: new Date(),
      });

      return

    }
  };

  useEffect(() => {
    const catchUUID = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user?.uid) {
          checkAndCreateUser(user.uid);
        } else {
          router.push("/login")
        }
      });
    };
  
    catchUUID();
  }, []);
  

  // useEffect(() => {
  //   const database = getDatabase(app);
  //   const eventsRef = ref(database, "events");

  //   const unsubscribe = onValue(eventsRef, async (snapshot) => {
  //     const data = snapshot.val();

  //     if (data) {
  //       const formattedData = Object.entries(data).map(([key, value]) => {
  //         if (typeof value === "object" && value !== null) {
  //           return { id: key, ...value };
  //         } else {
  //           return { id: key, value };
  //         }
  //       });

  //       setEvents(formattedData);

  //       // Envia os dados formatados para a API
  //       try {
  //         const response = await fetch("/api/acceptwellhubcheckin", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ events: formattedData }),
  //         });

  //         if (!response.ok) {
  //           console.error("Erro ao enviar dados para a API:", response.statusText);
  //         }
  //       } catch (error) {
  //         console.error("Erro na requisição para a API:", error);
  //       }
  //     }
  //   });

  //   // Limpeza ao desmontar o componente
  //   return () => unsubscribe();
  // }, []);

  return (
    <Flex w={["100vw"]} h={["100vh"]} flexDirection={"row"} bg="cinza">
      <Menu onMenuClick={handleMenuClick} />
      <Flex
        bg="cinza1"
        w={["full"]}
        h={["100vh"]}
        flexDirection={"column"}
        overflowY={"auto"}
      >
        <HeadDashboard />
        {activeComponent}
      </Flex>
    </Flex>
  );
}

export async function getServerSideProps(context: any) {
  const token = context.req.cookies.token;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    return { props: {} };
  } catch (error: any) {
    if (error.code != undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {},
      };
    }
  }
}
