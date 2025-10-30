import { WixClient } from "../lib/wix.client.base";
import { cache } from "react";
import { collections } from "@wix/stores";


export const getCollectionBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { collection } =
      await wixClient.collections.getCollectionBySlug(slug);

    return collection || null;
  },
);

export const getCollections = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
      .queryCollections()
      .ne("_id", "00000000-000000-000000-000000000001") // all products
      .ne("_id", "d36e49c7-266d-52fd-a8d5-5d86ad7b4366") // featured products
      .find();

    return collections.items;
  },
);