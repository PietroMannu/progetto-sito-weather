#Vedi google drive segreti_privati.env

# Progetto Sito Weather

Applicazione a **microservizi**: un gateway unico smista le richieste ai servizi.
Login con Google, meteo (OpenWeather), scheda FBI del giorno e salvataggio utenti su MongoDB Atlas.

## Architettura

```
Browser ──> Gateway (4000) ─┬─ /api/v1/auth        -> auth-service        (3001)
                            ├─ /api/v1/persistence -> persistance-service (5001) -> MongoDB Atlas
                            ├─ /api/v1/wanted      -> wanted-service      (3002, Python)
                            └─ /api/v1/...         -> service             (3000, pagine e meteo)
```

| Servizio | Porta | File di avvio |
|---|---|---|
| gateway | 4000 | `backend/gateway/src/gateway.js` |
| service | 3000 | `backend/service/src/server.js` |
| auth-service | 3001 | `backend/auth-service/src/authserver.js` |
| wanted-service | 3002 | `backend/wanted-service/server.py` |
| persistance-service | 5001 | `backend/persistance-service/src/persistenceServer.js` |

Il sito si apre sempre dal gateway: **http://localhost:4000/api/v1/**

## Come funziona il login

1. L'utente clicca "Login With Google" (`/api/v1/auth/google`).
2. L'auth-service riceve nome ed email da Google e crea un **token JWT** firmato.
3. L'auth-service invia il token al persistance-service, che salva o aggiorna l'utente su MongoDB.
4. Il browser riceve lo stesso token in un cookie (`token`).
5. Il persistance-service accetta solo richieste con un token valido e restituisce **solo i dati di quell'utente**.

## Requisiti

- Node.js 18 o superiore
- Python 3 (per il wanted-service)
- Un account Google Cloud (credenziali OAuth), un cluster MongoDB Atlas e una chiave OpenWeather

## Installazione

1. `git clone` del repository
2. Doppio clic su **`installa.bat`** (installa le dipendenze di ogni servizio)
3. Crea i file `.env` (vedi sotto)
4. Doppio clic su **`avvia.bat`**

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
JWT_SECRET=<stringa casuale, UGUALE a quella del persistance-service>
SESSION_SECRET=<un'altra stringa casuale>
PERSISTENCE_URL=http://localhost:5001
```

### `backend/persistance-service/.env`
```
PORT=5001
MONGO_URI=mongodb+srv://<utente>:<password>@<cluster>.mongodb.net/?appName=Cluster0
DB_NAME=progetto
JWT_SECRET=<UGUALE a quella dell'auth-service>
```

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
- `JWT_SECRET` deve essere **identico** in auth-service e persistance-service, altrimenti il persistance risponde 401.
- Su Google Cloud, in "URI di reindirizzamento autorizzati", deve esserci `http://localhost:3001/google/callback`.
- Finché l'app Google è in modalità Test, possono fare login solo gli utenti aggiunti come "utenti di test".
- Su Atlas, in Network Access, deve esserci l'IP del computer che si sta usando.

## Test rapido del database

1. Senza login, apri `http://localhost:4000/api/v1/persistence/users/me`: deve rispondere **401**.
2. Fai il login con Google dalla navbar.
3. Nella home clicca "Carica dati dal database": compare il JSON dell'utente salvato su MongoDB.
4. Su Atlas, Browse Collections, database `progetto`, collezione `users`: c'è il documento.

## Problemi comuni

| Sintomo | Causa |
|---|---|
| `La variabile ... non è definita` | manca una riga nel `.env` di quel servizio |
| `bad auth` o `Authentication failed` (persistance) | password di Atlas sbagliata nel `MONGO_URI` |
| timeout verso Atlas | l'IP non è in Network Access |
| `Salvataggio utente fallito: persistence ha risposto 401` | `JWT_SECRET` diverso tra auth e persistance |
| `redirect_uri_mismatch` | URI di reindirizzamento non registrato su Google Cloud |
| `access_denied` (403) | l'account non è tra gli utenti di test |
| il bottone dei dati dà 401 | cookie `token` assente: fare logout e login |
