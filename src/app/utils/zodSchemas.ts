import { z } from 'zod';
import { todoNameRegex, todoDescriptionRegex } from '@/app/utils/regex';

export const addTodoSchema = z.object({
  name: z
    .string()
    .max(255)
    .min(1, { message: 'Name is required!' })
    .regex(todoNameRegex, {
      message: 'Only special characters allowed - -/.,%|()[]',
    })
    .trim(),
  description: z
    .string()
    .max(255)
    .min(1, { message: 'Description is required!' })
    .regex(todoDescriptionRegex, {
      message: 'Only special characters allowed:  -/.,%|()[] ',
    })
    .trim(),
});

export const editTodoSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .max(255)
    .min(1, { message: 'Name is required!' })
    .regex(todoNameRegex, {
      message: 'Only special characters allowed - -/.,%|()[]',
    })
    .trim(),
  description: z
    .string()
    .max(255)
    .min(1, { message: 'Description is required!' })
    .regex(todoDescriptionRegex, {
      message: 'Only special characters allowed:  -/.,%|()[] ',
    })
    .trim(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
});
