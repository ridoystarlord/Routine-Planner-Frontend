import { API_URL } from "@/environment/environment";
import axios from "axios";

export interface TokenType {
  token: string;
}

export interface GetStudyPlanInput {
  startDate: string;
  endDate: string;
  token: string;
}

export const getUserStudyPlan = ({
  token,
  startDate,
  endDate,
}: GetStudyPlanInput) => {
  const params = new URLSearchParams({
    startDate: startDate,
    endDate: endDate,
  }).toString();
  return {
    api() {
      return axios
        .get(`${API_URL}/user/study-plan?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => data);
    },
    getKey() {
      const fstartDate = startDate ? startDate : "0";
      const fendDate = endDate ? endDate : "0";
      return ["getUserStudyPlan", fstartDate, fendDate];
    },
  };
};
