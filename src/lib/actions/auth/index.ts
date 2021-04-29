import { errorCommand } from "../../commands";

const MY_USER_ID = 109234913;

export function authMiddleware(userId: number) {
  return userId === MY_USER_ID
    ? null
    : errorCommand("Only authorized users can use this bot");
}
