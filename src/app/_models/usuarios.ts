import { Permissao } from './permissao';

export class Usuarios {
    id?: string;
    nome?: string;
    sobrenome?: string;
    email?: string;
    permissao?: Permissao;
}