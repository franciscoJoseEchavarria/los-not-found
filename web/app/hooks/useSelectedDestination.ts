import { useEffect, useState } from "react";
import { destinationResponse } from "~/interfaces/destinationResponse";

export function useSelectedDestination() {
  const [selectedDestination, setSelectedDestination] = useState<destinationResponse | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDestination = sessionStorage.getItem("selectedDestination");
      if (storedDestination) {
        setSelectedDestination(JSON.parse(storedDestination));
      }
    }
  }, []);

  return selectedDestination;
}
