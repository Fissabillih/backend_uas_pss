import { Role } from '@prisma/client';

// Override passport's Express.User augmentation to match our AuthPayload
// This allows middleware using AuthenticatedRequest to work correctly
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: Role;
    }
  }
}
