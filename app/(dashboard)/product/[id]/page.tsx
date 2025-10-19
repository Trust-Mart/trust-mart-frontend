"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import productsApi, { type SellerProduct } from "@/services/api/productsApi";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    productsApi
      .getById(id)
      .then((res) => {
        if (!mounted) return;
        setProduct(res.data.product);
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL
    ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/`
    : "https://gateway.pinata.cloud/ipfs/";

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-[420px] rounded-xl bg-grey-200 animate-pulse" />
        <div className="mt-6 h-7 w-64 bg-grey-200 rounded animate-pulse" />
        <div className="mt-2 h-4 w-80 bg-grey-200 rounded animate-pulse" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 rounded-full bg-grey-200 animate-pulse" />
          ))}
        </div>
        <div className="mt-6 h-24 bg-grey-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full text-center border border-grey-300 rounded-xl bg-white p-8">
        <p className="text-sm text-grey-700">Product not found.</p>
        <button onClick={() => router.back()} className="mt-3 text-primary border border-primary/30 rounded-full px-4 h-[36px] text-sm hover:bg-primary/10">Go back</button>
      </div>
    );
  }

  const images = product.image_cid || [];
  const hasMany = images.length > 1;
  const imgSrc = images.length ? `${gatewayBase}${images[idx]}` : "";
  const updatedAt = product.updatedAt ? new Date(product.updatedAt) : null;

  return (
    <div className="w-full">
      {/* Top hero image slider */}
      <div className="relative h-[440px] rounded-xl overflow-hidden border">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-grey-200" />
        )}
        {hasMany ? (
          <>
            <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white" onClick={() => setIdx((v) => (v - 1 + images.length) % images.length)} aria-label="Prev">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white" onClick={() => setIdx((v) => (v + 1) % images.length)} aria-label="Next">
              <ChevronRight className="size-4" />
            </button>
          </>
        ) : null}
      </div>

      {/* Title and price row */}
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[22px] font-bold">{product.name}</h1>
          <p className="text-sm text-grey-600 mt-1">by {product.seller?.username || "Seller"}</p>
          {updatedAt ? (
            <p className="text-[11px] text-grey-500 mt-1">Last updated {updatedAt.toLocaleString()}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-[22px] font-bold">{product.currency} {Number(product.price).toFixed(2)}</p>
          <p className="text-xs text-emerald-700">{product.status === "active" ? "• AVAILABLE" : product.status ? `• ${String(product.status).toUpperCase().replace(/_/g, " ")}` : null}</p>
        </div>
      </div>

      {/* Chips */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-grey-100 text-grey-700 border">Qty {Number(product.quantity ?? 0)}</span>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-grey-100 text-grey-700 border">Currency {product.currency}</span>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-[15px] font-semibold mb-2">Description</h2>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
      </div>

      {/* CTA */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => toast.info("Checkout coming soon")}
          className="px-5 h-[42px] rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/80"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}


