import { WixClient } from "@/lib/wix.client.base";

interface WixErrorDetails {
  details?: {
    applicationError?: {
      code?: string;
    };
  };
}

export async function getOrder(wixClient: WixClient, orderId: string) {
  try {
    return await wixClient.orders.getOrder(orderId);
  } catch (error) {
    if ((error as WixErrorDetails).details?.applicationError?.code === "NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
}

export interface GetUserOrderFilters {
  limit?: number;
  cursor?: string | null;
}

export async function getUserOrders(
  wixClient: WixClient,
  { limit, cursor }: GetUserOrderFilters,
) {
  return wixClient.orders.searchOrders({
    cursorPaging: {
      limit,
      cursor,
    },
  });
}