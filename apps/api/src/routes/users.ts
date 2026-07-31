import { Router, Request, Response } from 'express';

const router = Router();

router.get('/me', (req: Request, res: Response) => {
  res.json({ message: 'User profile endpoint — connect Supabase auth middleware here' });
});

router.put('/me', (req: Request, res: Response) => {
  const { name, bio } = req.body;
  res.json({ updated: true, name, bio });
});

export default router;
