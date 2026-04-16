import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthenticatedAxios } = useAuth();

  const fetchReminders = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get("/reminders");
      setReminders(response.data.reminders);
    } catch (err) {
      console.log("Failed to fetch reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return { reminders, loading, refetch: fetchReminders };
};