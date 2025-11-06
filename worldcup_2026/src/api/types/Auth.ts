export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    birthDate: string;
    createdAt: string;
}

export interface AuthFiltres {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthDate: string;
}