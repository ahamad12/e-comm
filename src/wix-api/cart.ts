import  {getWixClient} from "../wix.client.base";

interface WixErrorDetails {
  details?: {
    applicationError?: {
      code?: string;
    };
  };
}

export async function getCart() {
  const wixClient = getWixClient();

  try {
    return await wixClient.currentCart.getCurrentCart();
  } catch (error) {
    const wixError = error as WixErrorDetails;
    if (
      wixError.details?.applicationError?.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
}