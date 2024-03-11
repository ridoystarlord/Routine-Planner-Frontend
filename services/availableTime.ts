import { API_URL } from "@/environment/environment";
import axios from "axios";

export interface TokenType {
  token: string;
}

export const getAvailableTimes = ({ token }: TokenType) => {
  return {
    api() {
      return axios
        .get(`${API_URL}/study/available-times`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["getAvailableTimes"];
    },
  };
};

export const deleteAvailableTime = ({ token }: TokenType) => {
  return {
    api(input: string) {
      return axios
        .delete(`${API_URL}/study/available-times/${input}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["deleteAvailableTime"];
    },
  };
};
