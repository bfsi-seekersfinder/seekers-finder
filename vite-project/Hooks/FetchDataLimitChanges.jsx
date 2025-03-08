import { useState, useEffect } from "react";
import axios from "axios";

const useFetchData = (endpoint, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url = import.meta.env.VITE_API_URI; // Your API URL

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
        const response = await axios.get(`${url}/${endpoint}`, { withCredentials: true });
        setData(response.data);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
        };

        if (dependencies.length > 0) {
        fetchData();
        }
    }, dependencies); 

    return { data, loading, error };
};

export default useFetchData;
