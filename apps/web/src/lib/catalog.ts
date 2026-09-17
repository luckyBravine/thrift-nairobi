import denim from '@/assets/product-denim.jpg';
import dress from '@/assets/product-dress.jpg';
import bag from '@/assets/product-bag.jpg';
import tee from '@/assets/product-tee.jpg';
import sunglasses from '@/assets/product-sunglasses.jpg';
import boots from '@/assets/product-boots.jpg';

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  condition: string;
  sizes: string[];
  image: string;
  year: string;
  description: string;
  sold?: boolean;
};

export const products: Product[] = [
  {
    slug: 'heritage-denim-jacket',
    name: 'The Heritage Denim Jacket',
    category: 'Jackets',
    price: 2950,
    condition: 'Good',
    sizes: ['S', 'M'],
    image: denim,
    year: '1990s',
    description:
      'A softly worn, mid-wash denim jacket with a relaxed shape and beautifully aged seams.',
  },
  {
    slug: 'soft-romance-floral-dress',
    name: 'Soft Romance Floral Dress',
    category: 'Dresses',
    price: 2950,
    condition: 'Very Good',
    sizes: ['S', 'M'],
    image: dress,
    year: '2000s',
    description:
      'A light floral midi with an easy drape, gathered waist and sun-ready movement.',
  },
  {
    slug: 'everyday-leather-bag',
    name: 'The Everyday Leather Bag',
    category: 'Accessories',
    price: 1950,
    condition: 'Good',
    sizes: ['One Size'],
    image: bag,
    year: 'Vintage',
    description:
      'A structured cognac crossbody with honest patina and enough room for daily essentials.',
  },
  {
    slug: 'vintage-band-tee',
    name: 'The Vintage Band Tee',
    category: 'Tops',
    price: 1450,
    condition: 'Good',
    sizes: ['M', 'L'],
    image: tee,
    year: '1990s',
    description:
      'Soft ivory cotton, a relaxed unisex fit and a beautifully faded scenic print.',
  },
  {
    slug: 'retro-sunglasses',
    name: 'The Retro Sunglasses',
    category: 'Accessories',
    price: 950,
    condition: 'Very Good',
    sizes: ['One Size'],
    image: sunglasses,
    year: '2000s',
    description:
      'Tortoiseshell frames with a flattering rounded silhouette and subtle vintage character.',
  },
  {
    slug: 'chelsea-leather-boots',
    name: 'The Chelsea Leather Boots',
    category: 'Shoes',
    price: 3200,
    condition: 'Good',
    sizes: ['38', '39'],
    image: boots,
    year: '2010s',
    description:
      'Polished black leather ankle boots with a walkable block heel and clean everyday profile.',
  },
];

export const formatPrice = (price: number) =>
  `KSh ${price.toLocaleString('en-KE')}`;
export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);
