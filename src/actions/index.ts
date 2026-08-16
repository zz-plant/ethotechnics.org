import { defineAction } from "astro:actions";
import { z } from "zod";

const intakeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ message: "Invalid email address" }),
  organization: z.string().optional(),
  topic: z.string().min(1, "Topic is required"),
  details: z.string().min(10, "Details must be at least 10 characters"),
});

export const server = {
  intake: defineAction({
    accept: "form",
    input: intakeSchema,
    handler: (input) => {
      // In a real application, you would save this to a database or send an email.
      const { name, topic } = input;
      // For now, we'll just return success.
      return {
        success: true,
        message: `Thank you, ${name}. We've received your ${topic} request.`,
      };
    },
  }),
};
