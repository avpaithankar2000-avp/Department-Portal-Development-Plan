import { useEffect, useState } from "react";
import { listResource } from "../api/resources";

const useResourceList = (resource, params) => {
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await listResource(resource, params);
        setData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || "Unable to load records");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [resource, JSON.stringify(params)]);

  return { ...data, loading, error };
};

export default useResourceList;
