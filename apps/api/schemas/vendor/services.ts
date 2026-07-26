import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'services',
  actor: 'vendor',
  timestamps: true,
  columns: {
    service_id: string().required().unique(),
    name: string().required(),
    description: string(),
    price: number(),
    unit: string().enum(['per_event', 'per_hour', 'package']).default('per_event'),
  },
});
