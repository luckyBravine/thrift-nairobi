import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useRouterState, c as Outlet, d as createRootRouteWithContext, f as Link, i as HeadContent, l as lazyRouteComponent, m as useRouter, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as Menu, s as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
import { a as numberType, i as enumType, n as booleanType, o as objectType, r as dateType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as Route$20 } from "./admin.orders._id-BRHKDepB.mjs";
import { t as Route$21 } from "./admin.products._id.index-BQpz23eK.mjs";
import { t as Route$22 } from "./admin.products._id.view-Di_yPgEW.mjs";
import { n as useCart, t as CartProvider } from "./cart-context-DeumWN0k.mjs";
import { t as Route$23 } from "./order._publicId-CuQa1pQ1.mjs";
import { t as Route$24 } from "./product._slug-BiHHcbBP.mjs";
import { t as Route$25 } from "./shop-DMggxbed.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B4BBXfgS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Dc2BJIr2.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function SiteLinks({ onNavigate }) {
	const className = onNavigate ? "block border-b border-border py-3 font-display text-2xl" : "nav-link text-[13px] font-medium";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			onClick: onNavigate,
			className,
			children: "Shop"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			search: { sort: "newest" },
			onClick: onNavigate,
			className,
			children: "New In"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/about",
			onClick: onNavigate,
			className,
			children: "About"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/about",
			hash: "journal",
			onClick: onNavigate,
			className,
			children: "Journal"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/contact",
			onClick: onNavigate,
			className,
			children: "Contact"
		})
	] });
}
function HangerMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 42 30",
		className: "h-7 w-10",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.4",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 7.5a3.5 3.5 0 1 1 4.8 3.2c-1.2.5-1.8 1.3-1.8 2.4v1.3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m21 14.4-16 10c-1.5 1-1 2.6.8 2.6h30.4c1.8 0 2.3-1.7.8-2.6Z" })]
	});
}
function SiteShell({ children }) {
	const { count } = useCart();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid h-16 max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:flex sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HangerMark, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-display text-lg font-semibold tracking-[0.14em] sm:text-xl",
								children: "THIFT NAIROBI"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-auto hidden items-center gap-7 md:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLinks, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-1 sm:ml-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cart",
									"aria-label": `Cart with ${count} items`,
									className: "relative inline-flex h-10 items-center gap-2 rounded-full px-2 hover:bg-secondary sm:px-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "hidden text-sm sm:inline",
											children: [
												"Cart (",
												count,
												")"
											]
										}),
										count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-accent font-mono text-[9px] text-accent-foreground sm:hidden",
											children: count
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/account",
									className: "rounded-full px-2 py-2 text-sm hover:bg-secondary sm:px-3",
									children: "Account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": open ? "Close menu" : "Open menu",
									onClick: () => setOpen(!open),
									className: "grid size-10 place-items-center rounded-full hover:bg-secondary md:hidden",
									children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							]
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-t border-border bg-background px-5 py-5 md:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLinks, { onNavigate: () => setOpen(false) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-20 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-[1320px] flex-col gap-7 px-6 py-10 md:flex-row md:items-center md:justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tracking-[0.12em]",
							children: "THIFT NAIROBI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Curated secondhand style, thoughtfully rehomed."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-wrap gap-x-6 gap-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									children: "Shop"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/about",
									children: "About"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://wa.me/?text=Hello%20Thift%20Nairobi",
									target: "_blank",
									rel: "noreferrer",
									children: "WhatsApp"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
							children: "Nairobi, Kenya"
						})
					]
				})
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Thift Nairobi" },
			{
				name: "description",
				content: "Curated secondhand fashion in Nairobi."
			},
			{
				name: "author",
				content: "Thift Nairobi"
			},
			{
				property: "og:title",
				content: "Thift Nairobi"
			},
			{
				property: "og:description",
				content: "Curated secondhand fashion in Nairobi."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Karla:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") }) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
var $$splitComponentImporter$18 = () => import("./routes-DrkWjCsr.mjs");
var Route$18 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Thift Nairobi — Curated Secondhand Style" },
		{
			name: "description",
			content: "Shop thoughtfully sourced vintage and secondhand fashion, curated in Nairobi."
		},
		{
			property: "og:title",
			content: "Thift Nairobi — Curated Secondhand Style"
		},
		{
			property: "og:description",
			content: "Thoughtfully sourced vintage and secondhand fashion, curated in Nairobi."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./about-Cn20UY57.mjs");
var Route$17 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "Our Story — Thift Nairobi" },
		{
			name: "description",
			content: "How Thift Nairobi sources thoughtful secondhand fashion."
		},
		{
			property: "og:title",
			content: "Our Story — Thift Nairobi"
		},
		{
			property: "og:description",
			content: "A Nairobi sourcing story rooted in care and personal style."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./account-BXsIQ7fy.mjs");
objectType({ orders: arrayType(objectType({
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
var Route$16 = createFileRoute("/account")({
	ssr: false,
	head: () => ({ meta: [{ title: "My Account — Thift Nairobi" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin-Cf6MkuT3.mjs");
var Route$15 = createFileRoute("/admin")({
	ssr: false,
	head: () => ({ meta: [{ title: "Staff App — Thrift Nairobi" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./cart-1a9pMEl5.mjs");
var Route$14 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Your Cart — Thift Nairobi" },
		{
			name: "description",
			content: "Review your selected one-of-one pieces."
		},
		{
			property: "og:title",
			content: "Your Cart — Thift Nairobi"
		},
		{
			property: "og:description",
			content: "Review your selected one-of-one pieces."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./checkout-Dzv0rgMf.mjs");
var Route$13 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Secure Checkout — Thift Nairobi" },
		{
			name: "description",
			content: "Complete your Thift Nairobi order with Pesalink, M-Pesa or WhatsApp."
		},
		{
			property: "og:title",
			content: "Secure Checkout — Thift Nairobi"
		},
		{
			property: "og:description",
			content: "Pay securely and we deliver across Nairobi."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./contact-CA04q2yZ.mjs");
var Route$12 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact — Thift Nairobi" },
		{
			name: "description",
			content: "Contact Thift Nairobi about pieces, sizing or delivery."
		},
		{
			property: "og:title",
			content: "Contact — Thift Nairobi"
		},
		{
			property: "og:description",
			content: "Ask about pieces, sizing or delivery."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./login-C20wFXPK.mjs");
var Route$11 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Customer Account — Thrift Nairobi" },
		{
			name: "description",
			content: "Sign in or optionally create a Thift Nairobi customer account with email OTP."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin.index-BdYZG4ff.mjs");
var Route$10 = createFileRoute("/admin/")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.messages-CyfbPWyw.mjs");
var Route$9 = createFileRoute("/admin/messages")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.profile-BI60dTI8.mjs");
objectType({
	id: stringType(),
	name: stringType(),
	email: stringType().email(),
	role: enumType([
		"superadmin",
		"admin",
		"support"
	]),
	emailVerified: booleanType(),
	createdAt: stringType().or(dateType()),
	twoFactorEnabled: booleanType()
});
arrayType(objectType({
	id: stringType(),
	isCurrent: booleanType(),
	createdAt: stringType().or(dateType()),
	expiresAt: stringType().or(dateType()),
	ipAddress: stringType().nullable(),
	userAgent: stringType().nullable()
}));
var Route$8 = createFileRoute("/admin/profile")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Profile & Security — Thrift Nairobi Staff" },
		{
			name: "robots",
			content: "noindex"
		},
		{
			name: "referrer",
			content: "no-referrer"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.settings-DpYgxF7o.mjs");
var Route$7 = createFileRoute("/admin/settings")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.staff-euQrymrH.mjs");
var Route$6 = createFileRoute("/admin/staff")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin_.invite-C4S6o9HQ.mjs");
enumType([
	"valid",
	"invalid",
	"expired",
	"used",
	"missing"
]);
var Route$5 = createFileRoute("/admin_/invite")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Accept Staff Invitation — Thrift Nairobi" },
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			name: "referrer",
			content: "no-referrer"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin_.login-xj-Ge91-.mjs");
var Route$4 = createFileRoute("/admin_/login")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Staff Sign In — Thrift Nairobi" },
		{
			name: "robots",
			content: "noindex"
		},
		{
			name: "referrer",
			content: "no-referrer"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin_.reset-password-DHQ-ACG6.mjs");
var Route$3 = createFileRoute("/admin_/reset-password")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Reset Staff Password — Thrift Nairobi" },
		{
			name: "robots",
			content: "noindex"
		},
		{
			name: "referrer",
			content: "no-referrer"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.orders.index-Dofw1i0j.mjs");
var Route$2 = createFileRoute("/admin/orders/")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.products.index-CZwbZ0zB.mjs");
var Route$1 = createFileRoute("/admin/products/")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.products.new-ItgnPNym.mjs");
var Route = createFileRoute("/admin/products/new")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$17.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var AccountRoute = Route$16.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$19
});
var AdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$19
});
var CartRoute = Route$14.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$19
});
var CheckoutRoute = Route$13.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$12.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var LoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$19
});
var ShopRoute = Route$25.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$19
});
var AdminIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminMessagesRoute = Route$9.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => AdminRoute
});
var AdminProfileRoute = Route$8.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminStaffRoute = Route$6.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AdminRoute
});
var AdminInviteRoute = Route$5.update({
	id: "/admin_/invite",
	path: "/admin/invite",
	getParentRoute: () => Route$19
});
var AdminLoginRoute = Route$4.update({
	id: "/admin_/login",
	path: "/admin/login",
	getParentRoute: () => Route$19
});
var AdminResetPasswordRoute = Route$3.update({
	id: "/admin_/reset-password",
	path: "/admin/reset-password",
	getParentRoute: () => Route$19
});
var OrderPublicIdRoute = Route$23.update({
	id: "/order/$publicId",
	path: "/order/$publicId",
	getParentRoute: () => Route$19
});
var ProductSlugRoute = Route$24.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$19
});
var AdminOrdersIndexRoute = Route$2.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => AdminRoute
});
var AdminOrdersIdRoute = Route$20.update({
	id: "/orders/$id",
	path: "/orders/$id",
	getParentRoute: () => AdminRoute
});
var AdminProductsIndexRoute = Route$1.update({
	id: "/products/",
	path: "/products/",
	getParentRoute: () => AdminRoute
});
var AdminProductsNewRoute = Route.update({
	id: "/products/new",
	path: "/products/new",
	getParentRoute: () => AdminRoute
});
var AdminProductsIdIndexRoute = Route$21.update({
	id: "/products/$id/",
	path: "/products/$id/",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminMessagesRoute,
	AdminProfileRoute,
	AdminSettingsRoute,
	AdminStaffRoute,
	AdminIndexRoute,
	AdminOrdersIdRoute,
	AdminProductsNewRoute,
	AdminOrdersIndexRoute,
	AdminProductsIndexRoute,
	AdminProductsIdViewRoute: Route$22.update({
		id: "/products/$id/view",
		path: "/products/$id/view",
		getParentRoute: () => AdminRoute
	}),
	AdminProductsIdIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	LoginRoute,
	ShopRoute,
	AdminInviteRoute,
	AdminLoginRoute,
	AdminResetPasswordRoute,
	OrderPublicIdRoute,
	ProductSlugRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
