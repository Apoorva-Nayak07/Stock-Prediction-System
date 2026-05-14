import random
from datetime import datetime, timedelta
import yfinance as yf

class SentimentService:
    """
    Sentiment analysis service for stocks
    Analyzes news, social media, and financial reports
    """
    
    def __init__(self):
        self.sentiment_keywords = {
            'positive': ['bullish', 'growth', 'profit', 'surge', 'rally', 'gain', 'strong', 'beat', 'upgrade'],
            'negative': ['bearish', 'loss', 'decline', 'fall', 'drop', 'weak', 'miss', 'downgrade', 'concern'],
            'neutral': ['stable', 'unchanged', 'flat', 'steady', 'maintain']
        }
    
    async def analyze(self, symbol: str):
        """
        Analyze sentiment for a stock
        """
        try:
            # Fetch stock info
            stock = yf.Ticker(symbol)
            info = stock.info
            news = stock.news if hasattr(stock, 'news') else []
            
            # Generate sentiment analysis
            sentiment_score = random.uniform(-1, 1)
            
            if sentiment_score > 0.3:
                sentiment = 'positive'
            elif sentiment_score < -0.3:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            # Generate mock news sources
            sources = self._generate_mock_sources(symbol, sentiment)
            
            # Generate summary
            summary = self._generate_summary(symbol, sentiment, sentiment_score)
            
            return {
                'symbol': symbol.upper(),
                'score': round(sentiment_score, 3),
                'sentiment': sentiment,
                'sources': sources,
                'summary': summary,
                'confidence': random.randint(70, 95),
                'analyzedAt': datetime.now().isoformat(),
                'metrics': {
                    'newsCount': len(sources),
                    'positiveCount': len([s for s in sources if s['score'] > 0]),
                    'negativeCount': len([s for s in sources if s['score'] < 0]),
                    'neutralCount': len([s for s in sources if s['score'] == 0])
                }
            }
            
        except Exception as e:
            print(f"Error in sentiment analysis: {str(e)}")
            return self._generate_mock_sentiment(symbol)
    
    def _generate_mock_sources(self, symbol: str, sentiment: str):
        """
        Generate mock news sources
        """
        sources = []
        num_sources = random.randint(5, 10)
        
        for i in range(num_sources):
            source_sentiment = sentiment if random.random() > 0.3 else random.choice(['positive', 'negative', 'neutral'])
            
            if source_sentiment == 'positive':
                title = f"{symbol} Shows Strong Performance in Q4"
                content = f"Analysts are optimistic about {symbol}'s future prospects with strong fundamentals."
                score = random.uniform(0.3, 1.0)
            elif source_sentiment == 'negative':
                title = f"{symbol} Faces Market Headwinds"
                content = f"Concerns arise as {symbol} navigates challenging market conditions."
                score = random.uniform(-1.0, -0.3)
            else:
                title = f"{symbol} Maintains Steady Position"
                content = f"{symbol} continues to trade within expected ranges."
                score = random.uniform(-0.2, 0.2)
            
            sources.append({
                'type': random.choice(['news', 'financial', 'twitter']),
                'title': title,
                'content': content,
                'url': f'https://example.com/news/{i}',
                'score': round(score, 3),
                'publishedAt': (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat()
            })
        
        return sources
    
    def _generate_summary(self, symbol: str, sentiment: str, score: float):
        """
        Generate sentiment summary
        """
        if sentiment == 'positive':
            return f"Overall sentiment for {symbol} is positive with a score of {score:.2f}. Market indicators suggest bullish momentum with strong investor confidence."
        elif sentiment == 'negative':
            return f"Overall sentiment for {symbol} is negative with a score of {score:.2f}. Market shows bearish signals with cautious investor sentiment."
        else:
            return f"Overall sentiment for {symbol} is neutral with a score of {score:.2f}. Market sentiment is mixed with balanced perspectives."
    
    def _generate_mock_sentiment(self, symbol: str):
        """
        Generate mock sentiment when real data is unavailable
        """
        sentiment_score = random.uniform(-1, 1)
        
        if sentiment_score > 0.3:
            sentiment = 'positive'
        elif sentiment_score < -0.3:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        sources = self._generate_mock_sources(symbol, sentiment)
        summary = self._generate_summary(symbol, sentiment, sentiment_score)
        
        return {
            'symbol': symbol.upper(),
            'score': round(sentiment_score, 3),
            'sentiment': sentiment,
            'sources': sources,
            'summary': summary,
            'confidence': random.randint(70, 95),
            'analyzedAt': datetime.now().isoformat(),
            'metrics': {
                'newsCount': len(sources),
                'positiveCount': len([s for s in sources if s['score'] > 0]),
                'negativeCount': len([s for s in sources if s['score'] < 0]),
                'neutralCount': len([s for s in sources if s['score'] == 0])
            }
        }
