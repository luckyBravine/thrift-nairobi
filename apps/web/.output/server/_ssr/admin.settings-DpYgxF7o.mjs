import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { r as RoleGate, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { a as defaultSettings, i as SETTINGS_KEY } from "./admin-data-BRPKL9MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DpYgxF7o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Settings",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
			min: "admin",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsForm, {})
		})
	});
}
function SettingsForm() {
	const [settings, setSettings] = useStored(SETTINGS_KEY, defaultSettings);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)("");
	const value = draft ?? settings;
	const set = (key, v) => setDraft({
		...value,
		[key]: v
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl sm:text-5xl",
			children: "Settings"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "Store configuration. No API keys live on this page."
		}),
		toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm",
			children: toast
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid max-w-2xl gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm sm:col-span-2",
					children: ["Store name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: value.storeName,
						onChange: (e) => set("storeName", e.target.value),
						className: "field mt-2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm sm:col-span-2",
					children: ["WhatsApp number", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: value.whatsapp,
						onChange: (e) => set("whatsapp", e.target.value),
						placeholder: "2547XXXXXXXX",
						className: "field mt-2 font-mono text-xs"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Nairobi delivery (KES)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: "0",
						value: value.delivery,
						onChange: (e) => set("delivery", Number(e.target.value)),
						className: "field mt-2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Free shipping over (KES)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: "0",
						value: value.freeOver,
						onChange: (e) => set("freeOver", Number(e.target.value)),
						className: "field mt-2"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							disabled: true,
							checked: false,
							readOnly: true
						}), " M-Pesa enabled"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
						children: "Next sprint"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							setSettings(value);
							setDraft(null);
							setToast("Settings saved.");
						},
						children: "Save settings"
					})
				})
			]
		})
	] });
}
//#endregion
export { SettingsPage as component };
