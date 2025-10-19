"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import productsApi, { type UpdateProductPayload } from "@/services/api/productsApi";
import httpClient from "@/services/http/httpClient";

type ProductEditable = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  currency: string;
  status?: string;
  image_cid?: string[];
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
  const [showDelivery, setShowDelivery] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [estimatedDays, setEstimatedDays] = useState<number | string>("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  useEffect(() => {
    setForm(product);
    setShowDelivery(false);
    setPickupLocation("");
    setEstimatedDays("");
    setDeliveryNotes("");
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
      <div className="relative w-full max-w-[820px] bg-white rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">Edit product</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-md hover:bg-grey-100">
            <X className="size-5" />
          </button>
        </div>

        {/* Under review notice with CTA */}
        {form.status === "under_review" && !showDelivery ? (
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 flex items-center justify-between">
            <span>Your product is under review because delivery details have not been added yet.</span>
            <button onClick={() => setShowDelivery(true)} className="text-xs px-2.5 py-1 rounded-full bg-amber-600 text-white hover:bg-amber-700">Add delivery details</button>
          </div>
        ) : null}

        {/* Images preview */}
        {form.image_cid && form.image_cid.length ? (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {(form.image_cid || []).slice(0, 5).map((cid, i) => {
              const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL ? `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/` : "https://gateway.pinata.cloud/ipfs/";
              const src = `${gatewayBase}${cid}`;
              return (
                <div key={cid + i} className="relative h-[70px] rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`image-${i + 1}`} className="object-cover w-full h-full" />
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Delivery form */}
        {showDelivery ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="col-span-2">
              <label className="block text-xs text-grey-600 mb-1">Pickup location</label>
              <input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="123 Main Street, Lagos, Nigeria" className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs text-grey-600 mb-1">Estimated delivery (days)</label>
              <input type="number" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} placeholder="5" className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-grey-600 mb-1">Notes</label>
              <textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} placeholder="Product will be shipped via DHL..." className="w-full min-h-[90px] border border-grey-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="col-span-2 flex items-center justify-end gap-3 mt-2">
              <button onClick={() => setShowDelivery(false)} className="px-4 h-[38px] rounded-md text-sm border border-grey-300 hover:bg-grey-100">Back</button>
              <button
                onClick={async () => {
                  if (!form?.id) return;
                  if (!pickupLocation || !estimatedDays) {
                    toast.error("Pickup location and estimated days are required");
                    return;
                  }
                  try {
                    await httpClient.post("/deliveries", {
                      product_id: form.id,
                      pickup_location: pickupLocation,
                      estimated_delivery_days: Number(estimatedDays),
                      notes: deliveryNotes || undefined,
                    });
                    toast.success("Delivery details saved");
                    queryClient.invalidateQueries({ queryKey: ["myProducts"] });
                    queryClient.invalidateQueries({ queryKey: ["marketplace"] });
                    setShowDelivery(false);
                    onClose();
                  } catch (e) {
                    toast.error("Failed to save delivery details");
                  }
                }}
                className="px-4 h-[38px] rounded-md text-sm text-white bg-primary hover:bg-primary/90"
              >
                Save delivery
              </button>
            </div>
          </div>
        ) : (
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
          <div className="mt-5 flex items-center justify-end gap-3 col-span-2">
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
        )}
      </div>
    </div>
  );
}


