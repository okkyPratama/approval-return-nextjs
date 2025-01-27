import { ApprovalReturnRequest } from "@/types/approvalReturn";
import { DetailContractData } from "@/types/detailContract";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_APPROVAL_RETURN_API_URL;

export const approvalReturnApi = {
    getApprovalReturn: async (branchCode: string): Promise<ApprovalReturnRequest[]> => {
        const response = await axios.post(`${API_BASE_URL}/getApprovalReturn`, 
          { branch_code: branchCode }
        );
        return response.data.data;
      },

      getDetailContract: async (contractNo: string): Promise<DetailContractData> => {
        const response = await axios.post(`${API_BASE_URL}/getDetailContract`, 
          { contract_no: contractNo }
        );
        return response.data.data[0];
      },
      
      confirmApproval: async (params: { 
        branch_code: string; 
        nik: string; 
        contract_no: string;
      }) => {
        return axios.post(`${API_BASE_URL}/confirmApproval`, params);
      },

      rejectApproval: async (params: { 
        contract_no: string; 
        nik: string;
      }) => {
        return axios.post(`${API_BASE_URL}/rejectApproval`, params);
      }
}