/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-C-xRtUiz.js";
import { n as a, r as o, t as s } from "./path-A-tRBNDQ.js";
//#region src/fire/glow.ts
var c = new Float32Array([
	-1,
	-1,
	1,
	-1,
	-1,
	1,
	-1,
	1,
	1,
	-1,
	1,
	1
]), l = class {
	gl;
	program;
	vao;
	buffer;
	uTime;
	constructor(e, t, n) {
		this.gl = e, this.program = i(e, t, n);
		let r = e.createVertexArray(), a = e.createBuffer();
		if (!r || !a) throw Error("Failed to create glow geometry");
		this.vao = r, this.buffer = a, e.bindVertexArray(r), e.bindBuffer(e.ARRAY_BUFFER, a), e.bufferData(e.ARRAY_BUFFER, c, e.STATIC_DRAW);
		let o = e.getAttribLocation(this.program, "aPosition");
		e.enableVertexAttribArray(o), e.vertexAttribPointer(o, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.uTime = e.getUniformLocation(this.program, "uTime");
	}
	draw(e) {
		let t = this.gl;
		t.useProgram(this.program), t.uniform1f(this.uTime, e), t.bindVertexArray(this.vao), t.drawArrays(t.TRIANGLES, 0, 6), t.bindVertexArray(null);
	}
	dispose() {
		this.gl.deleteBuffer(this.buffer), this.gl.deleteVertexArray(this.vao), this.gl.deleteProgram(this.program);
	}
};
//#endregion
//#region src/fire/math.ts
function u(e, t) {
	return e + Math.random() * (t - e);
}
function d(e, t, n) {
	return e + (t - e) * n;
}
function f() {
	return {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: 0,
		height: 0
	};
}
function p(e, t, n) {
	let r = e.getBoundingClientRect(), i = r.left - t.left, a = r.top - t.top, o = r.right - t.left, s = r.bottom - t.top;
	return {
		left: i - n,
		right: o + n,
		top: t.height - a + n,
		bottom: t.height - s - n,
		width: r.width + n * 2,
		height: r.height + n * 2
	};
}
function m(e, t, n) {
	let r = a(e, t.left, t.top, n, 8), i = 0;
	for (let e = 0; e < r.length; e++) {
		let t = r[e], n = r[(e + 1) % r.length];
		i += t.x * n.y - n.x * t.y;
	}
	return {
		viewHeight: t.height,
		path: s(r),
		clockwise: i >= 0
	};
}
function h(e, t, n) {
	return n && n.path.total > 0 ? g(n, t) : t === "burning" ? y(e) : v(e);
}
function g(e, t) {
	let n = _(e, Math.random());
	if (t === "burning") for (let t = 0; t < 6; t++) {
		let t = _(e, Math.random()), r = t.side === "top" ? 2.2 : t.side === "bottom" ? .6 : .8;
		if (Math.random() < r / 2.2) {
			n = t;
			break;
		}
	}
	return n;
}
function _(e, t) {
	let n = o(e.path, t), r = n.tangent.y, i = -n.tangent.x;
	e.clockwise || (r = -r, i = -i);
	let a = r, s = -i, c = Math.abs(s) >= Math.abs(a) ? s >= 0 ? "top" : "bottom" : a >= 0 ? "right" : "left";
	return {
		x: n.point.x,
		y: e.viewHeight - n.point.y,
		normalX: a,
		normalY: s,
		side: c
	};
}
function v(e) {
	let t = Math.max(e.width, 1), n = Math.max(e.height, 1), r = t * 2 + n * 2, i = Math.random() * r;
	return i < t ? {
		x: e.left + Math.random() * e.width,
		y: e.top,
		normalX: 0,
		normalY: 1,
		side: "top"
	} : (i -= t, i < n ? {
		x: e.right,
		y: e.bottom + Math.random() * e.height,
		normalX: 1,
		normalY: 0,
		side: "right"
	} : (i -= n, i < t ? {
		x: e.left + Math.random() * e.width,
		y: e.bottom,
		normalX: 0,
		normalY: -1,
		side: "bottom"
	} : {
		x: e.left,
		y: e.bottom + Math.random() * e.height,
		normalX: -1,
		normalY: 0,
		side: "left"
	}));
}
function y(e) {
	let t = Math.max(e.width, 1), n = Math.max(e.height, 1), r = t * 2.2, i = n * .8, a = t * .6, o = n * .8, s = r + i + a + o, c = Math.random() * s;
	if (c < r) {
		let n = Math.random(), r = e.left + n * t;
		return Math.random() < .24 && (r = Math.random() < .5 ? e.left + u(0, 90) : e.right - u(0, 90)), {
			x: r,
			y: e.top,
			normalX: 0,
			normalY: 1,
			side: "top"
		};
	}
	return c -= r, c < i ? {
		x: e.right,
		y: e.bottom + Math.random() * n,
		normalX: 1,
		normalY: 0,
		side: "right"
	} : (c -= i, c < a ? {
		x: e.left + Math.random() * t,
		y: e.bottom,
		normalX: 0,
		normalY: -1,
		side: "bottom"
	} : {
		x: e.left,
		y: e.bottom + Math.random() * n,
		normalX: -1,
		normalY: 0,
		side: "left"
	});
}
//#endregion
//#region src/fire/particles.ts
var b = class {
	positions;
	colors;
	sizes;
	alphas;
	gl;
	program;
	vao;
	positionBuffer;
	colorBuffer;
	sizeBuffer;
	alphaBuffer;
	uResolution;
	uPixelRatio;
	uCoreBoost;
	uOuterStart;
	uOuterEnd;
	count;
	constructor(e, t, n, r) {
		this.gl = e, this.count = t, this.positions = new Float32Array(t * 3), this.colors = new Float32Array(t * 3), this.sizes = new Float32Array(t), this.alphas = new Float32Array(t), this.program = i(e, n, r);
		let a = e.createVertexArray();
		if (!a) throw Error("Failed to create VAO");
		this.vao = a, e.bindVertexArray(a), this.positionBuffer = this.createAttribute("aPosition", this.positions, 3), this.colorBuffer = this.createAttribute("aColor", this.colors, 3), this.sizeBuffer = this.createAttribute("aSize", this.sizes, 1), this.alphaBuffer = this.createAttribute("aAlpha", this.alphas, 1), this.uResolution = e.getUniformLocation(this.program, "uResolution"), this.uPixelRatio = e.getUniformLocation(this.program, "uPixelRatio"), this.uCoreBoost = e.getUniformLocation(this.program, "uCoreBoost"), this.uOuterStart = e.getUniformLocation(this.program, "uOuterStart"), this.uOuterEnd = e.getUniformLocation(this.program, "uOuterEnd"), e.bindVertexArray(null), e.bindBuffer(e.ARRAY_BUFFER, null);
	}
	setStyle(e, t, n) {
		this.gl.useProgram(this.program), this.uCoreBoost && this.gl.uniform1f(this.uCoreBoost, e), this.uOuterStart && this.gl.uniform1f(this.uOuterStart, t), this.uOuterEnd && this.gl.uniform1f(this.uOuterEnd, n);
	}
	setView(e, t, n) {
		this.gl.useProgram(this.program), this.gl.uniform2f(this.uResolution, e, t), this.gl.uniform1f(this.uPixelRatio, n);
	}
	upload() {
		let e = this.gl;
		e.bindBuffer(e.ARRAY_BUFFER, this.positionBuffer), e.bufferSubData(e.ARRAY_BUFFER, 0, this.positions), e.bindBuffer(e.ARRAY_BUFFER, this.colorBuffer), e.bufferSubData(e.ARRAY_BUFFER, 0, this.colors), e.bindBuffer(e.ARRAY_BUFFER, this.sizeBuffer), e.bufferSubData(e.ARRAY_BUFFER, 0, this.sizes), e.bindBuffer(e.ARRAY_BUFFER, this.alphaBuffer), e.bufferSubData(e.ARRAY_BUFFER, 0, this.alphas);
	}
	draw() {
		let e = this.gl;
		e.useProgram(this.program), e.bindVertexArray(this.vao), e.drawArrays(e.POINTS, 0, this.count), e.bindVertexArray(null);
	}
	dispose() {
		let e = this.gl;
		e.deleteBuffer(this.positionBuffer), e.deleteBuffer(this.colorBuffer), e.deleteBuffer(this.sizeBuffer), e.deleteBuffer(this.alphaBuffer), e.deleteVertexArray(this.vao), e.deleteProgram(this.program);
	}
	createAttribute(e, t, n) {
		let r = this.gl, i = r.createBuffer();
		if (!i) throw Error("Failed to create buffer");
		r.bindBuffer(r.ARRAY_BUFFER, i), r.bufferData(r.ARRAY_BUFFER, t, r.DYNAMIC_DRAW);
		let a = r.getAttribLocation(this.program, e);
		return r.enableVertexAttribArray(a), r.vertexAttribPointer(a, n, r.FLOAT, !1, 0, 0), i;
	}
}, x = "#version 300 es\nprecision mediump float;\nin vec3 vColor;\nin float vAlpha;\nout vec4 outColor;\nuniform float uCoreBoost;\nuniform float uOuterStart;\nuniform float uOuterEnd;\nvec3 linearToSrgb(vec3 c) {\nvec3 higher = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;\nvec3 lower = c * 12.92;\nbvec3 cutoff = lessThan(c, vec3(0.0031308));\nreturn vec3(\ncutoff.x ? lower.x : higher.x,\ncutoff.y ? lower.y : higher.y,\ncutoff.z ? lower.z : higher.z\n);\n}\nvoid main() {\nvec2 uv = gl_PointCoord - vec2(0.5);\nuv.x *= 1.35;\nuv.y *= 0.82;\nfloat dist = length(uv);\nfloat outer = 1.0 - smoothstep(uOuterStart, uOuterEnd, dist);\nfloat core = 1.0 - smoothstep(0.0, 0.18, dist);\nvec3 color = vColor + core * vec3(0.45, 0.22, 0.05) * uCoreBoost;\nfloat alpha = outer * vAlpha;\nif (alpha < 0.01) discard;\nvec3 srgb = linearToSrgb(color);\noutColor = vec4(srgb * alpha, alpha);\n}", S = "#version 300 es\nprecision mediump float;\nin vec2 vUv;\nuniform float uTime;\nout vec4 outColor;\nvoid main() {\nvec2 center = vec2(0.5, 0.48);\nfloat dist = distance(vUv, center);\nfloat pulse = 0.5 + 0.5 * sin(uTime * 2.2);\nfloat redAura = smoothstep(0.78, 0.1, dist) * 0.22;\nfloat coreAura = smoothstep(0.42, 0.0, dist) * (0.1 + pulse * 0.08);\nvec3 color = vec3(\nredAura + coreAura,\nredAura * 0.22 + coreAura * 0.18,\nredAura * 0.06\n);\nfloat alpha = max(color.r, max(color.g, color.b));\nif (alpha < 0.004) discard;\noutColor = vec4(color * alpha, alpha);\n}", C = "#version 300 es\nin vec2 aPosition;\nout vec2 vUv;\nvoid main() {\nvUv = aPosition * 0.5 + 0.5;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", w = "#version 300 es\nin vec3 aPosition;\nin vec3 aColor;\nin float aSize;\nin float aAlpha;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nout vec3 vColor;\nout float vAlpha;\nvoid main() {\nvColor = aColor;\nvAlpha = aAlpha;\nvec2 clip = (aPosition.xy / uResolution) * 2.0 - 1.0;\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = max(aSize * uPixelRatio, 1.0);\n}", T = "#version 300 es\nprecision mediump float;\nin vec3 vColor;\nin float vAlpha;\nout vec4 outColor;\nvoid main() {\nvec2 uv = gl_PointCoord - vec2(0.5);\nfloat dist = length(uv);\nfloat alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;\nif (alpha < 0.01) discard;\noutColor = vec4(vColor * alpha, alpha);\n}";
//#endregion
//#region src/fire/spawn.ts
function E(e, t, n, r) {
	return e === "burning" ? A(t, n, r) : k(t, n, r);
}
function D(e, t, n) {
	let r = h(e, "burning", n), i = u(1, 2.6);
	return {
		x: r.x + u(-14, 14),
		y: r.y + u(-4, 14),
		z: -2,
		vx: r.normalX * u(4, 18) + u(-16, 16),
		vy: u(18, 54),
		maxLife: i,
		life: t ? Math.random() * i : i,
		baseSize: u(20, 60),
		seed: Math.random() * Math.PI * 2
	};
}
function O(e, t, n, r, i) {
	let a, o, s;
	if (i === "burning") if (r) a = 1, o = d(.82, .14, n), s = d(.16, .02, n);
	else if (n < .18) {
		let e = n / .18;
		a = 1, o = d(.98, .68, e), s = d(.56, .08, e);
	} else if (n < .58) {
		let e = (n - .18) / .4;
		a = 1, o = d(.68, .16, e), s = d(.08, .01, e);
	} else {
		let e = (n - .58) / .42;
		a = d(1, .38, e), o = d(.16, .02, e), s = 0;
	}
	else if (r) a = 1, o = d(.65, .1, n), s = .015;
	else if (n < .22) {
		let e = n / .22;
		a = 1, o = d(.95, .58, e), s = d(.45, .03, e);
	} else if (n < .62) {
		let e = (n - .22) / .4;
		a = 1, o = d(.58, .13, e), s = d(.03, .005, e);
	} else {
		let e = (n - .62) / .38;
		a = d(1, .32, e), o = d(.13, .01, e), s = 0;
	}
	e[t * 3] = a, e[t * 3 + 1] = o, e[t * 3 + 2] = s;
}
function k(e, t, n) {
	let r = h(e, "border", n), i = Math.random() < .12, a = {
		x: r.x + u(-2, 2),
		y: r.y + u(-2, 2),
		z: u(-1, 1),
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		baseSize: 0,
		seed: Math.random() * Math.PI * 2,
		spark: i,
		side: r.side
	};
	return i ? (a.vx = r.normalX * u(20, 80) + u(-35, 35), a.vy = u(55, 160), a.maxLife = u(.7, 1.5), a.baseSize = u(2, 6)) : (a.vx = r.normalX * u(8, 38) + u(-16, 16), a.vy = u(25, 105), r.side === "top" && (a.vy += u(25, 90)), a.maxLife = u(.35, 1.05), a.baseSize = u(13, 32)), (r.side === "left" || r.side === "right") && (a.vy *= u(.7, 1.15)), a.life = t ? Math.random() * a.maxLife : a.maxLife, a;
}
function A(e, t, n) {
	let r = h(e, "burning", n), i = Math.random() < .17, a = {
		x: r.x + u(-3, 3),
		y: r.y + u(-3, 3),
		z: u(-1, 1),
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		baseSize: 0,
		seed: Math.random() * Math.PI * 2,
		spark: i,
		side: r.side
	};
	return i ? (a.vx = r.normalX * u(40, 120) + u(-55, 55), a.vy = u(90, 220), a.baseSize = u(3, 7), a.maxLife = u(.45, 1.2)) : (a.vx = r.normalX * u(14, 46) + u(-26, 26), a.vy = u(70, 180), a.baseSize = u(14, 38), a.maxLife = u(.35, 1.15), r.side === "top" && (a.vy += u(40, 110), a.baseSize += u(4, 14)), (r.side === "left" || r.side === "right") && (a.vx += r.normalX * u(8, 28)), Math.random() < .12 && (a.baseSize *= 1.45, a.vy *= 1.18)), a.life = t ? Math.random() * a.maxLife : a.maxLife, a;
}
//#endregion
//#region src/fire/engine.ts
var j = class {
	element;
	canvas;
	gl;
	options;
	target;
	container;
	fire;
	smoke;
	glow;
	fireData = [];
	smokeData = [];
	bounds = f();
	outline = null;
	running = !1;
	disposed = !1;
	rafId = null;
	lastTime = 0;
	startTime = 0;
	pixelRatio = 1;
	observer;
	onResize = () => {
		this.resizeToView();
	};
	onScroll = () => {
		this.updateBounds();
	};
	constructor(t = {}) {
		let n = t.preset ?? "border";
		this.options = {
			preset: n,
			particleCount: t.particleCount ?? (n === "burning" ? 2200 : 1300),
			smokeCount: t.smokeCount ?? (n === "burning" ? 520 : 0),
			glow: t.glow ?? n === "burning",
			padding: t.padding ?? (n === "burning" ? 2 : 1),
			zIndex: t.zIndex ?? 10,
			skipGreeting: t.skipGreeting,
			classNames: t.classNames,
			styles: t.styles,
			onFrame: t.onFrame
		}, this.target = t.target, this.container = t.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.zIndex = String(this.options.zIndex), this.canvas.style.background = "transparent", this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let r = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !0,
			powerPreference: "high-performance"
		});
		if (!r) throw Error("WebGL2 is required but not available.");
		this.gl = r, this.fire = new b(r, this.options.particleCount, w, x), n === "burning" ? this.fire.setStyle(1.15, .18, .56) : this.fire.setStyle(1.05, .12, .52), this.smoke = this.options.smokeCount > 0 ? new b(r, this.options.smokeCount, w, T) : null, this.glow = this.options.glow ? new l(r, C, S) : null, this.options.skipGreeting || e("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.updateBounds(), this.running && this.seedParticles(!0);
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.resizeToView();
	}
	start() {
		if (this.disposed) throw Error("Fire instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.observe(), this.resizeToView(), this.seedParticles(!0), this.render(0, 0);
		let e = (t) => {
			if (!this.running) return;
			this.rafId = requestAnimationFrame(e);
			let n = Math.min((t - this.lastTime) / 1e3, .033);
			this.lastTime = t, this.render((t - this.startTime) * .001, n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("Fire instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		this.disposed || (this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect(), this.fire.dispose(), this.smoke?.dispose(), this.glow?.dispose(), this.canvas.remove());
	}
	applyCanvasLayout() {
		let e = !!this.container;
		this.canvas.style.position = e ? "absolute" : "fixed", this.canvas.style.inset = "0", this.canvas.style.width = "100%", this.canvas.style.height = "100%";
	}
	viewBox() {
		if (this.container) {
			let e = this.container.getBoundingClientRect();
			return {
				width: e.width,
				height: e.height,
				left: e.left,
				top: e.top
			};
		}
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			left: 0,
			top: 0
		};
	}
	observe() {
		this.disconnect(), window.addEventListener("resize", this.onResize), window.addEventListener("scroll", this.onScroll, !0), this.observer = new ResizeObserver(() => this.resizeToView()), this.target && this.observer.observe(this.target), this.container && this.observer.observe(this.container);
	}
	disconnect() {
		window.removeEventListener("resize", this.onResize), window.removeEventListener("scroll", this.onScroll, !0), this.observer?.disconnect(), this.observer = void 0;
	}
	resizeToView() {
		if (this.disposed) return;
		let e = this.viewBox();
		this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		let t = Math.max(1, Math.floor(e.width * this.pixelRatio)), n = Math.max(1, Math.floor(e.height * this.pixelRatio));
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n), this.gl.viewport(0, 0, t, n), this.gl.clearColor(0, 0, 0, 0), this.gl.clear(this.gl.COLOR_BUFFER_BIT), this.fire.setView(e.width, e.height, this.pixelRatio), this.smoke?.setView(e.width, e.height, this.pixelRatio), this.updateBounds();
	}
	updateBounds() {
		let e = this.viewBox(), t = this.target ?? this.container;
		if (!t) {
			this.bounds = {
				left: e.width * .1,
				right: e.width * .9,
				top: e.height * .82,
				bottom: e.height * .18,
				width: e.width * .8,
				height: e.height * .64
			}, this.outline = null;
			return;
		}
		this.bounds = p(t, e, this.options.padding), this.outline = m(t, e, this.options.padding);
	}
	seedParticles(e) {
		this.fireData = [];
		for (let t = 0; t < this.options.particleCount; t++) this.writeFire(t, E(this.options.preset, this.bounds, e, this.outline));
		if (this.smokeData = [], this.smoke) for (let t = 0; t < this.options.smokeCount; t++) this.writeSmoke(t, D(this.bounds, e, this.outline));
	}
	writeFire(e, t) {
		this.fireData[e] = t, this.fire.positions[e * 3] = t.x, this.fire.positions[e * 3 + 1] = t.y, this.fire.positions[e * 3 + 2] = t.z;
	}
	writeSmoke(e, t) {
		this.smokeData[e] = t, this.smoke && (this.smoke.positions[e * 3] = t.x, this.smoke.positions[e * 3 + 1] = t.y, this.smoke.positions[e * 3 + 2] = t.z);
	}
	render(e, t) {
		let n = this.gl, r = this.options.preset;
		for (let n = 0; n < this.options.particleCount; n++) {
			let i = this.fireData[n];
			if (i.life -= t, i.life <= 0) {
				this.writeFire(n, E(r, this.bounds, !1, this.outline));
				continue;
			}
			let a = 1 - i.life / i.maxLife;
			if (r === "burning") {
				let n = Math.sin(e * 9.5 + i.seed + a * 12), r = Math.cos(e * 5 + i.seed * 1.7 + a * 9);
				i.spark ? (i.x += (i.vx + n * 18) * t, i.y += i.vy * t, i.vy -= 48 * t) : (i.x += (i.vx + n * 34 + r * 12) * t, i.y += i.vy * t, i.vx += n * 16 * t);
			} else {
				let n = Math.sin(e * 7.5 + i.seed + a * 8);
				i.spark ? (i.x += i.vx * t, i.y += i.vy * t, i.vy -= 35 * t) : (i.x += (i.vx + n * 24) * t, i.y += i.vy * t, i.vx += n * t * 18);
			}
			this.fire.positions[n * 3] = i.x, this.fire.positions[n * 3 + 1] = i.y;
			let o = a < .12 ? a / .12 : 1 - (a - .12) / .88;
			r === "burning" ? (o = a < .1 ? a / .1 : 1 - (a - .1) / .9, o = Math.max(o, 0) ** 1.2, i.spark ? (this.fire.alphas[n] = o * 1.32, this.fire.sizes[n] = i.baseSize * (1 - a * .55)) : (this.fire.alphas[n] = o * 1, this.fire.sizes[n] = i.baseSize * (.65 + a * 1.55))) : (o = Math.max(o, 0) ** 1.25, i.spark ? (this.fire.alphas[n] = o * 1.22, this.fire.sizes[n] = i.baseSize * (1 - a * .55)) : (this.fire.alphas[n] = o * .86, this.fire.sizes[n] = i.baseSize * (.58 + a * 1.4))), O(this.fire.colors, n, a, i.spark, r);
		}
		if (this.smoke) {
			for (let n = 0; n < this.options.smokeCount; n++) {
				let r = this.smokeData[n];
				if (r.life -= t, r.life <= 0) {
					this.writeSmoke(n, D(this.bounds, !1, this.outline));
					continue;
				}
				let i = 1 - r.life / r.maxLife, a = Math.sin(e * 1.8 + r.seed + i * 4);
				r.x += (r.vx + a * 12) * t, r.y += r.vy * t, this.smoke.positions[n * 3] = r.x, this.smoke.positions[n * 3 + 1] = r.y, this.smoke.sizes[n] = r.baseSize * (.65 + i * 1.85), this.smoke.alphas[n] = (1 - i) ** 1.4 * .16;
				let o = d(.16, .34, i);
				this.smoke.colors[n * 3] = o, this.smoke.colors[n * 3 + 1] = o * .92, this.smoke.colors[n * 3 + 2] = o * .9;
			}
			this.smoke.upload();
		}
		this.fire.upload(), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), n.enable(n.BLEND), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.blendFuncSeparate(n.ONE, n.ONE_MINUS_SRC_ALPHA, n.ONE, n.ONE_MINUS_SRC_ALPHA), this.glow?.draw(e), this.smoke?.draw(), n.blendFuncSeparate(n.ONE, n.ONE, n.ONE, n.ONE), this.fire.draw(), this.options.onFrame?.(e);
	}
}, M = class e {
	element;
	engine;
	static attach(i, a = {}) {
		let o = t(i), { container: s, ...c } = a, l = r(s);
		l && n(l);
		let u = new e({
			...c,
			target: o,
			container: l
		});
		return (l ?? document.body).appendChild(u.element), u.start(), u;
	}
	constructor(e = {}) {
		this.engine = new j({
			...e,
			preset: "burning",
			particleCount: e.particleCount ?? 2200,
			smokeCount: e.smokeCount ?? 520,
			glow: e.glow ?? !0,
			padding: e.padding ?? 2
		}), this.element = this.engine.element;
	}
	setTarget(e) {
		this.engine.setTarget(e);
	}
	setContainer(e) {
		this.engine.setContainer(e);
	}
	start() {
		this.engine.start();
	}
	pause() {
		this.engine.pause();
	}
	dispose() {
		this.engine.dispose();
	}
}, N = class e {
	element;
	engine;
	static attach(i, a = {}) {
		let o = t(i), { container: s, ...c } = a, l = r(s);
		l && n(l);
		let u = new e({
			...c,
			target: o,
			container: l
		});
		return (l ?? document.body).appendChild(u.element), u.start(), u;
	}
	constructor(e = {}) {
		this.engine = new j({
			...e,
			preset: "border",
			smokeCount: 0,
			glow: !1,
			particleCount: e.particleCount ?? 1300,
			padding: e.padding ?? 1
		}), this.element = this.engine.element;
	}
	setTarget(e) {
		this.engine.setTarget(e);
	}
	setContainer(e) {
		this.engine.setContainer(e);
	}
	start() {
		this.engine.start();
	}
	pause() {
		this.engine.pause();
	}
	dispose() {
		this.engine.dispose();
	}
};
//#endregion
//#region src/entries/fire.ts
function P(e, t) {
	return N.attach(e, t);
}
function F(e, t) {
	return M.attach(e, t);
}
//#endregion
export { M as i, P as n, N as r, F as t };
