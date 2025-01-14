import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "http://localhost:8000";

export const TasksProvider = ({children}) => {
  const userId = useUserContext().user._id

  const [tasks, setTasks] = useState([]); //birden fazla görevler
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({}); //tek bir görev

  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState("Tümü");
  const [activeTask, setActiveTask] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [profileModal, setProfileModal] = useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  }

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setActiveTask(null);
    setModalMode("");
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

      console.log("Task Oluştu", res.data);

      setTasks([...tasks, res.data]);
      toast.success("Task başarıyla oluştu")
    } catch (error) {
      console.log("Task verisi getirilemedi", error)
    }
    setLoading(false);
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/task/${task._id}`, task);

      const newTasks = tasks.map((tsk) => {
        if (task._id === res.data._id) {
          return res.data;
        } else {
          return tsk;
        }
      });

      toast.success("Task başarıyla güncellendi");

      setTasks(newTasks);
    } catch (error) {
      console.log("Task güncelleme de hata", error);
    }
  };

  // silme işlemi başarısını kontrol edicem, response yanıtı almama gerek yok
  const deleteTask = async (taskId) => {
    setLoading(true)
    try {
      await axios.delete(`${serverUrl}/task/${taskId}`);

      const newTasks = tasks.filter((tsk) => tsk._id !== taskId);
      setTasks(newTasks)
    } catch (error) {
        console.log("Task silme de hata", error);
    }
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      // inputla girilen event ile güncelle
      setTask(e);
    } else {
      // e.target.value ile inputta girilen name'i al kopyaladığın task'a at
      setTask({...task, [name]: e.target.value});
    }
  };

  const completedTasks = tasks.filter((task) => task.completed);

  const activeTasks = tasks.filter((task) => !task.completed);

  // userID değişirse yeni görevler yeniden render edilmeli
  useEffect(() => {
    getTasks();
  }, [userId]);


  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        tasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
