import { border, extendTheme, transition } from "@chakra-ui/react";
import { color, easeInOut } from "framer-motion";

const theme = extendTheme({
  colors: {
    green1: "#88F26B",
    green2: "#7AD95F",
    green3: "#34592A",
    green4: "#66A649",
    black1: "#0D0D0D",
    black2: "#262626",
    roxo1: "#8C3A87",
    roxo2: "#BF54B8",
    roxo3: "#F26DE9",
    roxofundo: "#6E2D69",
    cinza: "#F2F2F2",
    cinza2: "#595856",
    cinza3: "#A6A498",
    cinza4: "#BFBAB0",
    vermelho1: "#F23030",
    vermelho2: "#F20505",
  },

  components: {
    Input: {
      variants: {
        escolha: {
          field: {
            bg: "white",
            rounded: "4px",
            borderLeft: "5px",
            border: '1px',
            borderColor: 'cinza4'
          }
        },
      },
    },
    Button: {
      variants: {
        buttonSalvar: {
          bg: "roxo1",
          color: "white",
          // border: "1px",
          // borderColor: "roxo1",
          _hover: {
            bg: "green1",
            color: "#fff",
            border: "0px",
            transition: { easeInOut },
            // borderColor: "roxo1",
          },
          _active: {
            bg: "roxo2",
          },
          borderRadius: "4px",
        },
        buttonCancelar: {
          bg: "roxo1",
          color: "white",
          border: "1px",
          borderColor: "roxo1",
          _hover: {
            bg: "cinza",
            color: "roxo1",
            border: "1px",
            borderColor: "roxo1",
          },
          _active: {
            bg: "roxo2",
          },
          borderRadius: "4px",
        },
        buttonDeleteModal: {
          bg: "roxo1",
          color: "white",
          border: "1px",
          borderColor: "roxo1",
          fontWeight: "semibold",
          _hover: {
            bg: "#F24B4B",
            color: "#fff",
            border: "1px",
            borderColor: "",
          },
          _active: {
            bg: "roxo2",
          },
          borderRadius: "4px",
        },
        buttonCancelModal: {
          bg: "cinza3",
          color: "white",
          border: "1px",
          fontWeight: "hairline",
          // borderColor: "cinza3",
          _hover: {
            bg: "green",
            color: "#fff",
            border: "1px",
            borderColor: "",
          },
          _active: {
            bg: "roxo2",
          },
          borderRadius: "4px",
        },
        buttonFundoCinza: {
          bg: "roxo1",
          color: "#fff",
          px: "10px",
          py: "5px",
          rounded: "4px",
          _hover: {
            bg: "cinza",
            color: "#fff"
          },

        },
        buttonFundoBranco: {
          bg: "roxo1",
          color: "#fff",
          px: "15px",
          py: "10px",
          rounded: "4px",
          _hover: {
            bg: "#E3E3E3",
            color: "#fff"
          },

        }
      },
      // Estilo padrão
      defaultProps: {
        size: "md",
        variant: "solid",
      },
    },
    Text: {
      variants: {
        textoModal: {
          fontSize: ["sm"],
          fontWeight: ["semibold"],
          color: "black",
        },
      },
    },
  },
});

export default theme;
