import httpClient from "@/services/http/httpClient";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3033";

export type ConnectStartResponse = {
  status: boolean;
  message: string;
  data: { authorizationUrl: string };
};

export const socialApi = {
  startFacebookConnect(params: { challenge: string; redirectUri: string }) {
    return httpClient.get<ConnectStartResponse>(
      `${base}/api/v1/social/facebook/connect/start?code_challenge=${encodeURIComponent(params.challenge)}&redirect_uri=${encodeURIComponent(params.redirectUri)}`
    );
  },
  finishFacebookConnect(params: { code: string; verifier: string; redirectUri: string }) {
    return httpClient.post(`${base}/api/v1/social/facebook/connect/finish`, {
      code: params.code,
      code_verifier: params.verifier,
      redirect_uri: params.redirectUri,
    });
  },
};

export default socialApi;


