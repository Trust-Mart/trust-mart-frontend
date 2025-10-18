"use client";

import React, { useMemo, useState } from "react";
import { X, UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import RichTextEditor from "@/components/reusables/RichTextEditor";
import httpClient from "@/services/http/httpClient";
import { useQueryClient } from "@tanstack/react-query";

type Step = 1 | 2 | 3;

type ProductForm = {
  seller_id: number;
  name: string;
  description: string;
  image_cid: string[];
  price: number | string;
  quantity: number | string;
  currency: string;
};

export default function AddProductModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<ProductForm>({
    seller_id: 1,
    name: "",
    description: "",
    image_cid: [],
    price: "",
    quantity: "",
    currency: "USD",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductForm, string>>
  >({});

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  // Delivery form state (step 3)
  const [pickupLocation, setPickupLocation] = useState("");
  const [estimatedDays, setEstimatedDays] = useState<number | string>("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const disabled = useMemo(() => {
    if (step === 1) {
      return (
        !form.name ||
        !form.description ||
        !form.price ||
        !form.quantity ||
        !form.currency
      );
    }
    if (step === 2) return files.length === 0;
    return false;
  }, [form, step, files]);

  function validateStep1(): boolean {
    const next: Partial<Record<keyof ProductForm, string>> = {};
    if (!form.name) next.name = "Product name is required";
    if (!form.description) next.description = "Description is required";
    if (!form.price) next.price = "Price is required";
    if (!form.quantity) next.quantity = "Quantity is required";
    if (!form.currency) next.currency = "Currency is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    }
  }

  function handleBack() {
    if (step === 2) setStep(1);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(1);
      setForm({
        seller_id: 1,
        name: "",
        description: "",
        image_cid: [],
        price: "",
        quantity: "",
        currency: "USD",
      });
      setErrors({});
      setFiles([]);
      setIsDragging(false);
      setIsSubmitting(false);
      setProgress(0);
      setProgressLabel("");
      setCreatedProductId(null);
      setPickupLocation("");
      setEstimatedDays("");
      setDeliveryNotes("");
    }, 200);
  }

  async function handleSubmit() {
    if (files.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    try {
      setIsSubmitting(true);
      setProgress(5);
      setProgressLabel("Uploading images to IPFS");

      // Upload sequentially for progress feedback
      const cids: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append("file", files[i]);
        const res = await fetch("/api/upload/pinata", { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text());
        const data: { cids: string[]; urls: string[] } = await res.json();
        if (!data.cids?.[0]) throw new Error("No CID returned");
        cids.push(data.cids[0]);
        const pct = Math.min(80, Math.round(((i + 1) / files.length) * 70) + 10);
        setProgress(pct);
      }

      setProgressLabel("Creating product");
      setProgress(90);

      const payload = {
        seller_id: form.seller_id,
        name: form.name,
        description: form.description,
        image_cid: cids,
        price: Number(form.price),
        quantity: Number(form.quantity),
        currency: form.currency,
      };

      const created: any = await httpClient.post("/products", payload);
      const newId = created?.data?.product?.id ?? created?.product?.id ?? created?.id ?? null;
      if (newId) setCreatedProductId(Number(newId));
      setProgress(100);
      setProgressLabel("Done");
      toast.success("Product created");
      // Refresh store list
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      // Move to optional delivery step
      setIsSubmitting(false);
      setStep(3);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      setProgressLabel("");
      setProgress(0);
      toast.error("Failed to create product");
    }
  }

  async function handleDeliverySave() {
    if (!createdProductId) {
      handleClose();
      return;
    }
    if (!pickupLocation || !estimatedDays) {
      toast.error("Pickup location and estimated days are required");
      return;
    }
    try {
      setIsSubmitting(true);
      await httpClient.post("/deliveries", {
        product_id: createdProductId,
        pickup_location: pickupLocation,
        estimated_delivery_days: Number(estimatedDays),
        notes: deliveryNotes || undefined,
      });
      toast.success("Delivery record created");
      // Refresh product lists and marketplace
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      handleClose();
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      toast.error("Failed to create delivery record");
    }
  }

  function handleDeliverySkip() {
    toast.info("You can add delivery details later. Product stays under review until updated.");
    handleClose();
  }

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!incoming.length) return;
    setFiles((prev) => {
      const next = [...prev, ...incoming].slice(0, 5);
      if (prev.length + incoming.length > 5) toast.error("Maximum of 5 images");
      return next;
    });
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    onFilesSelected(e.dataTransfer.files);
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative h-screen w-screen bg-white">
        <div className="flex items-center justify-between px-8 py-8">
          <div className="">
            <div className="flex items-center gap-">
              <Image src="/images/logo.png" alt="logo" width={50} height={50} />
              <p className="text-lg font-semibold pt-2.5">Trustmart</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="px-4 py-2.5 rounded-full bg-grey-300 text-sm flex items-center gap-2 "
          >
            Cancel
            <X className="size-2" />
          </button>
        </div>

        <div className="w-full max-w-[550px] mx-auto h-auto flex flex-col mt-6 border p-4 border-grey-300 shadow-xs rounded-2xl">
          {/* Steps header */}
          <div className="px-6 py-3 flex items-center gap-3 text-sm">
            <div
              className={`px-2.5 py-1 rounded-full ${
                step === 1 ? "bg-primary/10 text-primary" : "bg-grey-200"
              }`}
            >
              1. Details
            </div>
            <div
              className={`px-2.5 py-1 rounded-full ${
                step === 2 ? "bg-primary/10 text-primary" : "bg-grey-200"
              }`}
            >
              2. Images
            </div>
          </div>

          {/* Content */}
          {step === 1 ? (
            <div className="px-6 py-4 max-w-3xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-grey-800">
                    Product name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Premium Laptop"
                    className="mt-1 w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10"
                  />
                  {errors.name ? (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-sm font-medium text-grey-800">
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="1299.99"
                    className="mt-1 w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10"
                  />
                  {errors.price ? (
                    <p className="text-xs text-red-600 mt-1">{errors.price}</p>
                  ) : null}
                </div>
                <div>
                  <label className="text-sm font-medium text-grey-800">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, quantity: e.target.value }))
                    }
                    placeholder="10"
                    className="mt-1 w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10"
                  />
                  {errors.quantity ? (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.quantity}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="text-sm font-medium text-grey-800">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                    className="mt-1 w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10 bg-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                    <option value="KES">KES</option>
                    <option value="GHS">GHS</option>
                  </select>
                  {errors.currency ? (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.currency}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-grey-800">
                      Description
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          description: `<p>High-performance laptop for professionals. 16GB RAM, 1TB SSD, Retina display.</p>`,
                        }))
                      }
                      className="text-xs px-2 py-1 rounded-md border hover:bg-grey-100"
                    >
                      Generate with AI
                    </button>
                  </div>
                  <div className="mt-1">
                    <RichTextEditor
                      value={form.description}
                      onChange={(html) =>
                        setForm((p) => ({ ...p, description: html }))
                      }
                      placeholder="High-performance laptop for professionals"
                    />
                  </div>
                  {errors.description ? (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className="text-sm px-3 py-2 rounded-md hover:bg-grey-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  disabled={disabled}
                  className="bg-primary text-white px-4 h-[38px] rounded-md text-sm font-semibold disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="px-6 py-4 max-w-3xl">
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
                  <p className="text-sm text-grey-700">{progressLabel || "Preparing upload"}</p>
                  <div className="w-full max-w-[380px] h-2 rounded-full bg-grey-200 overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[11px] text-grey-600">This may take a moment depending on your image sizes.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-grey-700 mb-3">Upload product images (max 5)</p>
                  <div
                    className={`border border-dashed rounded-xl p-6 text-center ${
                      isDragging ? "border-primary bg-primary/5" : "border-grey-400"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                  >
                    <UploadCloud className="size-6 mx-auto text-grey-600" />
                    <p className="text-sm text-grey-700 mt-2">Drag & drop images here, or</p>
                    <label className="inline-block mt-2 text-sm font-semibold text-primary cursor-pointer">
                      Browse files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => onFilesSelected(e.target.files)}
                      />
                    </label>
                    <p className="text-[11px] text-grey-500 mt-1">PNG, JPG, WEBP up to 5 files</p>
                  </div>

                  {files.length ? (
                    <div className="mt-4 grid grid-cols-5 gap-3">
                      {files.map((file, i) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div className="relative h-[80px] rounded-md overflow-hidden border" key={file.name + i}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={file.name} className="object-cover w-full h-full" />
                            <button type="button" onClick={() => removeAt(i)} className="absolute top-1 right-1 p-1 rounded-md bg-black/50 text-white" aria-label="Remove">
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button onClick={handleBack} disabled={isSubmitting} className="text-sm px-3 py-2 rounded-md hover:bg-grey-100 disabled:opacity-60">Back</button>
                <button onClick={handleSubmit} disabled={disabled || isSubmitting} className="bg-primary text-white px-4 h-[38px] rounded-md text-sm font-semibold disabled:opacity-60">{isSubmitting ? "Uploading..." : "Create product"}</button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4 max-w-3xl">
              <div className="mb-3 text-xs text-grey-700 bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
                Adding delivery details helps customers know what to expect. You can skip now and update later; the product will remain under review until updated.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-grey-800">Pickup location</label>
                  <input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="123 Main Street, Lagos, Nigeria" className="mt-1 w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-grey-800">Estimated delivery (days)</label>
                  <input type="number" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} placeholder="5" className="mt-1 w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-grey-800">Notes</label>
                  <textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} placeholder="Product will be shipped via DHL. Tracking number will be provided upon shipment." className="mt-1 min-h-[100px] w-full border border-grey-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:bg-primary/10" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={handleDeliverySkip} className="text-sm px-3 py-2 rounded-md hover:bg-grey-100">Skip for now</button>
                <button onClick={handleDeliverySave} disabled={isSubmitting} className="bg-primary text-white px-4 h-[38px] rounded-md text-sm font-semibold disabled:opacity-60">Save delivery</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
