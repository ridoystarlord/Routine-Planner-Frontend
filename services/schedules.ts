import { API_URL } from "@/environment/environment";
import axios from "axios";

export interface TokenType {
  token: string;
}

export const getSchedules = ({ token }: TokenType) => {
  return {
    api() {
      return axios
        .get(`${API_URL}/schedule`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["getSchedules"];
    },
  };
};

export const deleteSchedules = ({ token }: TokenType) => {
  return {
    api(input: string) {
      return axios
        .delete(`${API_URL}/schedule/${input}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["deleteSchedules"];
    },
  };
};

export const addSchedules = ({ token }: TokenType) => {
  return {
    api(input: any) {
      return axios
        .post(`${API_URL}/schedule`, input, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["addSchedules"];
    },
  };
};
