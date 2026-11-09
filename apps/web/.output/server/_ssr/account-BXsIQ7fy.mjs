import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { n as authClient, t as API_BASE_URL } from "./auth-D-PPADcw.mjs";
import { a as numberType, o as objectType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BXsIQ7fy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var accountResponseSchema = objectType({ user: objectType({
	id: stringType(),
	name: stringType(),
	email: stringType().email()
}) });
var ordersResponseSchema = objectType({ orders: arrayType(objectType({
	id: stringType(),
	publicId: stringType(),
	status: stringType(),
	totalKes: numberType(),
	createdAt: stringType(),
	items: arrayType(objectType({
		title: stringType(),
		size: stringType(),
		quantity: numberType(),
		unitPriceKes: numberType()
	}))
})) });
function Account() {
	const navigate = useNavigate();
	const sessionCheckStarted = (0, import_react.useRef)(false);
	const [user, setUser] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [checkingSession, setCheckingSession] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const checkSession = (0, import_react.useCallback)(async () => {
		sessionCheckStarted.current = true;
		setCheckingSession(true);
		setError("");
		try {
			const accountResponse = await fetch(`${API_BASE_URL}/api/account/me`, { credentials: "include" });
			if (accountResponse.status === 401) {
				await navigate({
					to: "/login",
					replace: true
				});
				return;
			}
			if (!accountResponse.ok) throw new Error(accountResponse.status === 403 ? "This area is for customer accounts. Staff should use staff sign in." : "We could not verify your customer account.");
			const account = accountResponseSchema.safeParse(await accountResponse.json());
			if (!account.success) throw new Error("The server returned an invalid account response.");
			setUser(account.data.user);
			const ordersResponse = await fetch(`${API_BASE_URL}/api/account/orders`, { credentials: "include" });
			if (ordersResponse.status === 401) {
				await navigate({
					to: "/login",
					replace: true
				});
				return;
			}
			if (!ordersResponse.ok) throw new Error("We could not load your order history.");
			const customerOrders = ordersResponseSchema.safeParse(await ordersResponse.json());
			if (!customerOrders.success) throw new Error("The server returned an invalid order history.");
			setOrders(customerOrders.data.orders);
		} catch {
			setError("We couldn't load your account. Check your connection and try again.");
		} finally {
			setCheckingSession(false);
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		if (!sessionCheckStarted.current) checkSession();
	}, [checkSession]);
	async function signOut() {
		setBusy(true);
		setError("");
		try {
			const result = await authClient.signOut();
			if (result.error) throw new Error(result.error.message);
			await navigate({
				to: "/login",
				replace: true
			});
		} catch (signOutError) {
			setError(signOutError instanceof Error ? signOutError.message : "We couldn't sign you out. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	if (checkingSession || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-6 py-20",
		"aria-live": "polite",
		children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-accent",
				children: error
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => {
					sessionCheckStarted.current = false;
					checkSession();
				},
				children: "Try again"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading your account…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
						children: "Your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 font-display text-5xl",
						children: [
							"Hello, ",
							user.name || "there",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: ["Signed in as ", user.email]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					type: "button",
					disabled: busy,
					onClick: () => void signOut(),
					children: busy ? "Signing out…" : "Sign out"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-6 text-sm text-accent",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Your orders"
					}),
					orders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 divide-y divide-border",
						children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-4 first:pt-0 last:pb-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.publicId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm capitalize text-muted-foreground",
										children: order.status.replaceAll("_", " ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(new Date(order.createdAt)),
										" ",
										"· KES ",
										order.totalKes.toLocaleString()
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 text-sm text-muted-foreground",
									children: order.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										item.title,
										" · ",
										item.size,
										" · Qty ",
										item.quantity
									] }, `${order.id}-${index}`))
								})
							]
						}, order.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "No orders are linked to this account yet. Guest orders stay available through their confirmation link until linked to your account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "mt-5 inline-block text-sm underline underline-offset-4",
						children: "Continue shopping"
					})
				]
			})
		]
	});
}
//#endregion
export { Account as component };
