"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import socialApi from "@/services/api/socialApi";

export default function FacebookCallbackPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const code = search.get("code");
    const error = search.get("error");
    if (error) {
      toast.error("Facebook connect cancelled");
      router.replace("/dashboard");
      return;
    }
    if (!code) return;
    (async () => {
      try {
        const verifier = sessionStorage.getItem("fb_pkce_verifier") || "";
        const redirectUri = `${window.location.origin}/oauth/facebook/callback`;
        await socialApi.finishFacebookConnect({ code, verifier, redirectUri });
        toast.success("Facebook account connected");
      } catch (e: any) {
        toast.error(e?.message || "Failed to connect Facebook");
      } finally {
        setProcessing(false);
        router.replace("/dashboard");
      }
    })();
  }, [search, router]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="text-sm text-grey-700">Finishing Facebook connection...</div>
    </div>
  );
}


