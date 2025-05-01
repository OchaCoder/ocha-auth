export declare const generateStaggeredExpiration: () => {
    rt: {
        pasetoExpiresIn: string;
        redisSetEX: number;
        cookieMaxAge: number;
    };
    at: {
        pasetoExpiresIn: string;
        cookieMaxAge: number;
    };
};
