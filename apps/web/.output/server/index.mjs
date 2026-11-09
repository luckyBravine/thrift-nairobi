globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { t as FastResponse } from "./_libs/srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-17T15:56:48.842Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/about-DDvROa53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9b-8BCztIO1cqMaupH/teMubm5TK8g\"",
		"mtime": "2026-11-09T16:35:12.588Z",
		"size": 2715,
		"path": "../public/assets/about-DDvROa53.js"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"22e-CqZoPR2/v1N49OI81fUWOEoT/NM\"",
		"mtime": "2026-09-17T15:56:36.336Z",
		"size": 558,
		"path": "../public/favicon.png"
	},
	"/assets/admin-auth-5RivoE0t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"333-6NRBC/nGel/aCu9ISr6Nd5olQcw\"",
		"mtime": "2026-11-09T16:35:12.590Z",
		"size": 819,
		"path": "../public/assets/admin-auth-5RivoE0t.js"
	},
	"/assets/account-DX_R9cOr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1090-RBM42jAqSx/PYcZpubNc+ygUYzc\"",
		"mtime": "2026-11-09T16:35:12.588Z",
		"size": 4240,
		"path": "../public/assets/account-DX_R9cOr.js"
	},
	"/assets/admin-data-hKfZQkeI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ab1-YxfchcQ+WvlQBJAZa9KXNEqNrT4\"",
		"mtime": "2026-11-09T16:35:12.591Z",
		"size": 2737,
		"path": "../public/assets/admin-data-hKfZQkeI.js"
	},
	"/assets/admin-DSDnV7HA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ca-8930UTxa+iXHKTSX4IJdOO5+mCc\"",
		"mtime": "2026-11-09T16:35:12.589Z",
		"size": 1994,
		"path": "../public/assets/admin-DSDnV7HA.js"
	},
	"/assets/admin-shell-W4B-5mQF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c58e-x2wRLmVyv7sWLe7YTgnVa2GVgf8\"",
		"mtime": "2026-11-09T16:35:12.592Z",
		"size": 50574,
		"path": "../public/assets/admin-shell-W4B-5mQF.js"
	},
	"/assets/admin.index-B-dXeOFe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e34-SqywKbQmnYRDw/7x7ushi8iPgA0\"",
		"mtime": "2026-11-09T16:35:12.605Z",
		"size": 3636,
		"path": "../public/assets/admin.index-B-dXeOFe.js"
	},
	"/assets/admin.orders.index-DonI8koQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1006-oKDjzUjGJY+lFdQd62JuekxF5Rk\"",
		"mtime": "2026-11-09T16:35:12.607Z",
		"size": 4102,
		"path": "../public/assets/admin.orders.index-DonI8koQ.js"
	},
	"/assets/admin.products.index-Bpy06t8O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b8-W6TF4zf4cojf7ZQa3aUM0cu/2Gs\"",
		"mtime": "2026-11-09T16:35:12.609Z",
		"size": 4280,
		"path": "../public/assets/admin.products.index-Bpy06t8O.js"
	},
	"/assets/admin.messages-CGsOeea5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"899-h3n2t2YOW3EHyVcJE5O83iTMnP4\"",
		"mtime": "2026-11-09T16:35:12.606Z",
		"size": 2201,
		"path": "../public/assets/admin.messages-CGsOeea5.js"
	},
	"/assets/admin.orders._id-CTQGn5DU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14ba-0yK+puh8r9gJbGT1J9lKe17rmhQ\"",
		"mtime": "2026-11-09T16:35:12.606Z",
		"size": 5306,
		"path": "../public/assets/admin.orders._id-CTQGn5DU.js"
	},
	"/assets/admin.products._id.index-1xCZ_EmZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"50b-QoJcpL/574qBfgUZz/Bg4HudXBE\"",
		"mtime": "2026-11-09T16:35:12.608Z",
		"size": 1291,
		"path": "../public/assets/admin.products._id.index-1xCZ_EmZ.js"
	},
	"/assets/admin.products.new-KLj7MDm-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34f-6owpNbGjPx345vJsIXwqghXmNyU\"",
		"mtime": "2026-11-09T16:35:12.610Z",
		"size": 847,
		"path": "../public/assets/admin.products.new-KLj7MDm-.js"
	},
	"/assets/admin.products._id.view-oGHw89eQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ed-80TzqybdytBhF4ZjMM5kFAPRpjk\"",
		"mtime": "2026-11-09T16:35:12.608Z",
		"size": 1261,
		"path": "../public/assets/admin.products._id.view-oGHw89eQ.js"
	},
	"/assets/admin.profile-BrGp1ZBi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b60-rGXiDE/a71Oo3D7nPU7kjWU5iVA\"",
		"mtime": "2026-11-09T16:35:12.610Z",
		"size": 11104,
		"path": "../public/assets/admin.profile-BrGp1ZBi.js"
	},
	"/assets/admin.settings-DMWAD_Q0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90f-NipaylneG2UGLfjBrYqGQ7HO/cs\"",
		"mtime": "2026-11-09T16:35:12.612Z",
		"size": 2319,
		"path": "../public/assets/admin.settings-DMWAD_Q0.js"
	},
	"/assets/admin.staff-NXx7e-7h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a99-FG0W9sADmXsGOHzsxfl9YHvZXXY\"",
		"mtime": "2026-11-09T16:35:12.612Z",
		"size": 10905,
		"path": "../public/assets/admin.staff-NXx7e-7h.js"
	},
	"/assets/admin_.invite-CkpdWRle.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1180-k8nJFC8K6CGKOY7tB85BhYa/WzI\"",
		"mtime": "2026-11-09T16:35:12.616Z",
		"size": 4480,
		"path": "../public/assets/admin_.invite-CkpdWRle.js"
	},
	"/assets/admin_.login-HtRAdxAE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a47-n2X8NEl+pipFLBCIbwTTF4FdyWw\"",
		"mtime": "2026-11-09T16:35:12.618Z",
		"size": 6727,
		"path": "../public/assets/admin_.login-HtRAdxAE.js"
	},
	"/assets/admin_.reset-password-DsU_5KaR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d81-TwwxQklQN4PZZuvFQvnV7lKj8R8\"",
		"mtime": "2026-11-09T16:35:12.619Z",
		"size": 3457,
		"path": "../public/assets/admin_.reset-password-DsU_5KaR.js"
	},
	"/assets/arrow-right-DrEcsUMj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-pPz88lDkmHfKjr7ooxScuVYcCHI\"",
		"mtime": "2026-11-09T16:35:12.622Z",
		"size": 154,
		"path": "../public/assets/arrow-right-DrEcsUMj.js"
	},
	"/assets/auth-TgJNIc_N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85d3-KeSVI4GFvNQ4ba7+7IPm2yBbV4Q\"",
		"mtime": "2026-11-09T16:35:12.624Z",
		"size": 34259,
		"path": "../public/assets/auth-TgJNIc_N.js"
	},
	"/assets/button-CAO3ZamB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6cc-J8s7UqduQhDQ/xcEr3n5UMs0OXU\"",
		"mtime": "2026-11-09T16:35:12.625Z",
		"size": 1740,
		"path": "../public/assets/button-CAO3ZamB.js"
	},
	"/assets/cart-B8TDe09O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca1-od88TsOcNVhaWqQ4rsIR1PDn5bg\"",
		"mtime": "2026-11-09T16:35:12.626Z",
		"size": 3233,
		"path": "../public/assets/cart-B8TDe09O.js"
	},
	"/assets/check-CNKk511f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"71-c9B4Pz3W8SWhIBwgaXSNkZEnMBs\"",
		"mtime": "2026-11-09T16:35:12.626Z",
		"size": 113,
		"path": "../public/assets/check-CNKk511f.js"
	},
	"/assets/checkout-DABtBRVC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d3c-WQjN9rwGvAPpY8e8GA3QNDUWXHc\"",
		"mtime": "2026-11-09T16:35:12.627Z",
		"size": 7484,
		"path": "../public/assets/checkout-DABtBRVC.js"
	},
	"/assets/contact-DC7zRjoa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b6-popaXq7fNU714UYxpFuaFneNKXw\"",
		"mtime": "2026-11-09T16:35:12.687Z",
		"size": 1974,
		"path": "../public/assets/contact-DC7zRjoa.js"
	},
	"/assets/jsx-runtime-DwuOsvnn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2230-bkegER1PxYsM3nuLQ1dQZp5l344\"",
		"mtime": "2026-11-09T16:35:12.688Z",
		"size": 8752,
		"path": "../public/assets/jsx-runtime-DwuOsvnn.js"
	},
	"/assets/link-BX90fYuV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fcf-5LDHOPSUFVp/r1cM/AiFKgihqTk\"",
		"mtime": "2026-11-09T16:35:12.688Z",
		"size": 8143,
		"path": "../public/assets/link-BX90fYuV.js"
	},
	"/assets/login-BHrl15jQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14b2-TcKaBmKOo/+7fUspwLCmmugnqdY\"",
		"mtime": "2026-11-09T16:35:12.708Z",
		"size": 5298,
		"path": "../public/assets/login-BHrl15jQ.js"
	},
	"/assets/matchContext-BPDZN20R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-y7z07cMNWTlvDCfxjWNo4WBA74M\"",
		"mtime": "2026-11-09T16:35:12.709Z",
		"size": 142,
		"path": "../public/assets/matchContext-BPDZN20R.js"
	},
	"/assets/message-circle-CCCa7bLN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-GIkQc6BDjKOQ64GvzH51qBRzvdA\"",
		"mtime": "2026-11-09T16:35:12.709Z",
		"size": 230,
		"path": "../public/assets/message-circle-CCCa7bLN.js"
	},
	"/assets/index-By3EMadC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6649d-Zdhwo8oTuP4V/ZkSDeRI5nSQ+SU\"",
		"mtime": "2026-11-09T16:35:12.587Z",
		"size": 418973,
		"path": "../public/assets/index-By3EMadC.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-11-09T16:35:12.710Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/order._publicId-DF_fCsLN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c4-enMBpROaquwtE18gGENjm2aaWPg\"",
		"mtime": "2026-11-09T16:35:12.711Z",
		"size": 2244,
		"path": "../public/assets/order._publicId-DF_fCsLN.js"
	},
	"/assets/product-bag-BncxQbJ2.jpg": {
		"type": "image/jpeg",
		"etag": "\"1199e-kHZZNit7Lg1z9h09xb5dMjGSUDI\"",
		"mtime": "2026-11-09T16:35:12.721Z",
		"size": 72094,
		"path": "../public/assets/product-bag-BncxQbJ2.jpg"
	},
	"/assets/product-boots-Dn4mLpoh.jpg": {
		"type": "image/jpeg",
		"etag": "\"ea78-8L9/Qna2JBzDh5cFC5U1bC3h6FE\"",
		"mtime": "2026-11-09T16:35:12.721Z",
		"size": 60024,
		"path": "../public/assets/product-boots-Dn4mLpoh.jpg"
	},
	"/assets/product-card-RN60U9O1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b8-X6Atb+9h4LGGAu0FE/QxDbBJiN0\"",
		"mtime": "2026-11-09T16:35:12.712Z",
		"size": 1208,
		"path": "../public/assets/product-card-RN60U9O1.js"
	},
	"/assets/product-denim-BCpByWBz.jpg": {
		"type": "image/jpeg",
		"etag": "\"17edd-oeX6N6+shvjLZVx6Cvxt0AxtQWg\"",
		"mtime": "2026-11-09T16:35:12.722Z",
		"size": 98013,
		"path": "../public/assets/product-denim-BCpByWBz.jpg"
	},
	"/assets/product-dress-BE5zlPsA.jpg": {
		"type": "image/jpeg",
		"etag": "\"1d441-dzKyxkoCuvrRsmbvuHSnQESlRYM\"",
		"mtime": "2026-11-09T16:35:12.723Z",
		"size": 119873,
		"path": "../public/assets/product-dress-BE5zlPsA.jpg"
	},
	"/assets/product-form-DbgzJmXM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1415-cFHDpSKVgiJXzkP7GGbEPvrTHos\"",
		"mtime": "2026-11-09T16:35:12.716Z",
		"size": 5141,
		"path": "../public/assets/product-form-DbgzJmXM.js"
	},
	"/assets/product-sunglasses-EBNTCF9S.jpg": {
		"type": "image/jpeg",
		"etag": "\"b975-NJhILW5BABIbPGe5+Wzom3RJrjk\"",
		"mtime": "2026-11-09T16:35:12.723Z",
		"size": 47477,
		"path": "../public/assets/product-sunglasses-EBNTCF9S.jpg"
	},
	"/assets/product-tee-CfHOYPMU.jpg": {
		"type": "image/jpeg",
		"etag": "\"ea08-oXpa5lhxWNOvDiv8kDJCiO931hE\"",
		"mtime": "2026-11-09T16:35:12.724Z",
		"size": 59912,
		"path": "../public/assets/product-tee-CfHOYPMU.jpg"
	},
	"/assets/product._slug-BhgIG2Js.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d77-qeRUTCte/Lq9TOCUzTJ0CY8Zpzk\"",
		"mtime": "2026-11-09T16:35:12.716Z",
		"size": 3447,
		"path": "../public/assets/product._slug-BhgIG2Js.js"
	},
	"/assets/redirect-1Dss4sOM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-AhfiXwQqYdLrM+uQAOtPHfIddmI\"",
		"mtime": "2026-11-09T16:35:12.717Z",
		"size": 534,
		"path": "../public/assets/redirect-1Dss4sOM.js"
	},
	"/assets/routes-BV4fO3ZD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b58-fHh1ZedbGXnF2kCjm8MQldID3X8\"",
		"mtime": "2026-11-09T16:35:12.718Z",
		"size": 2904,
		"path": "../public/assets/routes-BV4fO3ZD.js"
	},
	"/assets/shop-DTRCfnAK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"138c-oLgl5/tqTGDBcn4Jqv0wt1Xz/ak\"",
		"mtime": "2026-11-09T16:35:12.718Z",
		"size": 5004,
		"path": "../public/assets/shop-DTRCfnAK.js"
	},
	"/assets/styles-Dc2BJIr2.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"153e1-7zT4B8ofX9JqTVgOnk/QQiRHmaw\"",
		"mtime": "2026-11-09T16:35:12.725Z",
		"size": 87009,
		"path": "../public/assets/styles-Dc2BJIr2.css"
	},
	"/assets/thift-hero-CA0EzlFr.jpg": {
		"type": "image/jpeg",
		"etag": "\"219f9-+zkq7sULFGA6J1bZPA+835nyAmc\"",
		"mtime": "2026-11-09T16:35:12.725Z",
		"size": 137721,
		"path": "../public/assets/thift-hero-CA0EzlFr.jpg"
	},
	"/assets/useStore-dQnW3FY7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af0-hcGob4ZNMY640OmTh4kZXe/QgkA\"",
		"mtime": "2026-11-09T16:35:12.719Z",
		"size": 19184,
		"path": "../public/assets/useStore-dQnW3FY7.js"
	},
	"/assets/utils-C-4fyt0v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7761-Gb9b9e19JDw8BWzOT1fxKRNMDGs\"",
		"mtime": "2026-11-09T16:35:12.720Z",
		"size": 30561,
		"path": "../public/assets/utils-C-4fyt0v.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260603-beta_doten_f5a31b2ab83b8873132d93cfbb7f50f9/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_WxuNqP = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_WxuNqP
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260603-beta_doten_f5a31b2ab83b8873132d93cfbb7f50f9/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260603-beta_doten_f5a31b2ab83b8873132d93cfbb7f50f9/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260603-beta_doten_f5a31b2ab83b8873132d93cfbb7f50f9/node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260603-beta_doten_f5a31b2ab83b8873132d93cfbb7f50f9/node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
