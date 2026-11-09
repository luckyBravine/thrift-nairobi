import { eq } from 'drizzle-orm';
import { Router } from 'express';
import * as authSchema from '../db/auth-schema';
import { db } from '../db/client';
import { AppError } from '../errors/AppError';
import { requireStaffIdentity } from '../middlewares/require-role';

const staffAuthRouter = Router();

staffAuthRouter.get('/state', ...requireStaffIdentity, async (req, res) => {
  const userId = req.session?.user.id;
  if (!userId) throw new AppError(401, 'Unauthorized');

  const [user] = await db
    .select({ twoFactorEnabled: authSchema.user.twoFactorEnabled })
    .from(authSchema.user)
    .where(eq(authSchema.user.id, userId))
    .limit(1);

  if (!user) throw new AppError(401, 'Unauthorized');
  res.json({ twoFactorEnabled: user.twoFactorEnabled });
});

export { staffAuthRouter };
