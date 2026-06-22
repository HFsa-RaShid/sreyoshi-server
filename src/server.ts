import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './config';


const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});


io.on('connection', (socket) => {
  console.log('⚡ A user connected to socket:', socket.id);

  socket.on('join_room', (userId: string) => {
    socket.join(userId);
    console.log(`User joined personal room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


async function bootstrap() {
  try {
    console.log(process.env.DATABASE_URL);
    await mongoose.connect(config.database_url as string);
    console.log(`Database connected successfully!`);

    server.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect database', err);
  }
}

bootstrap();