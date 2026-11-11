const express = require('express');
const app = express();
 // Porta su cui gira il servizio di persistenza

app.use(express.json());
app.use('/api', require('./persistenceRoutes'));

    
app.listen(env.PORT, () => {
  console.log(`Servizio Persistence attivo sulla porta ${env.PORT}`);
});