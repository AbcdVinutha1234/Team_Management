'use server';
/**
 * @fileOverview An AI agent that suggests detailed descriptions and subtasks for a given task title and project context.
 *
 * - aiTaskDetailSuggestion - A function that handles the AI task detail suggestion process.
 * - AITaskDetailSuggestionInput - The input type for the aiTaskDetailSuggestion function.
 * - AITaskDetailSuggestionOutput - The return type for the aiTaskDetailSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITaskDetailSuggestionInputSchema = z.object({
  taskTitle: z
    .string()
    .describe('The brief title of the task for which to generate details.'),
  projectContext: z
    .string()
    .optional()
    .describe('Optional context about the project the task belongs to.'),
});
export type AITaskDetailSuggestionInput = z.infer<
  typeof AITaskDetailSuggestionInputSchema
>;

const AITaskDetailSuggestionOutputSchema = z.object({
  detailedDescription: z
    .string()
    .describe('A detailed description for the task.'),
  subtasks: z
    .array(z.string())
    .describe('A list of suggested subtasks to complete the main task.'),
});
export type AITaskDetailSuggestionOutput = z.infer<
  typeof AITaskDetailSuggestionOutputSchema
>;

export async function aiTaskDetailSuggestion(
  input: AITaskDetailSuggestionInput
): Promise<AITaskDetailSuggestionOutput> {
  return aiTaskDetailSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskDetailSuggestionPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: AITaskDetailSuggestionInputSchema},
  output: {schema: AITaskDetailSuggestionOutputSchema},
  prompt: `You are an expert project manager. Your goal is to help users quickly define tasks.

Based on the provided task title and optional project context, generate a detailed description for the task and a list of actionable subtasks.

Project Context: {{{projectContext}}}
Task Title: {{{taskTitle}}}

Please ensure the output is structured as a JSON object with the following fields:
- 'detailedDescription': A string providing a comprehensive description of the task.
- 'subtasks': An array of strings, where each string is a distinct subtask required to complete the main task.`,
});

const aiTaskDetailSuggestionFlow = ai.defineFlow(
  {
    name: 'aiTaskDetailSuggestionFlow',
    inputSchema: AITaskDetailSuggestionInputSchema,
    outputSchema: AITaskDetailSuggestionOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      // Fallback if AI fails
      return {
        detailedDescription: `Task: ${input.taskTitle}. Please provide further details for this task.`,
        subtasks: ["Initial research", "Core implementation", "Final review"]
      };
    }
  }
);
