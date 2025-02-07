// import localFont from "next/font/local";
// import styles from "@/styles/Home.module.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

import { useState } from "react";
import { destroyCookie, setCookie } from "nookies";

import TopBar from "@/components/topbar";
import Content from "@/components/content/Content";
import { firebaseAdmin } from "../firebase/firebaseAdmin";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  // Função que o Pai passa para o Filho
  const handleDataFromChild = (data: string) => {
    setMessage(data); // Atualiza o estado com os dados enviados pelo Filho
  };

  return (
    <>
      <TopBar sendDataToParent={handleDataFromChild} />
      <Content content={message} />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const token = context.req.cookies?.token;

  try {
    // Verifica se o token existe antes de tentar decodificar
    if (!token) {
      destroyCookie(context, "token", { path: "/" });
      return { props: {} };
    }

    // Tenta verificar o token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };

  } catch (error: any) {
    // Lógica para tratar erros do Firebase ou token inválido
    // console.log("Erro ao verificar o token:", error);

    destroyCookie(context, "token", { path: "/" });

    return {
      redirect: {
        destination: "/login", // Redireciona para a página de login
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
}
