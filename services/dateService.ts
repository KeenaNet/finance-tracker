
import { RecurrenceFrequency } from '../types.ts';

export const dateService = {
  calculateNextDueDate: (currentDueDate: string, frequency: RecurrenceFrequency): Date => {
    const nextDate = new Date(currentDueDate);
    
    // Set time to noon to avoid timezone/DST issues when adding days/months
    nextDate.setHours(12, 0, 0, 0);

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        // This handles cases like Jan 31 -> Feb 28/29 correctly
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    return nextDate;
  },
};