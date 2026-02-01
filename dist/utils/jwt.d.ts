import jwt, { JwtPayload } from "jsonwebtoken";
export declare const generateToken: (payload: JwtPayload, secret: string, expiresIn: string) => string;
export declare const verifyToken: (token: string, secret: string) => string | jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map