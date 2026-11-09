import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { c as seedMessages, t as MESSAGES_KEY } from "./admin-data-BRPKL9MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.messages-CyfbPWyw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Messages() {
	const [messages, setMessages] = useStored(MESSAGES_KEY, seedMessages);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const unread = messages.filter((m) => !m.read).length;
	const open = messages.find((m) => m.id === openId);
	const read = (id) => {
		setOpenId(id);
		setMessages(messages.map((m) => m.id === id ? {
			...m,
			read: true
		} : m));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Messages",
		unread,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl sm:text-5xl",
				children: "Messages"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Contact-form enquiries. Reply by email or WhatsApp."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border rounded-xl border border-border",
					children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => read(m.id),
						className: `flex w-full items-start gap-3 p-4 text-left hover:bg-secondary/30 ${openId === m.id ? "bg-secondary/40" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-2 size-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-accent"}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-wrap items-baseline gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm ${m.read ? "" : "font-semibold"}`,
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-xs text-muted-foreground",
										children: m.email
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block truncate text-sm text-muted-foreground",
									children: m.body
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-mono text-[10px] text-muted-foreground",
								children: m.date
							})
						]
					}, m.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "admin-card h-fit",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: open.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								open.email,
								" · ",
								open.date
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed",
							children: open.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${open.email}`,
							className: "wa-link mt-5 inline-block",
							children: "Reply by email"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Select a message to read it."
					})
				})]
			})
		]
	});
}
//#endregion
export { Messages as component };
