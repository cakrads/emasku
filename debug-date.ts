
import { z } from 'zod';

const CreateHoldingRequestSchema = z.object({
  brandCode: z.string().min(1, 'Brand code is required'),
  denominationGram: z.number().positive('Weight must be greater than 0'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
  buyPrice: z.number().int().nonnegative('Buy price cannot be negative').optional(),
  buyDate: z.string().datetime('Invalid date format').refine(
    (date) => new Date(date) <= new Date(),
    'Buy date cannot be in the future'
  ).optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
})

const payload1 = {
  "brandCode": "ANTAM",
  "denominationGram": 1,
  "quantity": 1
}

const payload2 = {
  "brandCode": "ANTAM",
  "denominationGram": 1,
  "quantity": 1,
  "buyDate": "2026-01-01T00:00:00.000Z"
}

console.log("--- Payload 1 ---");
const parsed1 = CreateHoldingRequestSchema.safeParse(payload1);
if (parsed1.success) {
  console.log("Parsed 1 success:", parsed1.data);
  const date = parsed1.data.buyDate ? new Date(parsed1.data.buyDate) : new Date();
  console.log("Resulting Date 1:", date.toISOString());
} else {
  console.log("Parsed 1 error:", parsed1.error);
}

console.log("\n--- Payload 2 ---");
const parsed2 = CreateHoldingRequestSchema.safeParse(payload2);
if (parsed2.success) {
  console.log("Parsed 2 success:", parsed2.data);
  const date = parsed2.data.buyDate ? new Date(parsed2.data.buyDate) : new Date();
  console.log("Resulting Date 2:", date.toISOString());
} else {
  console.log("Parsed 2 error:", parsed2.error);
}
