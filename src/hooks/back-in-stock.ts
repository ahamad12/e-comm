import { wixBrowserClient } from "@/lib/wix.client.browser";
import {
  BackInStockNotificationRequestValues,
  createBackInStockNotificationRequest,
} from "@/wix-api/backInStockNotifications";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface WixErrorDetails {
  details?: {
    applicationError?: {
      code?: string;
    };
  };
}

export function useCreateBackInStockNotificationRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: BackInStockNotificationRequestValues) =>
      createBackInStockNotificationRequest(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      if (
        (error as WixErrorDetails).details?.applicationError?.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "You are already subscribed to this product.",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    },
  });
}