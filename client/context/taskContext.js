import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "https://taskfyer.onrender.com/api/v1";

export const TasksContext = () => {
  const userId = useUserContext().user._id

  const [tasks, setTasks] = useState([]); //birden fazla görevler
  const [loading, setLoading = useState(false);
  const [task, setTask] = useState({}); //tek bir görev

  const [isEditing, setIsEditing] = useState(false)
  const [priority, setPriority] = useState("Tümü")
  const [activeTask, setActiveTask] = useState(null)
  const [modelMode, setModelMode] = useState("")
  const [profileMode, setProfileMode] = useState(false)

  const openModalForEdit = () => {
    setModelMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileMode(true);
  };

  const closeModal = () = {
    setIsEditing(false);
    setProfileMode(false);
    setActiveTask(null);
    setModelMode("");
    setTask({});
  };

  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);

      setTasks(response.data.tasks);
    } catch (error) {
      console.log("Tasks verisi getirilemedi", error)
    }
    setLoading(false);
  };

  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);

      setTask(response.data);
    } catch (error) {
      console.log("Task verisi getirilemedi", error)
    }
    setLoading(false);
  };

  // sunucuya yeni veri göndericem bu yüzden POST isteği !!
  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, task);

      setTasks([...tasks, res.data]);
      toast.success("Task başarıyla oluştu")
    } catch (error) {
      console.log("Task verisi getirilemedi", error)
    }
    setLoading(false);
  };

}