"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function InstagramCallbackPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const code = search.get("code");
    const error = search.get("error");
    
    if (error) {
      toast.error("Instagram connect cancelled");
      router.replace("/dashboard");
      return;
    }
    
    if (!code) return;
    
    (async () => {
      try {
        const response = await fetch('/api/connect/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        
        if (response.ok) {
          toast.success("Instagram connected!");
        } else {
          toast.error("Failed to connect Instagram");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to connect Instagram");
      } finally {
        setProcessing(false);
        router.replace("/dashboard");
      }
    })();
  }, [search, router]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="text-sm text-grey-700">Finishing Instagram connection...</div>
    </div>
  );
}
