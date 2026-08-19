import { z } from 'zod';

export const newProjectSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  clientName: z.string().min(1, 'Client name is required'),
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(150, 'Project name cannot exceed 150 characters'),
  budget: z
    .number({ invalid_type_error: 'Budget must be a number' })
    .min(100, 'Budget must be at least $100'),
  status: z.enum(['planning', 'in_progress', 'on_hold', 'completed']),
  progressPercentage: z.number().min(0).max(100),
  deadline: z.string().optional(),
});

export type NewProjectFormData = z.infer<typeof newProjectSchema>;
