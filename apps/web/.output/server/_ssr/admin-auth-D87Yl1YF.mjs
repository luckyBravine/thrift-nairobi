import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-auth-D87Yl1YF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAFF_ROLES = [
	"superadmin",
	"admin",
	"support"
];
var atLeast = (role, min) => {
	const rank = {
		support: 1,
		admin: 2,
		superadmin: 3
	};
	return rank[role] >= rank[min];
};
var StaffContext = (0, import_react.createContext)(void 0);
function StaffProvider({ session, children, onSignOut }) {
	const value = (0, import_react.useMemo)(() => ({
		session,
		signOut: onSignOut
	}), [session, onSignOut]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffContext.Provider, {
		value,
		children
	});
}
function useStaff() {
	const value = (0, import_react.useContext)(StaffContext);
	if (!value) throw new Error("useStaff must be used inside the staff app");
	return value;
}
/** Client-only persisted state helper for the mock staff data layer. */
function useStored(key, initial) {
	const [value, setValue] = (0, import_react.useState)(initial);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = window.localStorage.getItem(key);
			if (raw) setValue(JSON.parse(raw));
		} catch {
			window.localStorage.removeItem(key);
		}
		setReady(true);
	}, [key]);
	(0, import_react.useEffect)(() => {
		if (ready) window.localStorage.setItem(key, JSON.stringify(value));
	}, [
		key,
		ready,
		value
	]);
	return [
		value,
		setValue,
		ready
	];
}
//#endregion
export { useStored as a, useStaff as i, StaffProvider as n, atLeast as r, STAFF_ROLES as t };
