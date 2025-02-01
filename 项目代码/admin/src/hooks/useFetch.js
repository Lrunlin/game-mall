import { ref, reactive, watchEffect } from "vue";
import axios from "axios";

function useFetch(url, options = { method: "get" }, manual = false) {
  const data = ref(null);
  const error = ref(null);
  const isLoading = ref(!manual);

  const fetchData = async () => {
    isLoading.value = true;

    try {
      const response = await axios({
        url,
        ...options,
      });
      data.value = response.data;
    } catch (error) {
      error.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  if (!manual) {
    watchEffect(() => {
      fetchData();
    });
  }

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}

export default useFetch;
