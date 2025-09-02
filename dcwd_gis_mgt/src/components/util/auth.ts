import { jwtDecode } from "jwt-decode";

export const getTokenExpiration = (token: string): number | null => {
    try {
        const decoded: {exp: number} = jwtDecode(token);
        return decoded.exp * 1000;
    } catch {
        return null;
    }
}