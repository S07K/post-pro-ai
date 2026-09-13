import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ status: "error", message }, { status });
}

export function unauthorized(message = "Authentication required") {
  return fail(message, 401);
}

export function forbidden(message = "You do not have access to this resource") {
  return fail(message, 403);
}

export function notFound(message = "Not found") {
  return fail(message, 404);
}

export function validationError(error: ZodError) {
  const message = error.issues[0]?.message ?? "Invalid request";
  return fail(message, 422);
}

export function serverError(error: unknown, fallbackMessage = "Something went wrong") {
  console.error(fallbackMessage, error);
  return fail(fallbackMessage, 500);
}
