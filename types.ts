export interface SlideData {
  id: string;
  day?: string;
  title: string;
  description: string;
  price?: string;
  imageUrl: string; // Using picsum for placeholders if actual images missing
  highlightColor?: string;
  type: 'promo' | 'weather';
}

export interface WeatherForecast {
  day: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'partly-cloudy';
}

export const SLIDE_DURATION_MS = 30000; // 30 seconds
