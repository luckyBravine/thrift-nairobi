//#region node_modules/.nitro/vite/services/ssr/assets/catalog-mqyfKZjT.js
var product_denim_default = "/assets/product-denim-BCpByWBz.jpg";
var product_dress_default = "/assets/product-dress-BE5zlPsA.jpg";
var product_bag_default = "/assets/product-bag-BncxQbJ2.jpg";
var product_tee_default = "/assets/product-tee-CfHOYPMU.jpg";
var products = [
	{
		slug: "heritage-denim-jacket",
		name: "The Heritage Denim Jacket",
		category: "Jackets",
		price: 2950,
		condition: "Good",
		sizes: ["S", "M"],
		image: product_denim_default,
		year: "1990s",
		description: "A softly worn, mid-wash denim jacket with a relaxed shape and beautifully aged seams."
	},
	{
		slug: "soft-romance-floral-dress",
		name: "Soft Romance Floral Dress",
		category: "Dresses",
		price: 2950,
		condition: "Very Good",
		sizes: ["S", "M"],
		image: product_dress_default,
		year: "2000s",
		description: "A light floral midi with an easy drape, gathered waist and sun-ready movement."
	},
	{
		slug: "everyday-leather-bag",
		name: "The Everyday Leather Bag",
		category: "Accessories",
		price: 1950,
		condition: "Good",
		sizes: ["One Size"],
		image: product_bag_default,
		year: "Vintage",
		description: "A structured cognac crossbody with honest patina and enough room for daily essentials."
	},
	{
		slug: "vintage-band-tee",
		name: "The Vintage Band Tee",
		category: "Tops",
		price: 1450,
		condition: "Good",
		sizes: ["M", "L"],
		image: product_tee_default,
		year: "1990s",
		description: "Soft ivory cotton, a relaxed unisex fit and a beautifully faded scenic print."
	},
	{
		slug: "retro-sunglasses",
		name: "The Retro Sunglasses",
		category: "Accessories",
		price: 950,
		condition: "Very Good",
		sizes: ["One Size"],
		image: "/assets/product-sunglasses-EBNTCF9S.jpg",
		year: "2000s",
		description: "Tortoiseshell frames with a flattering rounded silhouette and subtle vintage character."
	},
	{
		slug: "chelsea-leather-boots",
		name: "The Chelsea Leather Boots",
		category: "Shoes",
		price: 3200,
		condition: "Good",
		sizes: ["38", "39"],
		image: "/assets/product-boots-Dn4mLpoh.jpg",
		year: "2010s",
		description: "Polished black leather ankle boots with a walkable block heel and clean everyday profile."
	}
];
var formatPrice = (price) => `KSh ${price.toLocaleString("en-KE")}`;
var getProduct = (slug) => products.find((product) => product.slug === slug);
//#endregion
export { product_dress_default as a, product_denim_default as i, getProduct as n, product_tee_default as o, product_bag_default as r, products as s, formatPrice as t };
