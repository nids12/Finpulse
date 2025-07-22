// seedStocks.js
// Run this script with: node seedStocks.js
// It will add some sample stocks to your MongoDB for testing prefix search.

const mongoose = require("mongoose");
const Stock = require("./models/Stock");

const MONGO_URI = "mongodb://localhost:27017/finpulse"; // Change if needed

const sampleStocks = [
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", current: 3900 },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd.", current: 120 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", current: 950 },
  { symbol: "TCI", name: "Transport Corporation Of India Ltd.", current: 800 },
  { symbol: "TCIEXP", name: "TCI Express Ltd.", current: 1500 },
  { symbol: "TCIFINANCE", name: "TCI Finance Ltd.", current: 120 },
  { symbol: "TCPLPACK", name: "TCPL Packaging Ltd.", current: 900 },
  { symbol: "TCL", name: "Thaai Casting Ltd.", current: 400 },
  { symbol: "TITAN", name: "Titan Company Ltd.", current: 3500 },
  { symbol: "TECHM", name: "Tech Mahindra Ltd.", current: 1200 },
  { symbol: "TRENT", name: "Trent Ltd.", current: 4200 },
  { symbol: "TORNTPHARM", name: "Torrent Pharmaceuticals Ltd.", current: 2100 },
  { symbol: "TORNTPOWER", name: "Torrent Power Ltd.", current: 900 },
  { symbol: "TTKPRESTIG", name: "TTK Prestige Ltd.", current: 800 },
  { symbol: "TVSMOTOR", name: "TVS Motor Company Ltd.", current: 1800 },
  { symbol: "TVTODAY", name: "TV Today Network Ltd.", current: 300 },
  { symbol: "GOOG", name: "Alphabet Inc. (Google) - Class C", current: 2800 },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google) - Class A", current: 2820 },
  { symbol: "GOODYEAR", name: "Goodyear India Ltd.", current: 1200 },
  { symbol: "INFY", name: "Infosys Ltd.", current: 1500 },
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", current: 2800 },
  { symbol: "SBIN", name: "State Bank of India", current: 600 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", current: 1700 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", current: 1200 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd.", current: 1100 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd.", current: 1700 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", current: 7000 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd.", current: 1600 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", current: 11000 },
  { symbol: "M&M", name: "Mahindra & Mahindra Ltd.", current: 2500 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd.", current: 11000 },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries Ltd.",
    current: 1200,
  },
  { symbol: "ITC", name: "ITC Ltd.", current: 450 },
  { symbol: "LT", name: "Larsen & Toubro Ltd.", current: 3500 },
  { symbol: "ADANIGREEN", name: "Adani Green Energy Ltd.", current: 1800 },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports and Special Economic Zone Ltd.",
    current: 1200,
  },
  { symbol: "ADANIPOWER", name: "Adani Power Ltd.", current: 700 },
  { symbol: "ADANITRANS", name: "Adani Transmission Ltd.", current: 900 },
  { symbol: "DMART", name: "Avenue Supermarts Ltd. (DMart)", current: 4200 },
  { symbol: "PIDILITIND", name: "Pidilite Industries Ltd.", current: 3000 },
  { symbol: "PAGEIND", name: "Page Industries Ltd.", current: 40000 },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd.", current: 4000 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd.", current: 6000 },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd.", current: 4000 },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd.", current: 1600 },
  { symbol: "WIPRO", name: "Wipro Ltd.", current: 500 },
  {
    symbol: "POWERGRID",
    name: "Power Grid Corporation of India Ltd.",
    current: 300,
  },
  { symbol: "NTPC", name: "NTPC Ltd.", current: 350 },
  {
    symbol: "ONGC",
    name: "Oil and Natural Gas Corporation Ltd.",
    current: 200,
  },
  { symbol: "COALINDIA", name: "Coal India Ltd.", current: 400 },
  { symbol: "BPCL", name: "Bharat Petroleum Corporation Ltd.", current: 500 },
  { symbol: "IOC", name: "Indian Oil Corporation Ltd.", current: 150 },
  { symbol: "GAIL", name: "GAIL (India) Ltd.", current: 180 },
  { symbol: "TATAPOWER", name: "Tata Power Company Ltd.", current: 350 },
  { symbol: "TATACHEM", name: "Tata Chemicals Ltd.", current: 1000 },
  { symbol: "TATACOMM", name: "Tata Communications Ltd.", current: 1800 },
  { symbol: "TATAELXSI", name: "Tata Elxsi Ltd.", current: 9000 },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd.", current: 1100 },
  { symbol: "TATAMTRDVR", name: "Tata Motors DVR", current: 400 },
  { symbol: "TATAMETALI", name: "Tata Metaliks Ltd.", current: 900 },
  { symbol: "TATASPONGE", name: "Tata Sponge Iron Ltd.", current: 800 },
  { symbol: "TATACOFFEE", name: "Tata Coffee Ltd.", current: 250 },
  { symbol: "TATAVOLT", name: "Tata Voltas Ltd.", current: 1200 },
  { symbol: "TATAPLAY", name: "Tata Play Ltd.", current: 300 },
  { symbol: "TATAPIG", name: "Tata Pigments Ltd.", current: 200 },
  { symbol: "TATAPREC", name: "Tata Precision Industries Ltd.", current: 500 },
  { symbol: "TATAPROJ", name: "Tata Projects Ltd.", current: 1000 },
  { symbol: "TATATINPLATE", name: "Tata Tinplate Company Ltd.", current: 400 },
  { symbol: "TATATR", name: "Tata Transmission Ltd.", current: 700 },
  { symbol: "TATATUBES", name: "Tata Tubes Ltd.", current: 600 },
  {
    symbol: "TATAINVEST",
    name: "Tata Investment Corporation Ltd.",
    current: 2000,
  },
  { symbol: "TATAMILLS", name: "Tata Mills Ltd.", current: 300 },
  { symbol: "TATAYODOGAWA", name: "Tata Yodogawa Ltd.", current: 400 },
  {
    symbol: "TATACONSULT",
    name: "Tata Consulting Engineers Ltd.",
    current: 800,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Stock.deleteMany({
    symbol: { $in: sampleStocks.map((s) => s.symbol) },
  });
  await Stock.insertMany(sampleStocks);
  console.log("Sample stocks inserted!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
