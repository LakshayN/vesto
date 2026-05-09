# Vestro - AI-Powered Trading Platform

## 🚀 Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Upstox credentials:

```bash
cp .env.example .env.local
```

Add your Upstox Developer API credentials:
- `UPSTOX_API_KEY` — from Upstox Developer Console
- `UPSTOX_API_SECRET` — from Upstox Developer Console
- `UPSTOX_REDIRECT_URI` — where Upstox sends the auth code (`http://127.0.0.1:3000` for local, or your Netlify URL)

### 2. Generate Tokens

Visit this URL in your browser (replace `YOUR_API_KEY`):

```
https://api.upstox.com/v2/login/authorization/dialog?client_id=YOUR_API_KEY&redirect_uri=http://127.0.0.1:3000&response_type=code
```

Login, then the page redirects to something like `http://127.0.0.1:3000?code=XXXX`.

Run the token exchange:

```bash
curl -X POST https://api.upstox.com/v2/login/authorization/token \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "code=XXXX" \
  -d "client_id=YOUR_API_KEY" \
  -d "client_secret=YOUR_API_SECRET" \
  -d "redirect_uri=http://127.0.0.1:3000" \
  -d "grant_type=authorization_code"
```

Save the returned `access_token` and `refresh_token` in your `.env.local`.

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Deploy to Netlify

Push to main branch, Netlify auto-deploys. **Important:** Set environment variables in Netlify dashboard (same keys as `.env.local`).

Netlify handles auto-refresh: when the access token expires, the serverless function automatically refreshes it using the refresh token (as long as `UPSTOX_REFRESH_TOKEN` is set).

## 📡 API Endpoints

All endpoints are Next.js API routes at `vestroai.com/api/*`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portfolio` | GET | Full portfolio value, holdings breakdown, available cash |
| `/api/holdings` | GET | Long-term holdings list |
| `/api/funds` | GET | Available margin and funds |
| `/api/order/place` | POST | Place a buy/sell order |
| `/api/order/positions` | GET | Current day positions |
| `/api/quotes?instruments=...` | GET | Live market quotes |
| `/api/token/auth` | POST | Exchange auth code for tokens |
| `/api/token/refresh` | POST | Refresh access token |

### Example: Get Portfolio Value

```bash
curl https://vestroai.com/api/portfolio
```

### Example: Place Buy Order

```bash
curl -X POST https://vestroai.com/api/order/place \
  -H "Content-Type: application/json" \
  -d '{
    "instrument_token": "NSE_EQ|INE038A01020",
    "quantity": 10,
    "transaction_type": "BUY",
    "order_type": "MARKET",
    "product": "D"
  }'
```

## 🧠 Token Lifecycle

- **Access token** expires daily (~6 hours) — auto-refreshed by API routes
- **Refresh token** lasts months — set once in env vars
- **No need** to stay logged into Upstox after generating the refresh token
