
import { useState } from "react";
import { destroyCookie, setCookie } from "nookies";

import TopBar from "@/components/topbar";
import Content from "@/components/content/Content";
import { firebaseAdmin } from "../firebase/firebaseAdmin";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  // Função que o Pai passa para o Filho
  const handleDataFromChild = (data: string) => {
    setMessage(data);
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

    destroyCookie(context, "token", { path: "/" });

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
}
