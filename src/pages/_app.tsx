// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Encode_Sans } from 'next/font/google'
import theme from "../theme";

const encode = Encode_Sans({ subsets: ['latin'] })


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Flex direction={'column'} w={'100vw'} h={'100vh'} className={encode.className}>
        <Component {...pageProps} />
      </Flex>
    </ChakraProvider>

  )
}
