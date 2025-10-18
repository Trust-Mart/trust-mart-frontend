import httpClient from "../http/httpClient";

export type ApiUser = {
  id: number;
  email: string;
  username?: string | null;
  roles?: string[];
  walletAddress?: string | null;
  smartAccountAddress?: string | null;
  smartAccountBalance?: string | null;
  country?: string | null;
  isverified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UsersMeResponse = {
  status: boolean;
  message: string;
  data: {
    message: string;
    user: ApiUser;
  };
  timestamp: string;
};

export const usersApi = {
  me() {
    return httpClient.get<UsersMeResponse>("/users/user");
  },
  list() {
    return httpClient.get<ApiUser[]>("/users");
  },
  getById(userId: string) {
    return httpClient.get<ApiUser>(`/users/${userId}`);
  },
  update(userId: string, payload: Partial<ApiUser>) {
    return httpClient.patch<ApiUser, Partial<ApiUser>>(`/users/${userId}`, payload);
  },
  remove(userId: string) {
    return httpClient.delete<{ success: boolean }>(`/users/${userId}`);
  },
};

export default usersApi;


