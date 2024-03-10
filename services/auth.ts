import { LoginUserFormType } from './../components/Login/LoginForm';
import { RegisterUserFormType } from "./../components/Register/RegisterForm";
import { API_URL } from "@/environment/environment";
import axios from "axios";

export type LoginUserResponse = {
  token: string;
};

export const RegisterUser = () => {
  return {
    api(input: RegisterUserFormType) {
      return axios
        .post(`${API_URL}/auth/register`, input)
        .then(({ data }) => data);
    },
    getKey() {
      return ["Register-User"];
    },
  };
};

export const LoginUser = () => {
  return {
    api(input: LoginUserFormType) {
      return axios
        .post<LoginUserResponse>(`${API_URL}/auth/login`, input)
        .then(({ data }) => data);
    },
    getKey() {
      return ["Login-User"];
    },
  };
};

export const getUser = () => {
  return {
    api() {
      return axios.get<LoginUserResponse>("/api/user").then((res) => res.data);
    },
    getKey() {
      return ["user", "session"];
    },
  };
};

export const sessionLogin = (input: LoginUserResponse) =>
  axios.post("/api/login", input).then((res) => res.data);

export const sessionLogout = () =>
  axios.post<{}>("/api/logout").then((res) => res.data);
