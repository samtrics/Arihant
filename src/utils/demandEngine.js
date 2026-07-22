/**
 * Advanced Demand Intelligence Mathematical Engine
 * Implements Component-Based Forecast: D = (B + T) * S + C + E + R
 */

// ─── Core Statistics ─────────────────────────────────────────────────────────

export const calculateMean = (arr) => {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const calculateStdDev = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const mean = calculateMean(arr);
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

// ─── Component 1: Base Demand (EWMA) ────────────────────────────────────────

export const calculateEWMA = (series, alpha = 0.4) => {
  if (!series || series.length === 0) return 0;
  let b = series[0];
  for (let i = 1; i < series.length; i++) {
    b = (alpha * series[i]) + ((1 - alpha) * b);
  }
  return b;
};

// ─── Component 2: Trend (Linear Regression) ─────────────────────────────────

export const calculateTrend = (series, window = 14) => {
  if (!series || series.length < 2) return 0;
  const recent = series.slice(-window);
  const n = recent.length;
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1; // t
    const y = recent[i]; // S_t
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  // Slope b = sum((x - meanX) * (y - meanY)) / sum((x - meanX)^2)
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1;
    num += (x - meanX) * (recent[i] - meanY);
    den += Math.pow((x - meanX), 2);
  }
  
  const slope = den === 0 ? 0 : num / den;
  return slope;
};

// ─── Component 3: Seasonality (Weekday Factor) ──────────────────────────────

export const getWeekdayFactor = (salesHistoryWithDates, targetDayOfWeek) => {
  const allSales = salesHistoryWithDates.map(s => s.amount);
  const overallAvg = calculateMean(allSales);
  if (overallAvg === 0) return 1;
  
  const targetDaySales = salesHistoryWithDates
    .filter(s => new Date(s.date).getDay() === targetDayOfWeek)
    .map(s => s.amount);
    
  if (targetDaySales.length === 0) return 1;
  const targetAvg = calculateMean(targetDaySales);
  
  return targetAvg / overallAvg;
};

// ─── Component 4: Probabilistic Customer Demand ─────────────────────────────

export const analyzeCustomer = (dates, qtys) => {
  if (!dates || dates.length < 2) return null;
  
  const sortedDates = dates.map(d => new Date(d).getTime()).sort((a,b)=>a-b);
  
  const intervals = [];
  for (let i = 1; i < sortedDates.length; i++) {
    intervals.push((sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24));
  }
  
  const avgInterval = calculateMean(intervals);
  const avgQty = calculateMean(qtys);
  
  const lastPurchase = sortedDates[sortedDates.length - 1];
  const daysSinceLast = (Date.now() - lastPurchase) / (1000 * 60 * 60 * 24);
  
  // Probability Pi = e ^ (- |t - PIi| / PIi)
  let probability = 0;
  if (avgInterval > 0) {
    const exponent = -Math.abs(daysSinceLast - avgInterval) / avgInterval;
    probability = Math.exp(exponent);
  }
  
  const expectedDemand = probability * avgQty;
  
  return {
    avgInterval,
    avgQty,
    daysSinceLast,
    probability,
    expectedDemand,
    nextExpectedDate: new Date(lastPurchase + (avgInterval * 24 * 60 * 60 * 1000))
  };
};

export const computeProductCustomerDemand = (orders, productName) => {
  if (!orders || orders.length === 0) return 0;
  
  const customerMap = {}; // { customer_id: { dates: [], qtys: [] } }
  
  orders.forEach(o => {
    if (o.status === 'cancelled') return;
    const cid = o.customer_id || o.user_id || o.email || 'guest';
    
    let prods = [];
    if (Array.isArray(o.products)) prods = o.products;
    else if (typeof o.products === 'string') { try { prods = JSON.parse(o.products); } catch(e){} }
    
    const targetProd = prods.find(p => (typeof p === 'string' ? p : p.name) === productName);
    if (targetProd) {
      if (!customerMap[cid]) customerMap[cid] = { dates: [], qtys: [] };
      customerMap[cid].dates.push(o.created_at || o.date);
      customerMap[cid].qtys.push(targetProd.qty || 1);
    }
  });
  
  let totalExpectedDemand = 0;
  Object.values(customerMap).forEach(cust => {
    if (cust.dates.length >= 2) {
      const profile = analyzeCustomer(cust.dates, cust.qtys);
      if (profile) totalExpectedDemand += profile.expectedDemand;
    }
  });
  
  return totalExpectedDemand;
};


// ─── Inventory Mathematics ──────────────────────────────────────────────────

// Safety Stock = Z * StandardDeviation * sqrt(LeadTime)
export const calculateSafetyStock = (salesSeries, leadTimeDays = 2, zScore = 1.65) => {
  const stdDev = calculateStdDev(salesSeries);
  return zScore * stdDev * Math.sqrt(leadTimeDays);
};

