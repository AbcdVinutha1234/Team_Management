
'use server';
/**
 * @fileOverview A Genkit flow that handles generating professional invitation emails for new workspace members.
 *
 * - sendInvitationEmail - A function that triggers the AI generation process.
 * - SendInvitationEmailInput - The input type for the invitation flow.
 * - SendInvitationEmailOutput - The return type for the invitation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendInvitationEmailInputSchema = z.object({
  recipientName: z.string().describe('The name of the person being invited.'),
  recipientEmail: z.string().email().describe('The email address of the person being invited.'),
  inviterName: z.string().describe('The name of the person sending the invitation.'),
  workspaceName: z.string().default('WorkLink').describe('The name of the workspace.'),
});
export type SendInvitationEmailInput = z.infer<typeof SendInvitationEmailInputSchema>;

const SendInvitationEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the invitation was successfully processed.'),
  message: z.string().describe('A summary message of the outcome.'),
  emailPreview: z.string().describe('The generated content of the invitation email.'),
});
export type SendInvitationEmailOutput = z.infer<typeof SendInvitationEmailOutputSchema>;

// Define a prompt that explicitly returns a string for the email body
const prompt = ai.definePrompt({
  name: 'invitationEmailPrompt',
  input: { schema: SendInvitationEmailInputSchema },
  output: { schema: z.string().describe('The generated email body text.') },
  prompt: `You are the WorkLink automated workspace assistant. 
  
  Generate a professional, warm, and clear invitation email for {{recipientName}}.
  They have been invited by {{inviterName}} to join the "{{workspaceName}}" professional workspace.
  
  The email should:
  1. Clearly state who invited them.
  2. Explain that WorkLink is a collaborative platform for project and task management.
  3. Encourage them to sign up to start collaborating.
  4. Maintain a sleek, modern, and professional tone.
  
  Return ONLY the email body as a string. Keep it concise and impactful.`,
});

export async function sendInvitationEmail(
  input: SendInvitationEmailInput
): Promise<SendInvitationEmailOutput> {
  return sendInvitationEmailFlow(input);
}

const sendInvitationEmailFlow = ai.defineFlow(
  {
    name: 'sendInvitationEmailFlow',
    inputSchema: SendInvitationEmailInputSchema,
    outputSchema: SendInvitationEmailOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      
      const emailContent = output || `Hi ${input.recipientName}, you've been invited to join ${input.workspaceName} by ${input.inviterName}. We look forward to working with you!`;

      // Server-side logging for verification during development
      console.log(`[SIMULATED EMAIL SYSTEM] Sending invitation to ${input.recipientEmail}...`);

      return {
        success: true,
        message: `Invitation successfully processed for ${input.recipientEmail}.`,
        emailPreview: emailContent,
      };
    } catch (error) {
      console.error('Genkit invitation flow error:', error);
      return {
        success: false,
        message: 'Failed to generate invitation content.',
        emailPreview: 'Error generating content.',
      };
    }
  }
);
