/*! agent-aura v1.1.0 | MIT | https://github.com/wangmiaozero/agent-aura */
//#region src/brand.ts
var e = !1;
function t(t = "agent-aura") {
	e || (e = !0, console.log(`%c✨ ${t} 1.1.0 ✨`, "background: linear-gradient(90deg, #39b6ff, #bd45fb, #ff5733, #ff7b22); color: white; text-shadow: 0 0 2px rgba(0, 0, 0, 0.2); font-weight: bold; font-size: 1em; padding: 2px 12px; border-radius: 6px;"));
}
//#endregion
//#region src/dom.ts
function n(e, t = "target") {
	if (e instanceof HTMLElement) return e;
	let n = document.querySelector(e);
	if (!(n instanceof HTMLElement)) throw Error(`agent-aura: ${t} not found: ${String(e)}`);
	return n;
}
function r(e, t = "container") {
	if (e) return n(e, t);
}
function i(e) {
	getComputedStyle(e).position === "static" && (e.style.position = "relative");
}
//#endregion
//#region src/gl/program.ts
function a(e, t, n) {
	let r = e.createShader(t);
	if (!r) throw Error("Failed to create shader");
	if (e.shaderSource(r, n), e.compileShader(r), !e.getShaderParameter(r, e.COMPILE_STATUS)) {
		let t = e.getShaderInfoLog(r) || "Unknown shader error";
		throw e.deleteShader(r), Error(t);
	}
	return r;
}
function o(e, t, n) {
	let r = a(e, e.VERTEX_SHADER, t), i = a(e, e.FRAGMENT_SHADER, n), o = e.createProgram();
	if (!o) throw Error("Failed to create program");
	if (e.attachShader(o, r), e.attachShader(o, i), e.linkProgram(o), !e.getProgramParameter(o, e.LINK_STATUS)) {
		let t = e.getProgramInfoLog(o) || "Unknown link error";
		throw e.deleteProgram(o), e.deleteShader(r), e.deleteShader(i), Error(t);
	}
	return e.deleteShader(r), e.deleteShader(i), o;
}
//#endregion
export { t as a, n as i, i as n, r, o as t };
