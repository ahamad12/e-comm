import Image from "next/image";
import banner from "@/assests/banner.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { delay } from "@/lib/utils";
import { Suspense } from "react";
import Products from "@/components/Products";
import { Skeleton } from "@/components/ui/skeleton";
import { queryProducts } from "@/wix-api/prodcuts";
import { getCollectionBySlug } from "@/wix-api/collections";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <div className="bg-secondary flex items-center md:h-96">
        <div className="space-y-7 px-10 text-center md:w-1/2">
          <h1 className="text-3xl font-bold md:text-4xl">
            Fill the void in your heart
          </h1>
          <p className="text-lg">
            Tough day? Credit card maxed out? Buy some expensive stuff and
            become happy again
          </p>
          <Button asChild>
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden h-full md:block md:w-1/2">
          <Image
            src={banner}
            alt="Flow Shop Banner"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent"></div>
        </div>
      </div>
      <Suspense fallback={<LoadindSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  await delay(1000);

  const collection = await getCollectionBySlug("featured-products");

  if (!collection?._id) {
    return null;
  }

  const featuredProducts = await queryProducts({collectionIds: collection._id});

  if(!featuredProducts.items.length){
    return null;
  }

  return <div className="space-y-5">
    <h2 className="text-2xl font-bold">Featured Products</h2>  
    <div className="flex gap-5 grid-cols-2 flex-col sm:grid md:grid-cols-3 lg:grid-cols-4 ">
      {featuredProducts.items.map((product) => (
        <Products key={product._id} product={product} />
      ))}
    </div>
  </div>
}

function LoadindSkeleton(){
  return <div className="flex gap-5 grid-cols-2 flex-col sm:grid md:grid-cols-3 lg:grid-cols-4 pt-12">
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} className="h-[26rem] w-full"/>
    ))}
  </div>
}