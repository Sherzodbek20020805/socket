import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { v4 } from 'uuid';

interface IMessage {
  id: string;
  username: string;
  message: string;
  time: string;
}

@Injectable()
export class ChatService {
  private messages: IMessage[] = [];

  sendMessage(username: string, message: string): IMessage {
    const newMessage = {
      id: v4(),
      username,
      message,
      time: new Date().toLocaleTimeString(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  deleteMessage(messageId: string): boolean {
    const index = this.messages.findIndex(
      (message) => message.id === messageId,
    );
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }
}
