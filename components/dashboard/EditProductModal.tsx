"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import productsApi, { type UpdateProductPayload } from "@/services/api/productsApi";

type ProductEditable = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  currency: string;
};

export default function EditProductModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: ProductEditable | null;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductEditable | null>(product);

  useEffect(() => {
    setForm(product);
  }, [product]);

  const mutation = useMutation({
    mutationFn: async (payload: UpdateProductPayload) => {
      if (!product) throw new Error("No product selected");
      return productsApi.update(product.id, payload);
    },
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      onClose();
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to update product";
      toast.error(message);
    },
  });

  const disabled = useMemo(() => {
    if (!form) return true;
    return (
      !form.name?.trim() ||
      !form.currency?.trim() ||
      Number.isNaN(Number(form.price)) ||
      Number.isNaN(Number(form.quantity))
    );
  }, [form]);

  if (!open || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">Edit product</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-md hover:bg-grey-100">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <label className="block text-xs text-grey-600 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-grey-600 mb-1">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-grey-600 mb-1">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-grey-600 mb-1">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
            >
              {[
                { v: "USD", l: "USD" },
                { v: "EUR", l: "EUR" },
                { v: "GBP", l: "GBP" },
                { v: "NGN", l: "NGN" },
                { v: "KES", l: "KES" },
                { v: "GHS", l: "GHS" },
              ].map((o) => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-grey-600 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 h-[38px] rounded-md text-sm border border-grey-300 hover:bg-grey-100">
            Cancel
          </button>
          <button
            disabled={disabled || mutation.isPending}
            onClick={() => mutation.mutate({
              name: form.name,
              price: form.price,
              quantity: form.quantity,
              currency: form.currency,
              description: form.description,
            })}
            className={`px-4 h-[38px] rounded-md text-sm text-white ${disabled || mutation.isPending ? "bg-primary/60" : "bg-primary hover:bg-primary/90"}`}
          >
            {mutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}


