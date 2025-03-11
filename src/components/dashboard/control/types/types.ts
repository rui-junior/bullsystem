 export interface StudentsInterface {
    id: number | string;
    nome: string;
    email: string;
    genero: string;
    telefone: number;
    cpf: number;
    gympass_id?: number;
    cep?: number;
    logradouro?: string;
    complemento?: string;
    numero?: number;
    cidade?: string;
    estado?: string
}