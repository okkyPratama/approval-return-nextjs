import { useCallback, useState } from "react";
import { approvalReturnApi } from "../service/api";

export function useDetailContract(contractNo) {
    const [detailData, setDetailData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchDetailData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await approvalReturnApi.getDetailContract(contractNo);
        console.log("Fetching data for contract number:", contractNo);
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