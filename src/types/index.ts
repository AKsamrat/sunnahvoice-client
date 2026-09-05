export interface Shoe {
  id: number;
  name: string;
  tagline: string;
  price: string;
  oldPrice: string;
  badge: string;
  color: string;
  sizes: number[];
  specs: string[];
}

export interface Review {
  name: string;
  rating: number;
  text: string;
  tag: string;
}

export interface HeroSlide {
  id: number;
  shoe: Shoe;
  headline: [string, string]; // two lines
  sub: string;
}
