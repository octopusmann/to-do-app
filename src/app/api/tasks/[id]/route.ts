import { db } from "@/db";
import { NextResponse } from "next/server";

const STATUS_OPTIONS = ["NOT STARTED", "IN PROGRESS", "COMPLETED"];

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { title, description, status } = await request.json();

    if (!STATUS_OPTIONS.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" });
    }

    const updatedTask = await db.task.update({
      where: { id: Number(id) },
      data: { title, description, status },
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await db.task.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
