import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { n as authClient } from "./auth-D-PPADcw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin_.reset-password-DHQ-ACG6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetStaffPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmation, setConfirmation] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setToken(new URLSearchParams(window.location.search).get("token") ?? "");
	}, []);
	async function requestReset(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const result = await authClient.requestPasswordReset({
				email,
				redirectTo: `${window.location.origin}/admin/reset-password`
			});
			if (result.error) throw new Error(result.error.message);
			setNotice("If this address belongs to a staff account, a password-reset link will arrive shortly. Your authenticator will still be required.");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "We could not request a reset. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	async function resetPassword(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		try {
			if (!token) throw new Error("This reset link is invalid or expired.");
			if (password !== confirmation) throw new Error("The passwords do not match.");
			const result = await authClient.resetPassword({
				newPassword: password,
				token
			});
			if (result.error) throw new Error(result.error.message);
			setNotice("Password reset. Sign in with your new password and complete authenticator verification.");
			setTimeout(() => void navigate({
				to: "/admin/login",
				replace: true
			}), 1500);
		} catch (resetError) {
			setError(resetError instanceof Error ? resetError.message : "We could not reset the password. Request a new link and try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-background px-5 py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-[440px] rounded-xl border border-border bg-card p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-accent",
					children: "Thrift Nairobi staff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl",
					children: token ? "Choose a new password" : "Reset your password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Password recovery does not reset or bypass your authenticator."
				}),
				token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-7 space-y-4",
					onSubmit: resetPassword,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								minLength: 14,
								maxLength: 128,
								type: "password",
								autoComplete: "new-password",
								className: "field mt-2",
								value: password,
								onChange: (event) => setPassword(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Confirm new password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								minLength: 14,
								maxLength: 128,
								type: "password",
								autoComplete: "new-password",
								className: "field mt-2",
								value: confirmation,
								onChange: (event) => setConfirmation(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: busy,
							children: busy ? "Updating…" : "Reset password"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-7 space-y-4",
					onSubmit: requestReset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Staff email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							autoComplete: "email",
							className: "field mt-2",
							value: email,
							onChange: (event) => setEmail(event.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: busy,
						children: busy ? "Sending…" : "Send password-reset link"
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "mt-4 text-sm text-accent",
					children: error
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "mt-4 text-sm text-muted-foreground",
					children: notice
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/login",
					className: "mt-6 inline-block text-sm underline underline-offset-4",
					children: "Return to staff sign in"
				})
			]
		})
	});
}
//#endregion
export { ResetStaffPassword as component };
