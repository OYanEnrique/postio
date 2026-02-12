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
    "id": "1770922500429",
    "columnId": "in-progress",
    "title": "Curso \"Flutter: utilize animações da biblioteca Animations\"",
    "description": "Curso da Alura realizado durante o BootCamp Santander de desenvolvimento mobile 2025",
    "color": "bg-[#539190] text-white border-transparent",
    "completed": false,
    "createdAt": "2026-02-12T18:55:00.429Z"
  }
]
};