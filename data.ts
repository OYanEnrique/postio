import { Column, Task } from './types';

// Este arquivo define o estado inicial do seu aplicativo.
// Como o app é somente para uso pessoal, os dados são persistidos no navegador.

export const APP_DATA: { columns: Column[]; tasks: Task[] } = {
  "columns": [
    {
      "id": "todo",
      "title": "To Do"
    },
    {
      "id": "in-progress",
      "title": "In Progress"
    },
    {
      "id": "done",
      "title": "Done"
    }
  ],
  "tasks": [
    {
      "id": "1",
      "columnId": "todo",
      "title": "Welcome to Postio!",
      "description": "Your minimalist, Material Design 3 kanban board.",
      "color": "bg-[#539190] text-white border-transparent",
      "completed": false,
      "createdAt": new Date().toISOString()
    },
    {
      "id": "2",
      "columnId": "in-progress",
      "title": "Data Persistence",
      "description": "Changes are saved automatically to your browser's local storage.",
      "color": "bg-[#83ecbb] border-[#539190]/20",
      "completed": false,
      "createdAt": new Date().toISOString()
    }
  ]
};