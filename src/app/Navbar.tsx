import Image from "next/image";
import Link from "next/link";
import logo from "@/assests/logo.png";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix.client.server";
import ShoppingCartButton from "./ShoppingCartButton";

export default async function Navbar() {
  const wixClient = await getWixServerClient();
  const cart = await getCart(wixClient);

 

  return (
    <header className="bg-background shadow-sm">
      <div className="max-w-7xl mx-auto p-5 flex items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-4">
          <Image src={logo} alt="Flow Shop logo" width={40} height={40} />
          <span className="text-xl font-bold">Flow Shop</span>
        </Link>
          <ShoppingCartButton initialData={cart}/>
      </div>
    </header>
  );
}