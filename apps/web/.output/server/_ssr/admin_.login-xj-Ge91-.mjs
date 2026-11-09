import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { n as authClient, t as API_BASE_URL } from "./auth-D-PPADcw.mjs";
import { n as booleanType, o as objectType } from "../_libs/zod.mjs";
import { n as HangerMark } from "./admin-shell-C8bby1mf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin_.login-xj-Ge91-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffLogin() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("credentials");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [totpUri, setTotpUri] = (0, import_react.useState)("");
	const [backupCodes, setBackupCodes] = (0, import_react.useState)([]);
	const [backupCodesSaved, setBackupCodesSaved] = (0, import_react.useState)(false);
	const [useBackupCode, setUseBackupCode] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [checkingSession, setCheckingSession] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		authClient.getSession().then(async (result) => {
			if (!active) return;
			const role = result.data?.user && "role" in result.data.user && typeof result.data.user.role === "string" ? result.data.user.role : void 0;
			if ((typeof role === "string" ? role.split(",").map((entry) => entry.trim()) : []).some((entry) => [
				"superadmin",
				"admin",
				"support"
			].includes(entry))) await navigate({
				to: "/admin",
				replace: true
			});
			else if (role) await navigate({
				to: "/account",
				replace: true
			});
		}).catch(() => {
			if (active) setError("We could not verify an existing session. You can still try signing in.");
		}).finally(() => {
			if (active) setCheckingSession(false);
		});
		return () => {
			active = false;
		};
	}, [navigate]);
	async function completeSignIn() {
		const response = await fetch(`${API_BASE_URL}/api/staff-auth/state`, { credentials: "include" });
		if (response.status === 401 || response.status === 403) {
			await authClient.signOut();
			throw new Error("Staff access could not be verified.");
		}
		if (!response.ok) throw new Error("The server could not verify staff access.");
		const result = objectType({ twoFactorEnabled: booleanType() }).safeParse(await response.json());
		if (!result.success) throw new Error("The server returned an invalid staff authentication state.");
		if (!result.data.twoFactorEnabled) {
			const setup = await authClient.twoFactor.enable({
				password,
				method: "totp",
				issuer: "Thrift Nairobi"
			});
			if (setup.error || setup.data?.method !== "totp") throw new Error(setup.error?.message ?? "We could not start authenticator setup.");
			setTotpUri(setup.data.totpURI);
			setBackupCodes(setup.data.backupCodes);
			setStep("setup");
			setCode("");
			return;
		}
		await navigate({
			to: "/admin",
			replace: true
		});
	}
	async function submitCredentials(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			const result = await authClient.signIn.email({
				email,
				password
			});
			if (result.error) throw new Error("Invalid sign-in details, or this account is not staff.");
			if (result.data && "twoFactorRedirect" in result.data && result.data.twoFactorRedirect === true) {
				setStep("challenge");
				return;
			}
			await completeSignIn();
		} catch (loginError) {
			setError(loginError instanceof Error ? loginError.message : "We could not sign you in. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	async function submitCode(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			if (step === "setup" && !backupCodesSaved) throw new Error("Save your one-time recovery codes before continuing.");
			if ((step === "setup" || !useBackupCode ? await authClient.twoFactor.verifyTotp({ code }) : await authClient.twoFactor.verifyBackupCode({ code })).error) throw new Error("That verification code was not accepted.");
			if (step === "setup") await navigate({
				to: "/admin",
				replace: true
			});
			else await completeSignIn();
		} catch (verificationError) {
			setError(verificationError instanceof Error ? verificationError.message : "We could not verify that code. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	const secret = totpUri ? new URLSearchParams(new URL(totpUri).search).get("secret") : null;
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
					children: "THRIFT NAIROBI Staff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Staff access only. Customer accounts cannot sign in here."
				}),
				checkingSession ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-7 text-sm text-muted-foreground",
					"aria-live": "polite",
					children: "Checking your account…"
				}) : step === "credentials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-7 space-y-4",
					onSubmit: submitCredentials,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Work email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								name: "email",
								autoComplete: "username",
								className: "field mt-2",
								value: email,
								onChange: (event) => setEmail(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								name: "password",
								autoComplete: "current-password",
								className: "field mt-2",
								value: password,
								onChange: (event) => setPassword(event.target.value)
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
							children: busy ? "Checking…" : "Continue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/reset-password",
								className: "text-muted-foreground underline underline-offset-4 hover:text-primary",
								children: "Forgot password?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-muted-foreground underline underline-offset-4 hover:text-primary",
								children: "Back to storefront"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-7 space-y-4",
					onSubmit: submitCode,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: step === "setup" ? "Set up your authenticator" : "Verify it is you"
						}),
						step === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Add this account to an authenticator app using the setup key. This secret is shown only during setup."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Authenticator setup key", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									readOnly: true,
									rows: 3,
									className: "field mt-2 select-all font-mono text-xs",
									value: secret ?? totpUri
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-secondary/40 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "Save these recovery codes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Each code can be used once if you lose access to your authenticator."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 grid grid-cols-2 gap-2 font-mono text-xs",
										children: backupCodes.map((backupCode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: backupCode }, backupCode))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mt-4 flex items-start gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: backupCodesSaved,
											onChange: (event) => setBackupCodesSaved(event.target.checked),
											className: "mt-1 accent-[var(--color-accent)]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I have saved these recovery codes somewhere safe." })]
									})
								]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Enter the code from your authenticator app."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [step === "setup" ? "Authenticator code" : useBackupCode ? "Recovery code" : "Authenticator code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								name: "code",
								autoComplete: "one-time-code",
								inputMode: useBackupCode ? "text" : "numeric",
								className: "field mt-2 font-mono tracking-[0.2em]",
								value: code,
								onChange: (event) => setCode(event.target.value.trim())
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
							children: busy ? "Verifying…" : step === "setup" ? "Verify and finish setup" : "Verify and sign in"
						}),
						step === "challenge" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full text-sm underline underline-offset-4",
							onClick: () => {
								setUseBackupCode((current) => !current);
								setCode("");
								setError("");
							},
							children: useBackupCode ? "Use an authenticator code" : "Use a recovery code"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { StaffLogin as component };
