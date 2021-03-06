import Axios from 'axios'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Res = {
  time_period_start: string
  time_period_end: string
  time_open: string
  time_close: string
  price_open: number
  price_high: number
  price_low: number
  price_close: number
  volume_traded: number
  trades_count: number
}[]

type DayPrices = {
  date: string
  priceHigh: number
  priceLow: number
}[]

// queries for all LOOKS price data since inception
const url =
  'https://rest.coinapi.io/v1/ohlcv/FTX_SPOT_LOOKS_USD/history?time_start=2021-12-29T00:00:00&period_id=1DAY&limit=100000'
const config = {
  headers: { 'X-CoinAPI-Key': process.env.X_COIN_API_KEY as string },
}

async function getAllLooksPrices(): Promise<DayPrices> {
  const { data } = await Axios.get<Res>(url, config)
  return data.map((day) => {
    return {
      date: new Date(day.time_period_start).toISOString(),
      priceHigh: day.price_high,
      priceLow: day.price_low,
    }
  })
}

async function updateDbPrices() {
  const looksPriceRecords = await getAllLooksPrices()
  looksPriceRecords.forEach(async (day) => {
    return await prisma.exchangeLog
      .update({
        where: { date: day.date },
        data: { priceHigh: day.priceHigh, priceLow: day.priceLow },
      })
      .catch((err) => console.log(err))
  })
}

export { getAllLooksPrices, updateDbPrices }
