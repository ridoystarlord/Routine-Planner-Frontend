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

export const deleteStudyTopic = ({ token }: TokenType) => {
  return {
    api(input: string) {
      return axios
        .delete(`${API_URL}/study/topic/${input}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["deleteStudyTopic"];
    },
  };
};

export const addStudyTopic = ({ token }: TokenType) => {
  return {
    api(input: any) {
      return axios
        .post(`${API_URL}/study/topic`, input, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["addStudyTopic"];
    },
  };
};
