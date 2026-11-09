import { Router } from 'express';

const storefrontRouter = Router();

storefrontRouter.get('/health', (_req, res) => {
  res.json({ ok: true });
});

export { storefrontRouter };
