"use client";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import TaskModal from "./components/TaskModal";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
const STATUS_OPTIONS = ["ALL", "NOT STARTED", "IN PROGRESS", "COMPLETED"];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "ALL") return true;
    return task.status === activeTab;
  });

  const handleAddTasks = () => {
    setEditTask(null);
    setShowModal(true);
  };
  const handleEditTasks = (task: Task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleDeleteTasks = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="flex flex-col pt-10 items-center gap-y-8 ">
      <h1>Welcome to do app</h1>
      <div className="flex flex-col items-center gap-2">
        <p>All the tasks</p>
        <Button onPress={handleAddTasks}>Add a new Task</Button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {STATUS_OPTIONS.map((status) => (
          <div
            key={status}
            onClick={() => setActiveTab(status)}
            className={`p-2 rounded ${
              activeTab === status ? "bg-green-200" : "bg-gray-100"
            }`}
          >
            {status}
          </div>
        ))}
      </div>
      {filteredTasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <div className="flex gap-x-4">
            <Button className="" onPress={() => handleEditTasks(task)}>
              Edit
            </Button>
            <Button onPress={() => handleDeleteTasks(task.id)}>Delete</Button>{" "}
          </div>
        </div>
      ))}

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={editTask ? "edit" : "add"}
        task={editTask}
        fetchTasks={fetchTasks}
      />
    </div>
  );
}
