import {env} from "../env";
import {
    backInStockNotifications,
    checkout,
    currentCart,
    orders,
    recommendations

} from "@wix/ecom";
import { createClient ,OAuthStrategy,Tokens} from "@wix/sdk";
import {files} from "@wix/media";
import {members} from "@wix/members";
import {redirects} from "@wix/redirects";
import {reviews} from "@wix/reviews";
import {collections, products} from "@wix/stores";

    export function getWixClient(tokens: Tokens | undefined) {
        return createClient({
        modules: {
            backInStockNotifications,
            checkout,
            currentCart,
            orders,
            recommendations,
            files,
            members,
            redirects,
            reviews,
            collections,
            products,
        },
        auth: OAuthStrategy({
            clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID,
            tokens,
        })
    })
}

export type WixClient = ReturnType<typeof getWixClient>;