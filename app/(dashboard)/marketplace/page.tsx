"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import productsApi, { type SellerProduct } from "@/services/api/productsApi";
import { useQuery } from "@tanstack/react-query";

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["marketplace", { page: 1, limit: 20 }],
    queryFn: () => productsApi.listAll(1, 20),
  });
  const items: SellerProduct[] = data?.data.products ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [items, query]);

  const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL
    ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/`
    : "https://gateway.pinata.cloud/ipfs/";

  return (
    <div className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold">Marketplace</h1>
          <p className="text-sm text-grey-600 mt-1">Discover products from verified sellers.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-[360px] border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10 bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-grey-300 rounded-xl overflow-hidden bg-white">
              <div className="h-[160px] bg-grey-200 animate-pulse" />
              <div className="p-3">
                <div className="h-4 w-40 bg-grey-200 rounded animate-pulse" />
                <div className="mt-2 h-3 w-24 bg-grey-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-grey-300 rounded-xl bg-white p-8 text-center">
          <p className="text-sm text-grey-700">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((p) => {
            const src = p.image_cid?.[0] ? `${gatewayBase}${p.image_cid[0]}` : "";
            return (
              <Link key={p.id} href={`/product/${p.id}`} className="border border-grey-300 rounded-xl overflow-hidden bg-white group block">
                <div className="relative h-[160px]">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={p.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-grey-200" />
                  )}
                  <span className={`absolute left-3 top-3 px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status === "active" ? "Active" : "Pending"}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-grey-900 truncate max-w-[180px]">{p.name}</p>
                    <p className="text-xs text-grey-600 mt-0.5">{p.currency} {Number(p.price).toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


