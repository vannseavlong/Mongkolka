import { defineTable, string, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'couple_members',
  actor: 'admin',
  timestamps: true,
  columns: {
    member_id: string().required().unique(),
    couple_id: string().required().ref('couples.couple_id'),
    user_id: string().required().ref('users.user_id'),
    member_role: string().enum(['partner', 'collaborator']).default('partner'),
    invited_by: string().ref('users.user_id'),
    joined_at: date(),
  },
});
