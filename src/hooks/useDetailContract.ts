import { approvalReturnApi } from "@/service/api";
import { DetailContractData } from "@/types/detailContract";
import { useCallback, useState } from "react";

export function useDetailContract(contractNo: string) {
    const [detailData, setDetailData] = useState<DetailContractData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchDetailData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await approvalReturnApi.getDetailContract(contractNo);
        setDetailData(data);
      } catch (error) {
        setError("Failed to fetch detail data. Please try again later.");
        console.error("Error fetching detail data:", error);
      } finally {
        setIsLoading(false);
      }
    }, [contractNo]);
  
    return {
      detailData,
      isLoading,
      error,
      fetchDetailData
    };
  }