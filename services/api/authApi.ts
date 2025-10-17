import httpClient from "../http/httpClient";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string };

export type SignupRequest = {
  email: string;
  password: string;
  username?: string;
  country?: string;
};
export type SignupResponse = { userId: string };

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
    return httpClient.post<{ success: boolean }, { email: string; otp: string }>(
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
