import { getDistance } from 'geolib'

type FareInput = {
  pickup: { coordinates: [number, number] }
  dropoff: { coordinates: [number, number] }
  type: 'ride' | 'delivery'
  category: string
}

export const estimateFare = ({ pickup, dropoff, type, category }: FareInput) => {
  const meters = getDistance(
    { latitude: pickup.coordinates[1], longitude: pickup.coordinates[0] },
    { latitude: dropoff.coordinates[1], longitude: dropoff.coordinates[0] }
  )

  const distanceKm = Math.max(meters / 1000, 1) // min 1km
  const durationMin = Math.ceil(distanceKm * 2) // stubbed: assume 2min/km

  let baseFare = 0
  let perKm = 0
  let minFare = 0

  if (type === 'ride') {
    if (category === 'economy') {
      baseFare = 500
      perKm = 150
      minFare = 700
    } else if (category === 'suv') {
      baseFare = 1000
      perKm = 250
      minFare = 1500
    }
  } else if (type === 'delivery') {
    if (category === 'standard') {
      baseFare = 400
      perKm = 100
      minFare = 600
    } else if (category === 'fragile') {
      baseFare = 600
      perKm = 150
      minFare = 900
    }
  }

  const totalFare = Math.max(baseFare + distanceKm * perKm, minFare)

  return {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    estimatedDurationMin: durationMin,
    estimatedFare: Math.round(totalFare),
  }
}