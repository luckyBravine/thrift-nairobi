import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { n as authClient } from "./auth-D-PPADcw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-C20wFXPK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerOtpForm() {
	const navigate = useNavigate();
	const [intent, setIntent] = (0, import_react.useState)("sign-in");
	const isRegistration = intent === "create-account";
	const [step, setStep] = (0, import_react.useState)("email");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function sendOtp() {
		setBusy(true);
		setError("");
		setMessage("");
		try {
			const result = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "sign-in",
				fetchOptions: isRegistration ? { headers: { "x-customer-account-consent": "true" } } : void 0
			});
			if (result.error) throw new Error(result.error.message);
			setStep("otp");
			setMessage(isRegistration ? "If the address can receive a code, it should arrive shortly." : "If an account exists for this address, a sign-in code should arrive shortly. New customers can choose “Create an account” first.");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "We couldn't send a sign-in code. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	async function requestOtp(event) {
		event.preventDefault();
		await sendOtp();
	}
	async function verifyOtp(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setMessage("");
		try {
			const result = await authClient.signIn.emailOtp({
				email,
				otp,
				...isRegistration ? { name } : {},
				fetchOptions: isRegistration ? { headers: { "x-customer-account-consent": "true" } } : void 0
			});
			if (result.error) throw new Error(result.error.message);
			await navigate({
				to: "/account",
				replace: true
			});
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "That code could not be verified. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [step === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid grid-cols-2 rounded-full border border-border bg-secondary/40 p-1",
			"aria-label": "Choose account option",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": !isRegistration,
				className: `rounded-full px-3 py-2 text-sm transition-colors ${!isRegistration ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`,
				onClick: () => {
					setIntent("sign-in");
					setConsent(false);
					setError("");
					setMessage("");
				},
				children: "Sign in"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": isRegistration,
				className: `rounded-full px-3 py-2 text-sm transition-colors ${isRegistration ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`,
				onClick: () => {
					setIntent("create-account");
					setError("");
					setMessage("");
				},
				children: "Create account"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-5",
			onSubmit: requestOtp,
			children: [
				isRegistration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["Full name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "name",
						autoComplete: "name",
						className: "field mt-2",
						value: name,
						onChange: (event) => setName(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						name: "email",
						autoComplete: "email",
						className: "field mt-2",
						value: email,
						onChange: (event) => {
							setEmail(event.target.value);
							setConsent(false);
						}
					})]
				}),
				isRegistration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "checkbox",
						checked: consent,
						onChange: (event) => setConsent(event.target.checked),
						className: "mt-1 accent-[var(--color-accent)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I choose to create an optional Thrift Nairobi customer account. I understand I can check out as a guest instead." })]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-accent",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					type: "submit",
					disabled: busy,
					children: busy ? "Sending code…" : isRegistration ? "Continue with email" : "Email me a sign-in code"
				})
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-5",
			onSubmit: verifyOtp,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Enter the six-digit code sent to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: email }),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["One-time code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "otp",
						inputMode: "numeric",
						autoComplete: "one-time-code",
						pattern: "[0-9]{6}",
						maxLength: 6,
						className: "field mt-2 font-mono text-lg tracking-[0.3em]",
						value: otp,
						onChange: (event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-accent",
					children: error
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-sm text-muted-foreground",
					children: message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					type: "submit",
					disabled: busy,
					children: busy ? "Verifying…" : isRegistration ? "Verify and create account" : "Verify and sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "underline underline-offset-4",
						onClick: () => {
							setStep("email");
							setOtp("");
							setError("");
							setMessage("");
						},
						children: "Change email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						className: "underline underline-offset-4 disabled:opacity-50",
						onClick: () => void sendOtp(),
						children: "Send a new code"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-center text-sm text-muted-foreground",
			children: [
				"You can checkout as a guest.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/checkout",
					className: "text-foreground underline underline-offset-4",
					children: "Continue to checkout"
				})
			]
		})]
	});
}
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-6 py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
				children: "Customer account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl",
				children: "Your account, your choice."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Sign in with email, or choose to create an account. Checkout is always available without one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerOtpForm, {})
		]
	});
}
//#endregion
export { Login as component };
