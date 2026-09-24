/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { t as e } from "./ShapeFieldAura-BrNfReT_.js";
//#region src/DemonicAura.ts
var t = class extends e {
	static attach(t, n = {}) {
		return e.attach(t, {
			...n,
			mode: "demonic"
		});
	}
	constructor(e = {}) {
		super({
			...e,
			mode: "demonic"
		});
	}
};
//#endregion
//#region src/entries/demonic.ts
function n(e, n) {
	return t.attach(e, n);
}
//#endregion
export { t as n, n as t };
