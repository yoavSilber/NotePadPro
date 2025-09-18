import app from './expressApp';
import { connectDB } from './config/db';
import { PORT } from './consts';

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
