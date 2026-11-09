import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { t as API_BASE_URL } from "./auth-D-PPADcw.mjs";
import { i as enumType, o as objectType } from "../_libs/zod.mjs";
import { n as HangerMark } from "./admin-shell-C8bby1mf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin_.invite-C4S6o9HQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inviteStatusSchema = enumType([
	"valid",
	"invalid",
	"expired",
	"used",
	"missing"
]);
function AcceptStaffInvite() {
	const initialized = (0, import_react.useRef)(false);
	const [token, setToken] = (0, import_react.useState)("");
	const [inviteStatus, setInviteStatus] = (0, import_react.useState)("checking");
	const [error, setError] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (initialized.current) return;
		initialized.current = true;
		const fragmentToken = new URLSearchParams(window.location.hash.slice(1)).get("token");
		const queryToken = new URLSearchParams(window.location.search).get("token");
		const inviteToken = fragmentToken ?? queryToken ?? "";
		setToken(inviteToken);
		if (fragmentToken || queryToken) window.history.replaceState(window.history.state, "", window.location.pathname);
		fetch(`${API_BASE_URL}/api/staff-invitations/open`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(inviteToken ? { token: inviteToken } : {})
		}).then(async (response) => {
			if (!response.ok) throw new Error("We could not verify this invitation.");
			const result = objectType({ status: inviteStatusSchema }).safeParse(await response.json());
			if (!result.success) throw new Error("The server returned an invalid invitation status.");
			setInviteStatus(result.data.status);
		}).catch(() => setInviteStatus("error"));
	}, []);
	async function accept(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		const form = new FormData(event.currentTarget);
		const name = String(form.get("name") ?? "");
		const password = String(form.get("password") ?? "");
		if (password !== String(form.get("confirmation") ?? "")) {
			setError("The passwords do not match.");
			setBusy(false);
			return;
		}
		try {
			if (!(await fetch(`${API_BASE_URL}/api/staff-invitations/accept`, {
				method: "POST",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					token,
					name,
					password
				})
			})).ok) throw new Error("This invitation is invalid, expired, or could not be accepted.");
			setSuccess(true);
		} catch (acceptError) {
			setError(acceptError instanceof Error ? acceptError.message : "We could not accept this invitation. Ask an administrator to send a new one.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-5 py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[440px] rounded-xl border border-border bg-card p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HangerMark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl",
					children: "Staff invitation"
				}),
				success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-sm text-muted-foreground",
						children: "Your staff account is ready. Sign in with your work email and password, then complete authenticator setup before accessing the admin area."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							children: "Continue to staff sign in"
						})
					})]
				}) : inviteStatus === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "mt-5 text-sm text-muted-foreground",
					children: "Checking your invitation…"
				}) : inviteStatus === "valid" && token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-4",
					onSubmit: accept,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Create your staff account. Your password must be at least 14 characters."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Full name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								name: "name",
								autoComplete: "name",
								minLength: 2,
								maxLength: 100,
								className: "field mt-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								name: "password",
								autoComplete: "new-password",
								minLength: 14,
								maxLength: 128,
								className: "field mt-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Confirm password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								name: "confirmation",
								autoComplete: "new-password",
								minLength: 14,
								maxLength: 128,
								className: "field mt-2"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-sm text-accent",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Creating account…" : "Accept invitation"
						})
					]
				}) : inviteStatus === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-5 text-sm text-accent",
					children: "We could not verify this invitation. Check your connection and refresh the page."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-5 text-sm text-accent",
					children: inviteStatus === "missing" ? "This link did not include an invitation token. Open the full link from the latest invitation email or ask an administrator to resend it." : inviteStatus === "expired" ? "This invitation has expired. Ask an administrator to send a new invitation." : inviteStatus === "used" ? "This invitation has already been accepted. Continue to staff sign in." : "This invitation link is invalid. Ask an administrator to send a new invitation."
				})
			]
		})
	});
}
//#endregion
export { AcceptStaffInvite as component };
