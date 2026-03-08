import yfinance as yf
import numpy as np
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from models.classical import classical_predict
from models.quantum import quantum_predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow any origin during development so the frontend can run on dynamic ports
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return FileResponse("static/index.html")

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
        "quantum_time": quantum_time,        "classical_train_accuracy": float(classical_acc),
        "quantum_train_accuracy": float(quantum_acc),        "winner": winner,
        "market_direction": market_direction,
        "direction_confidence": float(direction_confidence),
        "chart_data": chart_data
    }