import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { t as API_BASE_URL } from "./auth-D-PPADcw.mjs";
import { i as useStaff } from "./admin-auth-D87Yl1YF.mjs";
import { t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.staff-euQrymrH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function adminRequest(path, init) {
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
		const message = typeof body === "object" && body !== null && "message" in body && typeof body.message === "string" ? body.message : "The staff request could not be completed.";
		throw new Error(message);
	}
	if (response.status === 204) return void 0;
	return await response.json();
}
function StaffPage() {
	const { session } = useStaff();
	const [staff, setStaff] = (0, import_react.useState)([]);
	const [invites, setInvites] = (0, import_react.useState)([]);
	const [securityEvents, setSecurityEvents] = (0, import_react.useState)([]);
	const [inviteOpen, setInviteOpen] = (0, import_react.useState)(false);
	const [mfaRecoveryTarget, setMfaRecoveryTarget] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const loadStaff = (0, import_react.useCallback)(async () => {
		setError("");
		try {
			const [staffResult, inviteResult, eventResult] = await Promise.all([
				adminRequest("/staff"),
				adminRequest("/invites"),
				session.role === "superadmin" ? adminRequest("/security-events") : Promise.resolve({ events: [] })
			]);
			setStaff(staffResult.staff);
			setInvites(inviteResult.invites);
			setSecurityEvents(eventResult.events);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "We could not load staff accounts.");
		} finally {
			setLoading(false);
		}
	}, [session.role]);
	(0, import_react.useEffect)(() => {
		loadStaff();
	}, [loadStaff]);
	async function submitInvite(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		setNotice("");
		const form = new FormData(event.currentTarget);
		const formElement = event.currentTarget;
		try {
			await adminRequest("/invites", {
				method: "POST",
				body: JSON.stringify({
					email: String(form.get("email") ?? ""),
					role: String(form.get("role") ?? "")
				})
			});
			setNotice("Invitation sent. It expires after 24 hours and can be used once.");
			setInviteOpen(false);
			formElement.reset();
			await loadStaff();
		} catch (inviteError) {
			setError(inviteError instanceof Error ? inviteError.message : "We could not send the invitation.");
		} finally {
			setBusy(false);
		}
	}
	async function updateRole(member) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			const role = member.role === "admin" ? "support" : "admin";
			await adminRequest(`/staff/${encodeURIComponent(member.id)}/role`, {
				method: "PATCH",
				body: JSON.stringify({ role })
			});
			setNotice(`${member.name}'s role was updated. Their active sessions were revoked.`);
			await loadStaff();
		} catch (roleError) {
			setError(roleError instanceof Error ? roleError.message : "We could not update that staff role.");
		} finally {
			setBusy(false);
		}
	}
	async function updateStatus(member) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await adminRequest(`/staff/${encodeURIComponent(member.id)}/status`, {
				method: "PATCH",
				body: JSON.stringify({ banned: !member.banned })
			});
			setNotice(member.banned ? `${member.name}'s account was re-enabled.` : `${member.name}'s account was disabled and their sessions were revoked.`);
			await loadStaff();
		} catch (statusError) {
			setError(statusError instanceof Error ? statusError.message : "We could not update that staff account.");
		} finally {
			setBusy(false);
		}
	}
	async function recoverMfa(event) {
		event.preventDefault();
		if (!mfaRecoveryTarget) return;
		setBusy(true);
		setError("");
		setNotice("");
		const form = new FormData(event.currentTarget);
		try {
			await adminRequest(`/staff/${encodeURIComponent(mfaRecoveryTarget.id)}/recover-mfa`, {
				method: "POST",
				body: JSON.stringify({ confirmationEmail: String(form.get("confirmationEmail") ?? "") })
			});
			setNotice(`${mfaRecoveryTarget.name}'s MFA was reset, all sessions were revoked, and recovery was recorded. They must enroll MFA again at next sign-in.`);
			setMfaRecoveryTarget(null);
			await loadStaff();
		} catch (recoveryError) {
			setError(recoveryError instanceof Error ? recoveryError.message : "We could not reset this staff member’s MFA.");
		} finally {
			setBusy(false);
		}
	}
	async function revokeInvite(invite) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await adminRequest(`/invites/${encodeURIComponent(invite.email)}`, { method: "DELETE" });
			setNotice(`The invitation for ${invite.email} was revoked.`);
			await loadStaff();
		} catch (revokeError) {
			setError(revokeError instanceof Error ? revokeError.message : "We could not revoke that invitation.");
		} finally {
			setBusy(false);
		}
	}
	const mayInvite = session.role === "admin" || session.role === "superadmin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Staff",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl sm:text-5xl",
					children: "Staff"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Staff accounts require a unique password and authenticator MFA."
				})] }), mayInvite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => setInviteOpen(true),
					children: "Invite worker"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 rounded-md border border-accent/40 px-3 py-2 text-sm text-accent",
				children: error
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm",
				children: notice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Staff accounts"
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Loading staff…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[860px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "MFA"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "State"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Joined"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: staff.map((member) => {
							const canManage = session.role === "superadmin" || session.role === "admin" && member.role === "support";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: member.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-muted-foreground",
										children: member.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge badge-role",
											children: member.role
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: member.twoFactorEnabled ? "Enabled" : "Setup required"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge ${member.banned ? "badge-pending" : "badge-paid"}`,
											children: member.banned ? "Disabled" : "Active"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-mono text-xs text-muted-foreground",
										children: new Date(member.createdAt).toLocaleDateString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "space-x-3 p-3",
										children: [
											session.role === "superadmin" && member.id !== session.id && member.role !== "superadmin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: busy,
												onClick: () => void updateRole(member),
												className: "underline underline-offset-4 disabled:opacity-50",
												children: [
													"Make",
													" ",
													member.role === "admin" ? "support" : "admin"
												]
											}),
											canManage && member.id !== session.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: busy,
												onClick: () => void updateStatus(member),
												className: "underline underline-offset-4 disabled:opacity-50",
												children: member.banned ? "Re-enable" : "Disable"
											}),
											canManage && member.id !== session.id && member.role !== "superadmin" && member.twoFactorEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: busy,
												onClick: () => setMfaRecoveryTarget(member),
												className: "underline underline-offset-4 text-accent disabled:opacity-50",
												children: "Recover MFA"
											})
										]
									})
								]
							}, member.id);
						}) })]
					})
				})]
			}),
			session.role === "superadmin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Recent security activity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Owner-only audit history for staff access changes and recovery actions."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 divide-y divide-border rounded-xl border border-border",
						children: [securityEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-start justify-between gap-3 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: event.action.replaceAll(".", " ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										event.actorId ? `Actor ${event.actorId}` : "System or offline operation",
										event.subjectUserId ? ` · Account ${event.subjectUserId}` : "",
										event.metadata?.["role"] ? ` · Role ${event.metadata["role"]}` : "",
										typeof event.metadata?.["count"] === "number" ? ` · ${event.metadata["count"]} session(s)` : ""
									]
								}),
								event.ipAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-[10px] text-muted-foreground",
									children: ["IP ", event.ipAddress]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								className: "text-xs text-muted-foreground",
								dateTime: event.createdAt,
								children: new Date(event.createdAt).toLocaleString()
							})]
						}, event.id)), !securityEvents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "p-4 text-sm text-muted-foreground",
							children: "No security events have been recorded yet."
						})]
					})
				]
			}),
			mayInvite && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Pending invitations"
				}), invites.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-border rounded-xl border border-border",
					children: invites.map((invite) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-3 p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: invite.email }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									invite.role,
									" · expires",
									" ",
									new Date(invite.expiresAt).toLocaleString()
								]
							}), (session.role === "superadmin" || invite.role === "support") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => void revokeInvite(invite),
								className: "underline underline-offset-4 disabled:opacity-50",
								children: "Revoke"
							})]
						})]
					}, invite.email))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "There are no pending invitations."
				})]
			}),
			inviteOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[80] grid place-items-center bg-foreground/30 p-5",
				onClick: () => setInviteOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitInvite,
					onClick: (event) => event.stopPropagation(),
					className: "w-full max-w-sm rounded-xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Invite worker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm",
							children: ["Work email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								name: "email",
								autoComplete: "email",
								className: "field mt-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm",
							children: ["Role", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name: "role",
								className: "field mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "support",
									children: "support"
								}), session.role === "superadmin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "admin"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy,
								children: busy ? "Sending…" : "Send invitation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setInviteOpen(false),
								children: "Cancel"
							})]
						})
					]
				})
			}),
			mfaRecoveryTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[80] grid place-items-center bg-foreground/30 p-5",
				onClick: () => setMfaRecoveryTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: recoverMfa,
					onClick: (event) => event.stopPropagation(),
					className: "w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
							children: "Security recovery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl",
							children: "Reset authenticator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Use only after verifying the staff member’s identity out of band. This signs them out everywhere and requires fresh MFA enrollment. The action is recorded in the security audit log."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm",
							children: ["Confirm their work email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								name: "confirmationEmail",
								autoComplete: "off",
								className: "field mt-2",
								placeholder: mfaRecoveryTarget.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "destructive",
								disabled: busy,
								children: busy ? "Resetting…" : "Reset MFA and revoke sessions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								disabled: busy,
								onClick: () => setMfaRecoveryTarget(null),
								children: "Cancel"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { StaffPage as component };
