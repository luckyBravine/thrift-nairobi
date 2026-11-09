import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { n as authClient, t as API_BASE_URL } from "./auth-D-PPADcw.mjs";
import { a as numberType, c as unknownType, i as enumType, n as booleanType, o as objectType, r as dateType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { i as useStaff } from "./admin-auth-D87Yl1YF.mjs";
import { t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.profile-BI60dTI8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var profileSchema = objectType({
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
var sessionsSchema = arrayType(objectType({
	id: stringType(),
	isCurrent: booleanType(),
	createdAt: stringType().or(dateType()),
	expiresAt: stringType().or(dateType()),
	ipAddress: stringType().nullable(),
	userAgent: stringType().nullable()
}));
async function adminRequest(path, schema, init) {
	const response = await fetch(`${API_BASE_URL}/api/admin${path}`, {
		...init,
		credentials: "include",
		headers: {
			...init?.body ? { "content-type": "application/json" } : {},
			...init?.headers
		}
	});
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		const message = typeof body === "object" && body !== null && "message" in body && typeof body.message === "string" ? body.message : "The request could not be completed.";
		throw new Error(message);
	}
	if (response.status === 204) return void 0;
	const result = schema.safeParse(await response.json());
	if (!result.success) throw new Error("The server returned an invalid response.");
	return result.data;
}
function formatDate(value) {
	return new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(new Date(value));
}
function describeSession(session) {
	const agent = session.userAgent;
	if (!agent) return "Browser or device not reported";
	if (/mobile|android|iphone|ipad/i.test(agent)) return "Mobile device";
	if (/edg\//i.test(agent)) return "Microsoft Edge";
	if (/firefox\//i.test(agent)) return "Firefox";
	if (/chrome\//i.test(agent)) return "Chrome";
	if (/safari\//i.test(agent)) return "Safari";
	return "Browser session";
}
function ProfilePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Profile & security",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileContent, {})
	});
}
function ProfileContent() {
	const { session: signedInStaff } = useStaff();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)(signedInStaff.name);
	const [newEmail, setNewEmail] = (0, import_react.useState)("");
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [nextPassword, setNextPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const loadAccount = (0, import_react.useCallback)(async () => {
		setError("");
		try {
			const [profileResult, sessionResult] = await Promise.all([adminRequest("/profile", objectType({ user: profileSchema })), adminRequest("/sessions", objectType({ sessions: sessionsSchema }))]);
			setProfile(profileResult.user);
			setName(profileResult.user.name);
			setSessions(sessionResult.sessions);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "We could not load your account details.");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadAccount();
	}, [loadAccount]);
	async function saveName(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await adminRequest("/profile", objectType({ user: objectType({
				id: stringType(),
				name: stringType(),
				email: stringType().email(),
				role: stringType()
			}) }), {
				method: "PATCH",
				body: JSON.stringify({ name })
			});
			setNotice("Your profile name has been updated.");
			await loadAccount();
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "We could not update your profile.");
		} finally {
			setBusy(false);
		}
	}
	async function requestEmailChange(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const result = await authClient.changeEmail({
				newEmail,
				callbackURL: `${window.location.origin}/admin/profile`
			});
			if (result.error) throw new Error(result.error.message);
			setNotice("Check both your current and new inboxes to confirm the email change.");
			setNewEmail("");
		} catch (changeError) {
			setError(changeError instanceof Error ? changeError.message : "We could not start the email change.");
		} finally {
			setBusy(false);
		}
	}
	async function resendVerificationEmail() {
		if (!profile) return;
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const result = await authClient.sendVerificationEmail({
				email: profile.email,
				callbackURL: `${window.location.origin}/admin/profile`
			});
			if (result.error) throw new Error(result.error.message);
			setNotice("If the address can receive email, a verification link is on its way.");
		} catch (verificationError) {
			setError(verificationError instanceof Error ? verificationError.message : "We could not send a verification link.");
		} finally {
			setBusy(false);
		}
	}
	async function changePassword(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const result = await authClient.changePassword({
				currentPassword,
				newPassword: nextPassword,
				revokeOtherSessions: true
			});
			if (result.error) throw new Error(result.error.message);
			setCurrentPassword("");
			setNextPassword("");
			setNotice("Password changed. Other active sessions were signed out.");
			await loadAccount();
		} catch (passwordError) {
			setError(passwordError instanceof Error ? passwordError.message : "We could not change your password.");
		} finally {
			setBusy(false);
		}
	}
	async function revokeSession(id) {
		if (!window.confirm("Sign out this device?")) return;
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await adminRequest(`/sessions/${encodeURIComponent(id)}`, unknownType(), { method: "DELETE" });
			setNotice("That device session has been signed out.");
			await loadAccount();
		} catch (revokeError) {
			setError(revokeError instanceof Error ? revokeError.message : "We could not revoke that session.");
		} finally {
			setBusy(false);
		}
	}
	async function revokeOtherSessions() {
		if (!window.confirm("Sign out every other active device?")) return;
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const result = await adminRequest("/sessions/revoke-others", objectType({ revokedCount: numberType().int().nonnegative() }), { method: "POST" });
			setNotice(result.revokedCount === 0 ? "There were no other active sessions." : `${result.revokedCount} other session${result.revokedCount === 1 ? "" : "s"} signed out.`);
			await loadAccount();
		} catch (revokeError) {
			setError(revokeError instanceof Error ? revokeError.message : "We could not revoke other sessions.");
		} finally {
			setBusy(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading profile…"
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "rounded-lg border border-accent/30 p-4 text-sm",
			children: error
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			variant: "outline",
			onClick: () => void loadAccount(),
			children: "Try again"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.18em] text-accent",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl sm:text-5xl",
						children: "Profile & security"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Keep your staff details current and review where your account is signed in."
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mb-4 rounded-lg border border-accent/30 p-4 text-sm text-accent",
				children: error
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mb-4 rounded-lg border border-primary/20 bg-secondary/40 p-4 text-sm",
				children: notice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "admin-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Personal details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Your access role is managed separately by an authorized administrator."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-5 sm:grid-cols-2",
					onSubmit: saveName,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Display name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								minLength: 2,
								maxLength: 100,
								autoComplete: "name",
								className: "field mt-2",
								value: name,
								onChange: (event) => setName(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: ["Staff role", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex min-h-11 items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge badge-role",
									children: profile.role
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: "Managed by an administrator"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || name.trim() === profile.name,
								children: busy ? "Saving…" : "Save name"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "admin-card mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Email address"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"Current email:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-medium text-foreground",
										children: profile.email
									}),
									!profile.emailVerified && " · Not verified"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Changes take effect only after confirmation through your current and new inboxes."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-3 sm:flex-row",
						onSubmit: requestEmailChange,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							autoComplete: "email",
							"aria-label": "New email address",
							placeholder: "New email address",
							className: "field flex-1",
							value: newEmail,
							onChange: (event) => setNewEmail(event.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "outline",
							disabled: busy || !profile.emailVerified,
							children: busy ? "Sending…" : "Verify new email"
						})]
					}),
					!profile.emailVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-accent",
							children: "Verify your current email before requesting a change. If you no longer control it, contact the designated account administrator."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							disabled: busy,
							onClick: () => void resendVerificationEmail(),
							children: "Resend verification"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "admin-card mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Choose a unique password with at least 14 characters. Changing it signs out other devices."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4 sm:grid-cols-2",
					onSubmit: changePassword,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["Current password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								autoComplete: "current-password",
								className: "field mt-2",
								value: currentPassword,
								onChange: (event) => setCurrentPassword(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm",
							children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								minLength: 14,
								maxLength: 128,
								autoComplete: "new-password",
								className: "field mt-2",
								value: nextPassword,
								onChange: (event) => setNextPassword(event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: busy,
								children: busy ? "Updating…" : "Change password"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "admin-card mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Two-factor authentication"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Staff access requires an authenticator app. Lost both your authenticator and recovery codes? Contact the owner for a verified recovery."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "badge badge-paid",
						children: "Enabled"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Never share your authenticator setup key or recovery codes. Recovery resets revoke all active sessions and require fresh enrollment."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "admin-card mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Active sessions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Review signed-in devices. Unknown sessions should be revoked and your password changed."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: busy || sessions.filter((item) => !item.isCurrent).length === 0,
						onClick: () => void revokeOtherSessions(),
						children: "Sign out other devices"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y divide-border",
					children: [sessions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: [describeSession(item), item.isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 badge badge-role",
									children: "This device"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Signed in ",
									formatDate(item.createdAt),
									item.ipAddress ? ` · ${item.ipAddress}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Expires ", formatDate(item.expiresAt)]
							})
						] }), !item.isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							disabled: busy,
							onClick: () => void revokeSession(item.id),
							children: "Sign out"
						})]
					}, item.id)), sessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-4 text-sm text-muted-foreground",
						children: "No active sessions were returned."
					})]
				})]
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
