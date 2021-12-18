import {createHash} from 'crypto'
import { errorCommand } from "../../commands";

const AUTHENTICATION_TOKEN = process.env.AUTHENTICATION_TOKEN

export function authMiddleware(userId: number, chatId: number) {
  const token = createHash('sha256').update(`${userId}${chatId}`).digest('hex')
  return token === AUTHENTICATION_TOKEN
    ? null
    : errorCommand("Only authorized users can use this bot");
}
