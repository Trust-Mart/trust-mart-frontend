"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Grid, List, Pencil, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import AddProductModal from "@/components/dashboard/AddProductModal";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  status: "draft" | "active";
};

const DUMMY_PRODUCTS: Product[] = [
  { id: "p1", name: "Digital Art Pack", price: 19.99, image: "/images/product1.jpg", status: "active" },
  { id: "p2", name: "Notion Template Suite", price: 12.0, image: "/images/product2.jpg", status: "active" },
  { id: "p3", name: "UI Icon Bundle", price: 9.5, image: "/images/product3.webp", status: "draft" },
];

export default function StorePage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openAdd, setOpenAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DUMMY_PRODUCTS;
    return DUMMY_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  function handleAddProductAI() {
    toast.info("AI product creator coming soon ✨");
  }

  function StatusBadge({ status }: { status: Product["status"] }) {
    const styles =
      status === "active"
        ? "text-green-700 bg-green-100"
        : "text-amber-700 bg-amber-100";
    const label = status === "active" ? "Active" : "Draft";
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>{label}</span>
    );
  }

  async function copyProductLink(product: Product) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/product/${product.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Copied product link");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  function ProductActions({ product }: { product: Product }) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => toast.info(`Edit “${product.name}”`)}
          className="p-1.5 rounded-md hover:bg-grey-100"
          aria-label="Edit"
        >
          <Pencil className="size-4 text-grey-700" />
        </button>
        <button
          onClick={() => toast.success("Deleted (demo)")}
          className="p-1.5 rounded-md hover:bg-red-50"
          aria-label="Delete"
        >
          <Trash2 className="size-4 text-red-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold">My Store</h1>
          <p className="text-sm text-grey-600 mt-1">Manage your products with speed and clarity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden flex items-center rounded-full border border-grey-300 bg-white p-1" role="tablist" aria-label="View switcher">
            <span
              className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-primary/10 transition-transform duration-300"
              style={{ transform: view === "grid" ? "translateX(0%)" : "translateX(100%)" }}
              aria-hidden
            />
            <button
              onClick={() => setView("grid")}
              role="tab"
              aria-selected={view === "grid"}
              className={`relative z-10 px-3 py-1.5 text-sm rounded-full flex items-center gap-1 transition-colors ${view === "grid" ? "text-primary" : "text-grey-700"}`}
            >
              <Grid className="size-4" /> Grid
            </button>
            <button
              onClick={() => setView("list")}
              role="tab"
              aria-selected={view === "list"}
              className={`relative z-10 px-3 py-1.5 text-sm rounded-full flex items-center gap-1 transition-colors ${view === "list" ? "text-primary" : "text-grey-700"}`}
            >
              <List className="size-4" /> List
            </button>
          </div>
          <button
            onClick={() => setOpenAdd(true)}
            className="text-primary px-4 h-[38px] rounded-full text-sm font-semibold flex items-center gap-2 border border-primary/30 hover:bg-primary/10"
          >
            Add product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="border border-grey-300 rounded-xl bg-white p-4">
          <p className="text-xs text-grey-600">Approved products</p>
          <p className="text-[22px] font-bold mt-1">{DUMMY_PRODUCTS.filter(p => p.status === "active").length}</p>
        </div>
        <div className="border border-grey-300 rounded-xl bg-white p-4">
          <p className="text-xs text-grey-600">Pending products</p>
          <p className="text-[22px] font-bold mt-1">{DUMMY_PRODUCTS.filter(p => p.status === "draft").length}</p>
        </div>
        <div className="border border-grey-300 rounded-xl bg-white p-4">
          <p className="text-xs text-grey-600">Total orders</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[22px] font-bold">128</p>
            <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">+12% vs last 7d</span>
          </div>
        </div>
        <div className="border border-grey-300 rounded-xl bg-white p-4">
          <p className="text-xs text-grey-600">Successful orders</p>
          <p className="text-[22px] font-bold mt-1">120</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name..."
          className="w-[360px] border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10 bg-white"
        />
        <span className="text-xs text-grey-600">{filtered.length} results</span>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="border border-grey-300 rounded-xl overflow-hidden bg-white group">
              <div className="relative h-[160px]">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
                <div className="absolute left-3 top-3">
                  <StatusBadge status={p.status} />
                </div>
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ProductActions product={p} />
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-grey-900 truncate max-w-[180px]">{p.name}</p>
                  <p className="text-xs text-grey-600 mt-0.5">${p.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyProductLink(p)}
                    className="text-xs px-2 py-1 rounded-md border hover:bg-grey-100 flex items-center gap-1"
                  >
                    <Copy className="size-3" /> Copy link
                  </button>
                  {/* <ProductActions product={p} /> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col border border-grey-300 rounded-xl bg-white">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 border-b border-grey-300 last:border-b-0">
              <div className="relative h-[56px] w-[56px] rounded-md overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-grey-900 truncate">{p.name}</p>
                  <p className="text-xs text-grey-600">${p.price.toFixed(2)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyProductLink(p)}
                  className="text-xs px-2 py-1 rounded-md border hover:bg-grey-100 flex items-center gap-1"
                >
                  <Copy className="size-3" /> Copy link
                </button>
                <ProductActions product={p} />
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProductModal open={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
}


