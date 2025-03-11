import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase"; // Certifique-se de que o caminho está correto

const useAuth = () => {
  const [uid, setUid] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        setUid(user.uid);
      } else {
        router.reload(); // Recarrega se não estiver autenticado
      }
    });

    return () => unsubscribeAuth(); // Remove o observer na desmontagem
  }, []);

  return uid; // Retorna o UID do usuário autenticado
};

export default useAuth;