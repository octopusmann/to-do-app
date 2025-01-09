import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  task?: Task | null;
  fetchTasks: () => void;
}
type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

const STATUS_OPTIONS = ["NOT STARTED", "IN PROGRESS", "COMPLETED"];

export default function TaskModal({
  isOpen,
  onClose,
  mode,
  task,
  fetchTasks,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("NOT STARTED");

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("NOT STARTED");
    }
  }, [mode, task]);

  const handleSaveTask = async () => {
    const taskData = { title, description, status };

    const url = mode === "edit" ? `/api/tasks/${task?.id}` : "/api/tasks";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (res.ok) {
      fetchTasks();
      onClose();
    } else {
      console.error("Failed to save task.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{mode === "edit" ? "Edit Task" : "Add Task"} </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Input
              label="Title "
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            ></Input>
            <Textarea
              label="Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Textarea>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              className="px-8 py-2 bg-black text-white"
              onPress={handleSaveTask}
            >
              Save Task
            </Button>

            <Button onPress={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
