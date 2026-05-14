# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe"
  }
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
**GET** `/auth/me` 🔒

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "portfolio": [],
    "watchlist": []
  }
}
```

---

## Stock Endpoints

### Get All Stocks
**GET** `/stocks`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 175.43,
      "change": 2.15,
      "changePercent": 1.24,
      "volume": 52341234,
      "marketCap": 2750000000000,
      "high": 176.50,
      "low": 173.20,
      "lastUpdated": "2026-05-14T00:00:00.000Z"
    }
  ]
}
```

### Get Stock Details
**GET** `/stocks/:symbol`

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 175.43,
    "change": 2.15,
    "changePercent": 1.24,
    "volume": 52341234,
    "marketCap": 2750000000000,
    "high": 176.50,
    "low": 173.20,
    "open": 174.00,
    "previousClose": 173.28,
    "sector": "Technology",
    "industry": "Consumer Electronics"
  }
}
```

### Get Stock History
**GET** `/stocks/:symbol/history?period=1M`

**Query Parameters:**
- `period`: 1D, 1W, 1M, 3M, 1Y (default: 1M)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-04-14T00:00:00.000Z",
      "open": 170.50,
      "high": 172.30,
      "low": 169.80,
      "close": 171.45,
      "volume": 45234123
    }
  ]
}
```

### Get Market Movers
**GET** `/stocks/market/movers`

**Response:**
```json
{
  "success": true,
  "data": {
    "gainers": [...],
    "losers": [...]
  }
}
```

### Search Stocks
**GET** `/stocks/search/:query`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 175.43
    }
  ]
}
```

---

## Prediction Endpoints

### Get Predictions
**GET** `/predictions/:symbol`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "currentPrice": 175.43,
      "predictedPrice": 182.50,
      "predictionDate": "2026-05-21T00:00:00.000Z",
      "confidence": 78,
      "trend": "bullish",
      "model": "LSTM",
      "features": {
        "volatility": 0.0234,
        "momentum": 0.0456,
        "volume": 52341234
      },
      "createdAt": "2026-05-14T00:00:00.000Z"
    }
  ]
}
```

### Generate Prediction
**POST** `/predictions/:symbol` 🔒

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "currentPrice": 175.43,
    "predictedPrice": 182.50,
    "confidence": 78,
    "trend": "bullish",
    "priceChange": 7.07,
    "priceChangePercent": 4.03
  }
}
```

### Get Latest Prediction
**GET** `/predictions/:symbol/latest`

---

## Sentiment Endpoints

### Get Sentiment
**GET** `/sentiment/:symbol`

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "score": 0.65,
    "sentiment": "positive",
    "sources": [
      {
        "type": "news",
        "title": "Apple Reports Strong Q4 Earnings",
        "content": "Apple exceeded expectations...",
        "url": "https://example.com/news/1",
        "score": 0.8,
        "publishedAt": "2026-05-13T00:00:00.000Z"
      }
    ],
    "summary": "Overall sentiment for AAPL is positive...",
    "confidence": 85,
    "metrics": {
      "newsCount": 10,
      "positiveCount": 7,
      "negativeCount": 2,
      "neutralCount": 1
    }
  }
}
```

### Analyze Sentiment
**POST** `/sentiment/:symbol` 🔒

### Get Sentiment History
**GET** `/sentiment/:symbol/history`

---

## Portfolio Endpoints

### Get Portfolio
**GET** `/portfolio` 🔒

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "symbol": "AAPL",
        "quantity": 10,
        "buyPrice": 150.00,
        "buyDate": "2026-01-15T00:00:00.000Z",
        "currentPrice": 175.43,
        "currentValue": 1754.30,
        "investedValue": 1500.00,
        "profitLoss": 254.30,
        "profitLossPercent": 16.95
      }
    ],
    "summary": {
      "totalInvested": 1500.00,
      "totalCurrent": 1754.30,
      "totalProfitLoss": 254.30,
      "totalProfitLossPercent": 16.95
    }
  }
}
```

### Add to Portfolio
**POST** `/portfolio` 🔒

**Request Body:**
```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "buyPrice": 150.00
}
```

### Remove from Portfolio
**DELETE** `/portfolio/:id` 🔒

---

## Watchlist Endpoints

### Get Watchlist
**GET** `/watchlist` 🔒

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "addedAt": "2026-05-14T00:00:00.000Z",
      "stockData": {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "price": 175.43,
        "change": 2.15,
        "changePercent": 1.24
      }
    }
  ]
}
```

### Add to Watchlist
**POST** `/watchlist` 🔒

**Request Body:**
```json
{
  "symbol": "AAPL"
}
```

### Remove from Watchlist
**DELETE** `/watchlist/:symbol` 🔒

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API requests are limited to:
- **100 requests per 15 minutes** for authenticated users
- **20 requests per 15 minutes** for unauthenticated users

---

## WebSocket Events

Connect to: `ws://localhost:5000`

### Events

**Client → Server:**
- `subscribe` - Subscribe to stock updates
  ```json
  { "symbol": "AAPL" }
  ```
- `unsubscribe` - Unsubscribe from stock updates
  ```json
  { "symbol": "AAPL" }
  ```

**Server → Client:**
- `market-update` - Real-time market updates
  ```json
  {
    "symbol": "AAPL",
    "price": 175.43,
    "change": 2.15,
    "timestamp": "2026-05-14T00:00:00.000Z"
  }
  ```

---

🔒 = Requires Authentication
