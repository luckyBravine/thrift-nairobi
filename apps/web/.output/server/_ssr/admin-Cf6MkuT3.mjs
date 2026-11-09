import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { c as Outlet, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { n as authClient, t as API_BASE_URL } from "./auth-D-PPADcw.mjs";
import { i as enumType, o as objectType, s as stringType } from "../_libs/zod.mjs";
import { n as StaffProvider, t as STAFF_ROLES } from "./admin-auth-D87Yl1YF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Cf6MkuT3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var staffUserSchema = objectType({
	id: stringType(),
	name: stringType(),
	email: stringType().email(),
	role: enumType(STAFF_ROLES),
	image: stringType().nullable().optional()
});
function AdminLayout() {
	const navigate = useNavigate();
	const [session, setSession] = (0, import_react.useState)(null);
	const [checked, setChecked] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const checkSession = (0, import_react.useCallback)(async () => {
		setError("");
		try {
			const response = await fetch(`${API_BASE_URL}/api/admin/me`, { credentials: "include" });
			if (response.status === 401) {
				setSession(null);
				setChecked(true);
				await navigate({
					to: "/admin/login",
					replace: true
				});
				return;
			}
			if (response.status === 403) {
				const authResult = await authClient.getSession();
				const role = authResult.data?.user && "role" in authResult.data.user && typeof authResult.data.user.role === "string" ? authResult.data.user.role : void 0;
				const roles = typeof role === "string" ? role.split(",").map((entry) => entry.trim()) : [];
				setSession(null);
				setChecked(true);
				if (roles.includes("customer")) await navigate({
					to: "/account",
					replace: true
				});
				else await navigate({
					to: "/admin/login",
					replace: true
				});
				return;
			}
			if (!response.ok) throw new Error("The server could not verify staff access.");
			const body = await response.json();
			const user = typeof body === "object" && body !== null && "user" in body ? staffUserSchema.safeParse(body.user) : null;
			if (!user || !user.success) throw new Error("The server returned an invalid staff session.");
			setSession(user.data);
			setChecked(true);
		} catch (sessionError) {
			setError(sessionError instanceof Error ? sessionError.message : "We could not verify staff access.");
			setChecked(true);
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		checkSession();
	}, [checkSession]);
	const signOut = (0, import_react.useCallback)(async () => {
		const result = await authClient.signOut();
		if (result.error) throw new Error(result.error.message);
		setSession(null);
		await navigate({
			to: "/admin/login",
			replace: true
		});
	}, [navigate]);
	if (!checked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted-foreground",
		children: "Verifying staff access…"
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid min-h-screen max-w-md place-content-center gap-4 px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "text-sm text-accent",
			children: error
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "outline",
			onClick: () => void checkSession(),
			children: "Try again"
		})]
	});
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffProvider, {
		session,
		onSignOut: signOut,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { AdminLayout as component };