// Production = min(Demand, Stock + Production) conceptually -> req = Forecast + SS - Inv
export const calculateProduction = (forecast, safetyStock, currentInventory) => {
  const req = forecast + safetyStock - currentInventory;
  return Math.max(0, Math.ceil(req));
};

// ─── Confidence & MAPE ──────────────────────────────────────────────────────

export const calculateMAPE = (actuals, predictions) => {
  if (actuals.length === 0 || actuals.length !== predictions.length) return 0;
  let sumErr = 0;
  let count = 0;
  for (let i = 0; i < actuals.length; i++) {
    if (actuals[i] > 0) { // avoid division by zero
      sumErr += Math.abs((actuals[i] - predictions[i]) / actuals[i]);
      count++;
    }
  }
  return count > 0 ? (sumErr / count) * 100 : 0;
};

// ─── Master Forecasting Engine ──────────────────────────────────────────────

/**
 * Generates an Explainable Forecast using the new component formula
 */
export const generateExplainableForecast = (salesHistory, currentInventory, targetDayOfWeek, customerDemand = 0) => {
  const values = salesHistory.map(s => s.amount);
  
  // 1. Base Demand (EWMA, alpha = 0.4)
  const baseDemand = calculateEWMA(values, 0.4);
  
  // 2. Trend (Linear regression over last 14 days)
  const trendSlope = calculateTrend(values, 14);
  
  // 3. Seasonality (Weekday Factor)
  const WF = typeof targetDayOfWeek === 'number' 
             ? getWeekdayFactor(salesHistory, targetDayOfWeek) 
             : 1;
             
  // 4. External Events (Default to 0 for MVP)
  const festivalEffect = 0;
  
  // ─── Core Forecast Equation ───
  // Forecast = (B + Trend) * SeasonFactor + CustomerDemand + FestivalEffect
  let rawForecast = (baseDemand + trendSlope) * WF + customerDemand + festivalEffect;
  rawForecast = Math.max(0, rawForecast); // Demand cannot be negative
  
  // ─── Safety Stock & Production ───
  const safetyStock = calculateSafetyStock(values, 2, 1.65);
  const recommendedProduction = calculateProduction(rawForecast, safetyStock, currentInventory);
  
  // ─── Real Confidence Score (MAPE Backtesting) ───
  // We backtest the model against the last 7 days of actual sales to see how accurate it *would* have been
  let sumErr = 0;
  let count = 0;
  
  const backtestDays = Math.min(7, values.length - 14); // Need at least 14 days of history to calculate trend properly
  
  if (backtestDays > 0) {
      for (let i = 1; i <= backtestDays; i++) {
          const targetIdx = values.length - i;
          const actualThatDay = values[targetIdx];
          const historicalSeries = values.slice(0, targetIdx);
          
          const histBase = calculateEWMA(historicalSeries, 0.4);
          const histTrend = calculateTrend(historicalSeries, 14);
          
          const d = salesHistory[targetIdx]?.date ? new Date(salesHistory[targetIdx].date) : new Date();
          const histWF = getWeekdayFactor(salesHistory.slice(0, targetIdx), d.getDay());
          
          let histForecast = (histBase + histTrend) * histWF;
          histForecast = Math.max(0, Math.round(histForecast));
          
          if (actualThatDay > 0) {
             sumErr += Math.abs((actualThatDay - histForecast) / actualThatDay);
             count++;
          } else if (histForecast > 0) {
             sumErr += 1; // 100% error if we predicted demand but got 0 sales
             count++;
          }
      }
  }
  
  let calculatedMAPE;
  if (count > 0) {
      calculatedMAPE = Math.min(100, (sumErr / count) * 100);
  } else {
      // Fallback to estimated volatility if not enough history
      const std = calculateStdDev(values);
      const mean = calculateMean(values);
      
      if (mean === 0) {
         // If there is literally zero historical data, the model's error is conceptually 100% (Confidence 0%)
         calculatedMAPE = 100;
      } else {
         const cv = std / mean;
         calculatedMAPE = Math.min(100, cv * 50); 
      }
  }
  
  const confidence = Math.max(0, 100 - calculatedMAPE);
  
  return {
    forecast: Math.round(rawForecast),
    recommendedProduction,
    safetyStock: Math.round(safetyStock),
    confidenceScore: Math.round(confidence * 10) / 10,
    explanation: {
      BaseDemand: Math.round(baseDemand * 10) / 10,
      TrendSlope: Math.round(trendSlope * 1000) / 1000,
      WeekdayFactor: Math.round(WF * 100) / 100,
      CustomerDemand: Math.round(customerDemand * 10) / 10,
      MAPE: Math.round(calculatedMAPE * 10) / 10
    }
  };
};
