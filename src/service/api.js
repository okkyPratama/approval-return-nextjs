import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_APPROVAL_RETURN_API_URL;
const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_URL;

export const approvalReturnApi = {
    getApprovalReturn: async (branchCode) => {
        const response = await axios.post(`${API_BASE_URL}/getApprovalReturn`, 
          { branch_code: branchCode }
        );
        return response.data.data;
      },

      getDetailContract: async (contractNo) => {
        const response = await axios.post(`${API_BASE_URL}/getDetailContract`, 
          { contract_no: contractNo }
        );
        return response.data.data[0];
      },
      checkFlagReturnRequest: async(params) => {
        return axios.post(`${LOCAL_API_URL}/checkFlagReturn`,params);
      },
      confirmApproval: async (params) => {
        return axios.post(`${API_BASE_URL}/confirmApproval`, params);
      },
      
      confirmApprovalRTRE: async (params) => {
        return axios.post(`${API_BASE_URL}/confirmApprovalRTRE`,params);
      },
      rejectApproval: async (params) => {
        return axios.post(`${API_BASE_URL}/rejectApproval`, params);
      }
}