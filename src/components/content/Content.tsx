import { Flex } from "@chakra-ui/react"
import { useState } from "react";
import LoginPage from './login/LoginPage'

interface ChildProps {
    content: string;  // A prop que o filho receberá
  }

export default function Content({ content }: ChildProps) {

    return(
        <>
            {/* {content === "LoginPage" && <LoginPage />} */}
            {content === "" && <>pagina inicial</>}
        </>
    )

}