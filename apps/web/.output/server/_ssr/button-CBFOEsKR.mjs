import { n as __toESM } from "../_runtime.mjs";
import { l as Slot, m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CBFOEsKR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-45", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			primary: "bg-primary text-primary-foreground hover:bg-primary/90",
			clay: "bg-accent text-accent-foreground hover:bg-accent/90",
			outline: "border border-primary/25 bg-transparent text-primary hover:border-primary hover:bg-secondary",
			ghost: "bg-transparent text-foreground hover:bg-secondary",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			destructive: "bg-accent text-accent-foreground hover:bg-accent/90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "min-h-11 px-5",
			sm: "h-9 px-3",
			lg: "h-12 px-7",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { Button as t };
