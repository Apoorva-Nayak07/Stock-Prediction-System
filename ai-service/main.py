from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from services.prediction_service import PredictionService
from services.sentiment_service import SentimentService
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI Stock Market Service",
    description="AI-powered stock prediction and sentiment analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
prediction_service = PredictionService()
sentiment_service = SentimentService()

# Request models
class PredictionRequest(BaseModel):
    symbol: str

class SentimentRequest(BaseModel):
    symbol: str

@app.get("/")
async def root():
    return {
        "message": "AI Stock Market Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/predict")
async def predict_stock(request: PredictionRequest):
    """
    Generate AI-powered stock price prediction
    """
    try:
        prediction = await prediction_service.predict(request.symbol)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sentiment")
async def analyze_sentiment(request: SentimentRequest):
    """
    Analyze sentiment for a stock from news and social media
    """
    try:
        sentiment = await sentiment_service.analyze(request.symbol)
        return sentiment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/{symbol}")
async def get_prediction(symbol: str):
    """
    Get stock prediction for a symbol
    """
    try:
        prediction = await prediction_service.predict(symbol)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sentiment/{symbol}")
async def get_sentiment(symbol: str):
    """
    Get sentiment analysis for a symbol
    """
    try:
        sentiment = await sentiment_service.analyze(symbol)
        return sentiment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
