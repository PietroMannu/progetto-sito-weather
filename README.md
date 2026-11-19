# Vedi Google Drive: segreti_privati.env

# Progetto Sito Weather

Applicazione a **microservizi**: un gateway unico smista le richieste ai servizi.
Login con Google, meteo (OpenWeather), scheda FBI del giorno e salvataggio utenti su MongoDB Atlas.

## Architettura

```
Browser ──> Gateway (4000) ─┬─ /api/v1/auth        -> auth-service        (3001)
                            ├─ /api/v1/persistence -> persistence-service (5001) -> MongoDB Atlas
                            ├─ /api/v1/wanted      -> wanted-service      (3002, Python)
                            └─ /api/v1/...         -> service             (3000, pagine e meteo)
```

| Servizio | Porta | File di avvio |
|---|---|---|
| gateway | 4000 | `backend/gateway/src/gateway.js` |
| service | 3000 | `backend/service/src/server.js` |
| auth-service | 3001 | `backend/auth-service/src/authserver.js` |
| wanted-service | 3002 | `backend/wanted-service/server.py` |
| persistence-service | 5001 | `backend/persistence-service/src/persistenceServer.js` |

Il sito si apre sempre dal gateway: **http://localhost:4000/api/v1/**

## Come funziona il login

1. L'utente clicca "Login With Google" (`/api/v1/auth/google`).
2. L'auth-service riceve nome ed email da Google e crea un **token JWT** firmato.
3. L'auth-service invia il token al persistence-service, che salva o aggiorna l'utente su MongoDB.
4. Il browser riceve lo stesso token in un cookie (`token`).
5. Il persistence-service accetta solo richieste con un token valido e restituisce **solo i dati di quell'utente**.

## Requisiti

- Node.js 18 o superiore
- Python 3 (per il wanted-service)
- Un account Google Cloud (credenziali OAuth), un cluster MongoDB Atlas e una chiave OpenWeather

## Installazione e avvio su un nuovo PC

Ogni volta che cloni il progetto su un altro computer, segui questi passaggi nell'ordine indicato:

1. **Clona il repository:** `git clone <url-repository>`
2. **Installa le dipendenze:** fai doppio clic su **`installa.bat`** (installa le cartelle `node_modules` per ogni microservizio Node).
3. **Crea i file `.env`:** recuperali dal file `segreti_privati.env` su Google Drive e inserisci i 3 file nelle rispettive cartelle (vedi sezione sotto).
4. **Abilita l'IP su MongoDB Atlas:**
   - Accedi a [MongoDB Atlas](https://cloud.mongodb.com/) → **Security → Network Access**.
   - Clicca su **+ ADD IP ADDRESS** → **ADD CURRENT IP ADDRESS** (oppure inserisci `0.0.0.0/0` per autorizzare l'accesso da qualsiasi PC/rete senza doverlo rifare ogni volta) e conferma.
   - Attendi 1–2 minuti finché lo stato della regola diventa **Attivo** (verde).
5. **Avvia i servizi:** fai doppio clic su **`avvia.bat`** e verifica nel terminale che `persistence-service` stampi `Connesso a MongoDB, database "progetto"` e `Persistance-service attivo su http://localhost:5001`.

## I file `.env`

I `.env` contengono password e **non stanno su GitHub** (sono nel `.gitignore`).
Vanno creati a mano su ogni computer, uno per servizio:

### `backend/service/.env`
```
PORT=3000
WEATHER_API_KEY=<chiave OpenWeather>
```

### `backend/auth-service/.env`
```
AUTH_PORT=3001
GOOGLE_CLIENT_ID=<client ID di Google Cloud>
GOOGLE_CLIENT_SECRET=<client secret di Google Cloud>
JWT_SECRET=<stringa casuale, UGUALE a quella del persistence-service>
SESSION_SECRET=<un'altra stringa casuale>
PERSISTENCE_URL=http://localhost:5001
```

### `backend/persistence-service/.env`
```
PORT=5001
MONGO_URI=mongodb+srv://<utente>:<password>@<cluster>.mongodb.net/?appName=Cluster0
DB_NAME=progetto
JWT_SECRET=<UGUALE a dell'auth-service quella>
```

### 'backend/movie-service/.env'

MOVIE_PORT=3003
TMDB_API_KEY=6ad3220102d4ecee9ea63940bc03baef

### Dove trovare i valori

| Valore | Dove |
|---|---|
| `WEATHER_API_KEY` | account OpenWeather, sezione API keys |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud, API e servizi, Credenziali, ID client OAuth |
| `MONGO_URI` | Atlas, Database, Connect, Drivers, Node.js |
| utente e password Atlas | Atlas, Database Access (la password si reimposta da Edit) |
| `JWT_SECRET`, `SESSION_SECRET` | si generano: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

Note:
- Se la password di Atlas contiene caratteri speciali, vanno codificati nell'URL (`#` diventa `%23`, `@` diventa `%40`). Meglio una password con sole lettere e numeri.
- `JWT_SECRET` deve essere **identico** in `auth-service` e `persistence-service`, altrimenti il persistence risponde 401.
- Su Google Cloud, in "URI di reindirizzamento autorizzati", deve esserci `http://localhost:3001/google/callback` (non serve cambiarlo cambiando PC).
- Finché l'app Google è in modalità Test, possono fare login solo gli utenti aggiunti come "utenti di test".
- Su Atlas, in Network Access, deve esserci l'IP del computer che si sta usando (oppure `0.0.0.0/0` per evitare blocchi quando cambia l'IP).

## Test rapido del database

1. Senza login, apri `http://localhost:4000/api/v1/persistence/users/me`: deve rispondere **401**.
2. Fai il login con Google dalla navbar.
3. Nella home clicca "Carica dati dal database": compare il JSON dell'utente salvato su MongoDB.
4. Su Atlas, Browse Collections, database `progetto`, collezione `users`: c'è il documento.

## Problemi comuni

| Sintomo | Causa e soluzione |
|---|---|
| `HTTP 504` cliccando "Carica dati dal database" / `Could not connect to any servers in your MongoDB Atlas cluster` | `persistence-service` non si avvia perché l'IP del PC attuale non è autorizzato su Atlas (*Network Access*). Aggiungi l'IP, attendi lo stato **Attivo**, esegui `taskkill /F /IM node.exe` nel prompt e rilancia `avvia.bat`. |
| `TokenError` al login con Google | Vecchi processi Node rimasti aperti in background (chiudili con `taskkill /F /IM node.exe`), pagina `/google/callback` ricaricata manualmente oppure orologio di Windows non sincronizzato. |
| `La variabile ... non è definita` | Manca una riga o il file `.env` in quel servizio. |
| `bad auth` o `Authentication failed` (persistence) | Password di Atlas sbagliata nel `MONGO_URI`. |
| `Salvataggio utente fallito: persistence ha risposto 401` | `JWT_SECRET` diverso tra `auth-service` e `persistence-service`. |
| `redirect_uri_mismatch` | URI di reindirizzamento non registrato su Google Cloud (`http://localhost:3001/google/callback`). |
| `access_denied` (403) | L'account Google non è tra gli utenti di test su Google Cloud. |
| Il bottone dei dati dà `401` o `404` | Cookie `token` assente o salvataggio non avvenuto al primo login: fare logout e di nuovo login con Google. |