import httpClient from "../http/httpClient";

export type User = {
  id: string;
  email: string;
  name?: string;
};

export const usersApi = {
  list() {
    return httpClient.get<User[]>("/users");
  },
  getById(userId: string) {
    return httpClient.get<User>(`/users/${userId}`);
  },
  update(userId: string, payload: Partial<User>) {
    return httpClient.patch<User, Partial<User>>(`/users/${userId}`, payload);
  },
  remove(userId: string) {
    return httpClient.delete<{ success: boolean }>(`/users/${userId}`);
  },
};

export default usersApi;


