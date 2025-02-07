// components/Login.tsx
import { useState, useEffect, useRef } from 'react';
import { Input, Button, Flex } from '@chakra-ui/react';

const RightSide = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [username, setUsername] = useState('');
  const [showRegisterButton, setShowRegisterButton] = useState(true); // Controla a visibilidade do botão 'Cadastrar'
  const [placeholder, setPlaceholder] = useState('Já sou cliente'); // Estado para o placeholder
  
  const inputRef = useRef<HTMLInputElement>(null);  // Referência para o input
  const containerRef = useRef<HTMLDivElement>(null); // Referência para o contêiner do input e do botão

  // Detecta clique fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsClicked(false);  // Retrair o input quando clicar fora
        setShowRegisterButton(true); // Exibir o botão 'Cadastrar' novamente
        setPlaceholder('Já sou cliente'); // Resetando o placeholder
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Escuta cliques fora

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Limpa o evento ao desmontar o componente
    };
  }, []);

  const handleInputClick = () => {
    setIsClicked(true);  // Expande o input ao clicar dentro
    setShowRegisterButton(false);  // Esconde o botão 'Cadastrar'
    setPlaceholder('Usuário');  // Muda o placeholder para 'Usuário' ao clicar no input
  };

  const handleLogin = () => {
    alert(`Bem-vindo, ${username}!`);
    setIsClicked(false);  // Retrage o campo após o login
    setUsername('');
    setShowRegisterButton(true); // Exibe o botão 'Cadastrar' novamente após o login
    setPlaceholder('Já sou cliente'); // Resetando o placeholder
  };

  return (
    <Flex justify="center" align="center" direction="column" minHeight="100vh">
      <Flex align="center" justify="center" gap={2} ref={containerRef}>
        <Input
          ref={inputRef}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onClick={handleInputClick}
          placeholder={placeholder} // O placeholder agora depende do estado
          size="md"
          width={isClicked ? '300px' : '150px'} // Se clicado, o input se expande
          transition="width 0.3s ease"
        />
        {isClicked && (
          <Button onClick={handleLogin} colorScheme="blue" size="md">
            Login
          </Button>
        )}
        {showRegisterButton && !isClicked && (
          <Flex>Assinar</Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default RightSide;
