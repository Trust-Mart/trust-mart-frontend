"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function TwitterCallbackContent() {
  const search = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const code = search.get("code");
    const error = search.get("error");
    const state = search.get("state");
    
    if (error) {
      toast.error("Twitter connect cancelled");
      router.replace("/dashboard");
      return;
    }
    
    if (!code || state !== "twitter_connect") {
      toast.error("Invalid Twitter callback");
      router.replace("/dashboard");
      return;
    }
    
    (async () => {
      try {
        const verifier = sessionStorage.getItem('twitter_pkce_verifier');
        if (!verifier) {
          toast.error("Missing verification code");
          router.replace("/dashboard");
          return;
        }

        // Exchange code for access token
        const response = await fetch('/api/connect/twitter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, verifier })
        });
        
        if (response.ok) {
          toast.success("Twitter connected!");
        } else {
          toast.error("Failed to connect Twitter");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to connect Twitter");
      } finally {
        setProcessing(false);
        router.replace("/dashboard");
      }
    })();
  }, [search, router]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="text-sm text-grey-700">Finishing Twitter connection...</div>
    </div>
  );
}

export default function TwitterCallbackPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="text-sm text-grey-700">Loading...</div>
      </div>
    }>
      <TwitterCallbackContent />
    </Suspense>
  );
}
