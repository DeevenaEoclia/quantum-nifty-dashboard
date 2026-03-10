import yfinance as yf
import numpy as np
import time
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .models.classical import classical_predict
from .models.quantum import quantum_predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow any origin during development so the frontend can run on dynamic ports
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Resolve frontend path: support both local development and Docker deployment
base_dir = os.path.dirname(__file__)
dev_frontend = os.path.join(base_dir, "../frontend/dist")
prod_frontend = os.path.join(base_dir, "static")

if os.path.exists(prod_frontend) and os.path.exists(os.path.join(prod_frontend, "index.html")):
    frontend_path = prod_frontend
elif os.path.exists(dev_frontend) and os.path.exists(os.path.join(dev_frontend, "index.html")):
    frontend_path = dev_frontend
else:
    frontend_path = None

if frontend_path:
    # Mount assets if they exist (Vite builds usually have an assets folder)
    assets_path = os.path.join(frontend_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/")
    def read_root():
        return FileResponse(os.path.join(frontend_path, "index.html"))

    # Also catch-all for SPAs if needed, but for now just the root
else:
    @app.get("/")
    def read_root():
        return {"message": "Quantum Predict Dashboard API is running (Frontend not found)"}

@app.get("/api/predict")
def predict(symbol: str = "RELIANCE.NS"):
    """
    Predict market direction for a given stock symbol
    Default: RELIANCE.NS (Reliance Industries)
    Popular NSE symbols: RELIANCE.NS, TCS.NS, HDFCBANK.NS, ICICIBANK.NS, INFY.NS, etc.
    """

    try:
        data = yf.download(symbol, period="60d")["Close"]
    except Exception as e:
        # Fallback to Nifty 50 if symbol not found
        data = yf.download("^NSEI", period="60d")["Close"]
        symbol = "^NSEI (Nifty 50)"

    prices = np.array(data)

    current_price = float(prices[-1].item() if hasattr(prices[-1], 'item') else prices[-1])

    start = time.time()
    classical_pred, classical_mse, classical_acc = classical_predict(prices)
    classical_time = time.time() - start

    start = time.time()
    quantum_pred, quantum_mse, quantum_acc = quantum_predict(prices)
    quantum_time = time.time() - start

    classical_conf = 1/(classical_mse+1e-6)
    quantum_conf = 1/(quantum_mse+1e-6)

    winner = "Quantum" if quantum_conf > classical_conf else "Classical"

    # Determine market direction based on quantum prediction
    market_direction = "UP" if quantum_pred > current_price else "DOWN"
    direction_confidence = abs(quantum_pred - current_price) / current_price * 100

    # Get recent price history for chart (last 30 days)
    recent_prices = prices[-30:] if len(prices) >= 30 else prices
    chart_data = [
        {"date": f"Day {i+1}", "price": float(price.item() if hasattr(price, 'item') else price)}
        for i, price in enumerate(recent_prices)
    ]

    return {
        "symbol": symbol,
        "current_price": current_price,
        "classical_prediction": float(classical_pred),
        "quantum_prediction": float(quantum_pred),
        "classical_confidence": float(classical_conf),
        "quantum_confidence": float(quantum_conf),
        "classical_time": classical_time,
        "quantum_time": quantum_time,
        "classical_train_accuracy": float(classical_acc),
        "quantum_train_accuracy": float(quantum_acc),
        "winner": winner,
        "market_direction": market_direction,
        "direction_confidence": float(direction_confidence),
        "chart_data": chart_data
    }

from pydantic import BaseModel
from typing import List, Dict

class AdvisoryRequest(BaseModel):
    symbol: str
    current_price: float
    classical_prediction: float
    quantum_prediction: float
    winner: str
    market_direction: str
    direction_confidence: float
    classical_train_accuracy: float
    quantum_train_accuracy: float

@app.post("/api/advisory")
def get_advisory(data: AdvisoryRequest):
    """
    Generate a technical AI advisory summary based on model results.
    """
    # Logic to generate a professional summary
    symbol_name = data.symbol.replace(".NS", "")
    direction = data.market_direction
    confidence = data.direction_confidence
    winner = data.winner
    
    # Analyze accuracy difference
    acc_diff = abs(data.quantum_train_accuracy - data.classical_train_accuracy)
    more_accurate = "Quantum" if data.quantum_train_accuracy > data.classical_train_accuracy else "Classical"
    
    summary = f"### Market Advisory for {symbol_name}\n\n"
    summary += f"Our analysis indicates a **{direction}** trend with a confidence level of **{confidence:.1f}%**. "
    
    if winner == "Quantum":
        summary += f"The **Quantum Variational Circuit (VQC)** has outperformed the classical model in this session, "
        summary += f"providing a more robust projection of price movement. "
    else:
        summary += f"The **Classical ML Model** currently shows higher stability for this specific asset. "
        
    summary += f"\n\n**Technical Insight:** The {more_accurate} model shows a training accuracy lead of {acc_diff:.1f}%. "
    
    if direction == "UP":
        summary += f"Bullish indicators suggest a target price near ₹{data.quantum_prediction:.2f}. "
        summary += "Consider monitoring volume support at current levels."
    else:
        summary += f"Bearish sentiment suggests a potential retracement toward ₹{data.quantum_prediction:.2f}. "
        summary += "Caution is advised as the model picks up increased volatility signatures."
        
    summary += "\n\n*Note: This is an AI-generated technical summary and does not constitute financial advice.*"

    return {"summary": summary}
