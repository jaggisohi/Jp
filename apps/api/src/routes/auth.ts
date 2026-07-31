import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ user: data.user, session: data.session });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  return res.json({ user: data.user, session: data.session });
});

router.post('/logout', async (_req: Request, res: Response) => {
  await supabase.auth.signOut();
  return res.json({ message: 'Logged out' });
});

export default router;
