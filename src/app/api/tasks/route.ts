import { db } from "@/db";
import { NextResponse } from "next/server";

const STATUS_OPTIONS = ["NOT STARTED", "IN PROGRESS", "COMPLETED"];

export async function GET() {
  try {
    const tasks = await db.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, status } = await request.json();

    if (!STATUS_OPTIONS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const newTask = await db.task.create({
      data: { title, description, status },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Failed to add task:", error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}
