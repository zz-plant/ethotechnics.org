import { defineAction, z } from 'astro:actions';

export const server = {
  intake: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email address'),
      organization: z.string().optional(),
      topic: z.string().min(1, 'Topic is required'),
      details: z.string().min(10, 'Details must be at least 10 characters'),
    }),
    handler: async (input) => {
      // In a real application, you would save this to a database or send an email.
      // For now, we'll just log it and return success.
      console.log('Intake form submission:', input);
      
      // Simulate a small delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Thank you for your submission. We've received your details.",
      };
    },
  }),
};
