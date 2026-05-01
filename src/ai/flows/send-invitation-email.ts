'use server';
/**
 * @fileOverview A Genkit flow that handles generating professional invitation emails and sending them via SMTP.
 *
 * - sendInvitationEmail - A function that triggers the AI generation and SMTP process.
 * - SendInvitationEmailInput - The input type for the invitation flow.
 * - SendInvitationEmailOutput - The return type for the invitation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import nodemailer from 'nodemailer';

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
  model: 'googleai/gemini-pro',
  input: { schema: SendInvitationEmailInputSchema },
  output: { 
    schema: z.object({
      emailBody: z.string().describe('The generated email body text.')
    }) 
  },
  prompt: `You are the WorkLink automated workspace assistant. 
  
  Generate a professional, warm, and clear invitation email for {{{recipientName}}}.
  They have been invited by {{{inviterName}}} to join the "{{{workspaceName}}}" professional workspace.
  
  Return the result as a JSON object with an 'emailBody' field containing the text.`,
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
    let emailContent = `Hi ${input.recipientName}, you have been invited to join ${input.workspaceName} by ${input.inviterName}. We look forward to seeing you there!`;
    let generationStatus = "Default fallback message used.";

    try {
      const { output } = await prompt(input);
      if (output?.emailBody) {
        emailContent = output.emailBody;
        generationStatus = "AI content generated successfully.";
      }
    } catch (error: any) {
      console.error("AI Generation failed, using fallback:", error.message);
      generationStatus = `AI Fallback: ${error.message}`;
    }

    let smtpResult = "SMTP not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS to environment variables.";
    let deliverySuccess = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"WorkLink" <invites@worklink.ai>',
          to: input.recipientEmail,
          subject: `Join ${input.workspaceName}`,
          text: emailContent,
        });
        
        smtpResult = `Invitation delivered to ${input.recipientEmail}.`;
        deliverySuccess = true;
      } catch (smtpError: any) {
        smtpResult = `SMTP Error: ${smtpError.message}`;
      }
    }

    return {
      success: deliverySuccess,
      message: `${generationStatus} ${smtpResult}`,
      emailPreview: emailContent,
    };
  }
);
