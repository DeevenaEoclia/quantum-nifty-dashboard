import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler

def classical_predict(data):

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(data.reshape(-1,1))

    X = []
    y = []

    for i in range(5, len(scaled)):
        X.append(scaled[i-5:i].flatten())
        y.append(scaled[i][0])

    X = np.array(X).reshape(len(X),5)
    y = np.array(y).flatten()

    model = RandomForestRegressor(n_estimators=50)
    model.fit(X,y)

    pred = model.predict([scaled[-5:].reshape(5)])

    mse = mean_squared_error(y, model.predict(X))
    train_acc = model.score(X, y) * 100  # R^2 score as percentage

    return scaler.inverse_transform(pred.reshape(-1,1))[0][0], mse, train_acc