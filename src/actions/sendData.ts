"use server";

import { data, db } from "@/drizzle";

export async function sendData(formData: FormData) {
  const sex = formData.get("sex") as "male" | "female";
  const age = Number(formData.get("age"));
  const decibels = Number(formData.get("decibels"));
  const points = Number(formData.get("points"));
  const duration = Number(formData.get("duration"));

  console.log({
    sex,
    age,
    decibels,
    points,
    duration,
  });

  try {
    await db.insert(data).values({
      age,
      decibels,
      duration,
      points,
      sex,
    });
  } catch (error) {
    throw new Error("Failed to send data!!!!");
  }
}
