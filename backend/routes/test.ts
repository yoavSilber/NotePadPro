import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Test route works');
});

export default router;
