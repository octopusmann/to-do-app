import { db } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

const STATUS_OPTIONS = ["NOT STARTED", "IN PROGRESS", "COMPLETED"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if ((req.method = "PUT")) {
    const { title, description, status } = req.body;

    if (!STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const editTask = await db.task.update({
        where: { id: Number(id) },
        data: { title, description, status },
      });
      res.status(200).json(editTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });

      console.log(error);
    }
  } else if (req.method === "DELETE") {
    try {
      await db.task.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
      console.log(error);
    }
  }
}
