import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const createBookingMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/calcom", () => ({
  CalComError: class CalComError extends Error {
    constructor(
      message: string,
      public readonly status = 502,
    ) {
      super(message);
    }
  },
  createBooking: createBookingMock,
}));

const validBookingPayload = {
  name: "Kacper Bernecki",
  email: "kacper@example.com",
  company: "B-CODE",
  message: "Portfolio booking test",
  start: "2026-06-09T10:00:00.000Z",
  turnstileToken: "",
};

function bookingRequest(payload: Record<string, unknown>, ip: string) {
  return new NextRequest("https://kacper-portfolio.vercel.app/api/booking", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(payload),
  });
}

describe("booking API route", () => {
  beforeEach(() => {
    createBookingMock.mockReset();
  });

  it("rejects honeypot-filled booking requests instead of reporting fake success", async () => {
    const response = await POST(
      bookingRequest(
        {
          ...validBookingPayload,
          bookingTrap: "https://autofilled.example.com",
        },
        "203.0.113.10",
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ message: "Booking request could not be verified." });
    expect(createBookingMock).not.toHaveBeenCalled();
  });

  it("returns the created booking when the calendar booking succeeds", async () => {
    createBookingMock.mockResolvedValue({
      uid: "booking_123",
      start: validBookingPayload.start,
    });

    const response = await POST(bookingRequest(validBookingPayload, "203.0.113.11"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      booking: {
        uid: "booking_123",
        start: validBookingPayload.start,
      },
    });
    expect(createBookingMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: validBookingPayload.email,
        start: validBookingPayload.start,
      }),
    );
  });
});
