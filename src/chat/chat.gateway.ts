import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected', client.id, client.handshake.time);
  }

  handleDisconnect(client: Socket) {
    console.log(
      'Client disconnected',
      client.id,
      new Date().toLocaleTimeString(),
    );
  }

  @SubscribeMessage('send-message')
  handleSendMessage(@MessageBody() payload: MessageDto) {
    const message = this.chatService.sendMessage(
      payload.username,
      payload.message,
    );
    this.server.emit('new-message', message);
  }

  @SubscribeMessage('delete-message')
  handleDeleteMessage(@MessageBody() messageId: string) {
    const success = this.chatService.deleteMessage(messageId);
    if (success) {
      this.server.emit('message-deleted', messageId);
    }
  }
}
