export type Role = "bot" | "user";

export type Message = {
  id: string;
  role: Role;
  text: string;
  /** Absent on the seeded greeting so server and client markup match. */
  time?: string;
};
