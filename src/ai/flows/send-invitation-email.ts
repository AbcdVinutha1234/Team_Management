'use server';
/**
 * @fileOverview A Genkit flow that handles generating and "sending" invitation emails.
 *
 * - sendInvitationEmail - A function that triggers the invitation process.
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

const prompt = ai.definePrompt({
  name: 'invitationEmailPrompt',
  input: { schema: SendInvitationEmailInputSchema },
  output: { schema: z.object({ body: z.string() }) },
  prompt: `You are the WorkLink automated workspace assistant. 
  
  Generate a professional, warm, and clear invitation email for {{recipientName}}.
  They have been invited by {{inviterName}} to join the "{{workspaceName}}" professional workspace.
  
  The email should:
  1. Clearly state who invited them.
  2. Explain that WorkLink is a collaborative platform for project and task management.
  3. Encourage them to sign up to start collaborating.
  4. Maintain a sleek, modern, and professional tone.
  
  Return the email body as a string.`,
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
    const { output } = await prompt(input);
    
    // In a production environment, this is where you would integrate with an 
    // email service like SendGrid, Postmark, or Firebase Extensions (Trigger Email).
    // For this prototype, we simulate the 'send' action.
    console.log(`[SIMULATED EMAIL SYSTEM] Sending invitation to ${input.recipientEmail}...`);
    console.log(`[CONTENT PREVIEW]:\n${output?.body}`);

    return {
      success: true,
      message: `Invitation successfully processed for ${input.recipientEmail}.`,
      emailPreview: output?.body || 'No content generated.',
    };
  }
);
