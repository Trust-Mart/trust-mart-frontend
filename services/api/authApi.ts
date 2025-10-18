import httpClient from "../http/httpClient";

export type LoginRequest = { identifier: string; password: string };
export type LoginResponse = {
  status: boolean;
  message: string;
  data: {
    message: string;
    user: {
      id: number;
      username: string;
      email: string;
      isverified: boolean;
      smartAccountAddress?: string | null;
      smartAccountBalance?: string | null;
      roles?: string[];
    };
    token: string;
  };
  timestamp: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  username?: string;
  country?: string;
};
export type SignupResponse = { userId: string };

export type VerifyEmailResponse = {
  status: boolean;
  message: string;
  data: {
    message: string;
    token: string;
  };
  timestamp: string;
};

export const authApi = {
  login(payload: LoginRequest) {
    return httpClient.post<LoginResponse, LoginRequest>("/auth/login", payload);
  },
  signup(payload: SignupRequest) {
    return httpClient.post<SignupResponse, SignupRequest>(
      "/auth/register",
      payload
    );
  },
  verifyEmail(payload: { email: string; otp: string }) {
    return httpClient.post<VerifyEmailResponse, { email: string; otp: string }>(
      "/auth/verify-email",
      payload
    );
  },
  me() {
    return httpClient.get<{ id: string; email: string; name?: string }>(
      "/auth/me"
    );
  },
};

export default authApi;
