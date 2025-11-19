import { NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(request: Request) {
  const { start, end } = await request.json();

  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${start.latitude},${start.longitude}&destinations=${end.latitude},${end.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.rows && data.rows.length > 0 && data.rows[0].elements.length > 0) {
      if (data.rows[0].elements[0].status === 'OK') {
        const distanceInMeters = data.rows[0].elements[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;
        return NextResponse.json({ distance: distanceInKm });
      } else {
        return NextResponse.json({ error: 'Could not calculate the distance' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid response from Google Maps API' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch distance data' }, { status: 500 });
  }
}
