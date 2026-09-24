/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { t as e } from "./ShapeFieldAura-BrNfReT_.js";
//#region src/CultivationAura.ts
function t(e) {
	let { mistCount: t, spiritCount: n, auraSamples: r, fieldCount: i, detailCount: a, pathSamples: o, ...s } = e;
	return {
		...s,
		fieldCount: i ?? t,
		detailCount: a ?? n,
		pathSamples: o ?? r
	};
}
var n = class extends e {
	static attach(n, r = {}) {
		let { container: i, ...a } = r;
		return e.attach(n, {
			...t(a),
			container: i,
			mode: "immortal"
		});
	}
	constructor(e = {}) {
		super({
			...t(e),
			mode: "immortal"
		});
	}
};
//#endregion
//#region src/entries/cultivation.ts
function r(e, t) {
	return n.attach(e, t);
}
//#endregion
export { n, r as t };
