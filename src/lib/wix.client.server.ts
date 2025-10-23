import { cookies } from "next/headers";
import { getWixClient } from "./wix.client.base";
import { Tokens } from "@wix/sdk";
import { WIX_SESSION_COOKIE } from "./constants";
import { cache } from "react";

export const getWixServerClient = cache(async () => {
    let tokens: Tokens | undefined;

    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(WIX_SESSION_COOKIE);
        tokens = JSON.parse(sessionCookie?.value || "{}");
    } catch (error) {
        console.error("Failed to parse WIX_SESSION_COOKIE", error);
    }
    
    return getWixClient(tokens);
});