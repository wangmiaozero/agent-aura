/*! agent-aura v1.1.0 | MIT | https://github.com/wangmiaozero/agent-aura */
import { t as e } from "./ShapeFieldAura-CtbAAVWa.js";
//#region src/WaterAura.ts
var t = class extends e {
	static attach(t, n = {}) {
		return e.attach(t, {
			...n,
			mode: "water"
		});
	}
	constructor(e = {}) {
		super({
			...e,
			mode: "water"
		});
	}
};
//#endregion
//#region src/entries/water.ts
function n(e, n) {
	return t.attach(e, n);
}
//#endregion
export { t as n, n as t };
