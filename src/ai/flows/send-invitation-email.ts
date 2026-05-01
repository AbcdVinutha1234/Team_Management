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
  model: 'googleai/gemini-1.5-flash',
  input: { schema: SendInvitationEmailInputSchema },
  output: { 
    schema: z.object({
      emailBody: z.string().describe('The generated email body text.')
    }) 
  },
  prompt: `You are the WorkLink automated workspace assistant. 
  
  Generate a professional, warm, and clear invitation email for {{{recipientName}}}.
  They have been invited by {{{inviterName}}} to join the "{{{workspaceName}}}" professional workspace.
  Include a mention of collaborating on tasks and projects.
  
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
    // Default professional message as fallback
    let emailContent = `Hi ${input.recipientName},\n\nYou've been invited by ${input.inviterName} to join the ${input.workspaceName} professional workspace on WorkLink. We're excited to have you on board to collaborate on projects and manage tasks more efficiently.\n\nSee you in the workspace!\n\nBest regards,\nThe ${input.workspaceName} Team`;
    let generationStatus = "Default message used.";

    try {
      const { output } = await prompt(input);
      if (output?.emailBody) {
        emailContent = output.emailBody;
        generationStatus = "AI content generated successfully.";
      }
    } catch (error: any) {
      console.warn("AI Generation failed, using static fallback:", error.message);
      generationStatus = "AI Fallback triggered.";
    }

    let smtpResult = "SMTP not configured. Please add SMTP_HOST, SMTP_USER, and SMTP_PASS to environment variables.";
    let deliverySuccess = false;

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
      SMTP_SECURE
    } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: SMTP_SECURE === 'true',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: SMTP_FROM || '"WorkLink" <invites@worklink.ai>',
          to: input.recipientEmail,
          subject: `Invitation to join ${input.workspaceName}`,
          text: emailContent,
        });
        
        smtpResult = `Invitation successfully delivered to ${input.recipientEmail}.`;
        deliverySuccess = true;
      } catch (smtpError: any) {
        smtpResult = `SMTP Delivery Error: ${smtpError.message}`;
        console.error("SMTP Error:", smtpError);
      }
    }

    return {
      success: deliverySuccess,
      message: `${generationStatus} ${smtpResult}`,
      emailPreview: emailContent,
    };
  }
);
