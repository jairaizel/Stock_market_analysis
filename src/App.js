import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import StockChart from './StockChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [stockSymbols, setStockSymbols] = useState(['AAPL']);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataType, setDataType] = useState('intraday');

  const fetchStockData = async (symbol) => {
    setLoading(true);
    setError(null);

    const functionType = dataType === 'intraday' ? 'TIME_SERIES_INTRADAY' : 'TIME_SERIES_DAILY';
    const interval = dataType === 'intraday' ? '5min' : null;

    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: functionType,
          symbol: symbol,
          interval: interval,
          apikey: 'A52XPVMKZB0HF398',
        },
      });

      const timeSeriesKey = dataType === 'intraday' ? 'Time Series (5min)' : 'Time Series (Daily)';
      const timeSeries = response.data[timeSeriesKey];

      if (timeSeries) {
        const formattedData = Object.keys(timeSeries).map((key) => ({
          time: key,
          open: parseFloat(timeSeries[key]['1. open']),
          high: parseFloat(timeSeries[key]['2. high']),
          low: parseFloat(timeSeries[key]['3. low']),
          close: parseFloat(timeSeries[key]['4. close']),
          volume: parseInt(timeSeries[key]['5. volume']),
        }));

        setStockData((prevData) => ({
          ...prevData,
          [symbol]: formattedData.reverse(),
        }));
      } else {
        setError('Failed to fetch stock data. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while fetching stock data.');
    }

    setLoading(false);
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    if (currentSymbol && !stockSymbols.includes(currentSymbol)) {
      setStockSymbols([...stockSymbols, currentSymbol]);
      fetchStockData(currentSymbol);
      setCurrentSymbol('');
    }
  };

  const handleDataTypeChange = (value) => {
    setDataType(value);
  };

  useEffect(() => {
    stockSymbols.forEach((symbol) => fetchStockData(symbol));
  }, [dataType]);

  return (
    <Container className="stock-dashboard-container">
      <Row>
        <Col>
          <div className="custom-heading">Real-Time Stock Dashboard</div>
          <div className="custom-subheading">Track stocks in real-time</div>
          <Form onSubmit={handleAddStock}>
            <Form.Group controlId="stockSymbol">
              <Form.Label>Enter Stock Symbol</Form.Label>
              <Form.Control
                type="text"
                value={currentSymbol}
                onChange={(e) => setCurrentSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., AAPL)"
              />
            </Form.Group>
            <Button variant="custom" type="submit" className="mt-3 btn-custom">
              Add Stock
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <ToggleButtonGroup type="radio" name="dataType" value={dataType} onChange={handleDataTypeChange}>
            <ToggleButton variant="outline-light" value="intraday">
              Intraday
            </ToggleButton>
            <ToggleButton variant="outline-light" value="historical">
              Historical
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      {loading ? (
        <Row className="mt-4">
          <Col>
            <p>Loading stock data...</p>
          </Col>
        </Row>
      ) : error ? (
        <Row className="mt-4">
          <Col>
            <p className="text-danger">{error}</p>
          </Col>
        </Row>
      ) : (
        stockSymbols.map((symbol) => (
          stockData[symbol] && (
            <Row key={symbol} className="mt-4 stock-chart-container">
              <Col>
                <Card className="stock-card">
                  <Card.Body>
                    <Card.Title>{symbol} Stock Details</Card.Title>
                    <Card.Text>
                      <strong>Current Price:</strong> ${stockData[symbol][0].close} <br />
                      <strong>High:</strong> ${stockData[symbol][0].high} <br />
                      <strong>Low:</strong> ${stockData[symbol][0].low} <br />
                      <strong>Volume:</strong> {stockData[symbol][0].volume}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <StockChart data={stockData[symbol]} />
              </Col>
            </Row>
          )
        ))
      )}
    </Container>
  );
};

export default App;
