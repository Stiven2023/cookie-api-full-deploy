import app from './app.js';
import './database.js';
import './socketConfig.js'

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 
