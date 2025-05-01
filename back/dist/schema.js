import { Type } from "@sinclair/typebox";
// Request body @userRegister
export const UserRegisterPayloadSchema = Type.Object({
    payload: Type.Object({ hasData: Type.Literal(true), data: Type.Object({ name: Type.String(), email: Type.String(), password: Type.String() }) }),
});
// Request body @userSignin
export const UserSignInPayloadSchema = Type.Object({
    payload: Type.Object({
        hasData: Type.Literal(true),
        data: Type.Object({
            email: Type.String(),
            password: Type.String(),
            bid: Type.Optional(Type.String()),
        }),
    }),
});
