import type { Media } from '@/payload-types'

export type LaboratoryProductView = {
  key: string
  title: string
  description: string
  tags: string[]
  rating: number
  reviews: number
  price: string
  image?: Media | string | null
  categories: Array<'bestseller' | 'single-origin' | 'espresso-blend' | 'rare-varietal'>
}

/**
 * Fallback when the CMS has no store products yet. Uses static assets under `/public/images/featured-specimens/` (same order as seed).
 */
export const LABORATORY_FALLBACK_PRODUCTS: LaboratoryProductView[] = [
  {
    key: '1',
    title: 'Signature House Blend',
    description: 'Smooth, balanced profile with chocolate and caramel notes for any brew method.',
    tags: ['BALANCED', 'CHOCOLATEY', 'VERSATILE'],
    rating: 4.9,
    reviews: 342,
    price: '$24.00',
    image: '/images/featured-specimens/01-signature-house-blend.png',
    categories: ['bestseller', 'espresso-blend'],
  },
  {
    key: '2',
    title: 'Ethiopian Yirgacheffe',
    description: 'Floral jasmine, bergamot, and bright citrus — classic washed heirloom.',
    tags: ['FLORAL', 'CITRUS', 'BRIGHT'],
    rating: 4.9,
    reviews: 218,
    price: '$28.00',
    image: '/images/featured-specimens/02-ethiopian-yirgacheffe.png',
    categories: ['single-origin', 'bestseller'],
  },
  {
    key: '3',
    title: 'Dark Matter Espresso',
    description: 'Dense crema, cocoa, and molasses — tuned for 9-bar pressure profiles.',
    tags: ['BOLD', 'CREMA', 'ESPRESSO'],
    rating: 4.8,
    reviews: 401,
    price: '$24.00',
    image: '/images/featured-specimens/03-dark-matter-espresso.png',
    categories: ['espresso-blend', 'bestseller'],
  },
  {
    key: '4',
    title: 'Colombia Pink Bourbon',
    description: 'Limited micro-lot. Unique pink cherry varietal with complex fruit notes.',
    tags: ['RARE', 'COMPLEX', 'FRUITY'],
    rating: 4.9,
    reviews: 189,
    price: '$32.00',
    image: '/images/featured-specimens/04-colombia-pink-bourbon.png',
    categories: ['rare-varietal', 'single-origin'],
  },
  {
    key: '5',
    title: 'Kenya AA Nyeri',
    description: 'Vibrant acidity with blackcurrant and citrus. Ideal for pour-over brewing.',
    tags: ['BRIGHT', 'CITRUS', 'FILTER'],
    rating: 4.7,
    reviews: 298,
    price: '$30.00',
    image: '/images/featured-specimens/05-kenya-aa-nyeri.png',
    categories: ['single-origin', 'rare-varietal'],
  },
  {
    key: '6',
    title: 'Sumatra Mandheling',
    description: 'Earthy and full-bodied. Wet-hulled processing creates distinctive herbal notes.',
    tags: ['EARTHY', 'FULL BODY', 'ESPRESSO'],
    rating: 4.6,
    reviews: 412,
    price: '$22.00',
    image: '/images/featured-specimens/06-sumatra-mandheling.png',
    categories: ['single-origin', 'bestseller'],
  },
]
