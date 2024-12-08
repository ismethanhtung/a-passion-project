import Role from "./role";
interface User {
    name: string;
    email: string;
    roleId: number;
    id: number;
    role: Role;
}

export default User;
