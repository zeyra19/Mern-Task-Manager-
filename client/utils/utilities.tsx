import moment from "moment";
import { Task } from "./types";

export const formatTime = (createdAt: string) => {
    const now = moment();
    const created = moment(createdAt);

    if (created.isSame(now, "day")) {
      return "Bugün";
    }

    if (created.isSame(now.subtract(1, "days"), "day")) {
      return "Dün";
    }

    if (created.isAfter(moment().subtract(6, "days"))) {
      return created.fromNow();
    }

    if (created.isAfter(moment().subtract(3, "weeks"), "week")) {
      return created.fromNow();
    }

    return created.format("DD/MM/YYYY");
};

export const filteredTasks = (tasks: Task[], priority: string) => {
  const filteredTasks = () = {
    switch (priority) {
      case "düşük":
        return tasks.filter((task) => task.priority === "düşük");
      case "orta":
        return tasks.filter((task) => task.priority === "orta");
      case "yüksek":
        return tasks.filter((task) => task.priority === "yüksek");
      default:
        return tasks;
    }
  };

  return filteredTasks();
};

export const overdueTasks = (tasks: Task[]) => {
  const todayDate = moment();

  return tasks.filter((task) => {
    return !task.completed && moment(task.dueDate).isBefore(todayDate)
  });
};