import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-context-DeumWN0k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CartContext = (0, import_react.createContext)(void 0);
var KEY = "thift_cart_v1";
function CartProvider({ children }) {
	const [lines, setLines] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const saved = window.localStorage.getItem(KEY);
			if (saved) setLines(JSON.parse(saved));
		} catch {}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready) window.localStorage.setItem(KEY, JSON.stringify(lines));
	}, [lines, ready]);
	const value = (0, import_react.useMemo)(() => ({
		lines,
		count: lines.reduce((sum, line) => sum + line.qty, 0),
		add: (product, size) => {
			if (lines.some((line) => line.product.slug === product.slug)) return false;
			setLines((current) => [...current, {
				product,
				size,
				qty: 1
			}]);
			return true;
		},
		remove: (slug) => setLines((current) => current.filter((line) => line.product.slug !== slug)),
		clear: () => setLines([])
	}), [lines]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const value = (0, import_react.useContext)(CartContext);
	if (!value) throw new Error("useCart must be used within CartProvider");
	return value;
}
//#endregion
export { useCart as n, CartProvider as t };
