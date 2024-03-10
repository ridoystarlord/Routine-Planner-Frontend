import { API_URL } from "@/environment/environment";
import axios from "axios";

export const getStudyTopic = ({ token }: { token: string }) => {
  return {
    api() {
      return axios
        .get(`${API_URL}/study/topic`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      return ["getStudyTopic"];
    },
  };
};
