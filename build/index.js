/*! agent-aura v1.0.1 | MIT | https://github.com/wangmiaozero/agent-aura */
//#region src/dom.ts
function e(e, t = "target") {
	if (e instanceof HTMLElement) return e;
	let n = document.querySelector(e);
	if (!(n instanceof HTMLElement)) throw Error(`agent-aura: ${t} not found: ${String(e)}`);
	return n;
}
function t(t, n = "container") {
	if (t) return e(t, n);
}
function n(e) {
	getComputedStyle(e).position === "static" && (e.style.position = "relative");
}
//#endregion
//#region src/brand.ts
var r = !1;
function i(e = "agent-aura") {
	r || (r = !0, console.log(`%c✨ ${e} 1.0.1 ✨`, "background: linear-gradient(90deg, #39b6ff, #bd45fb, #ff5733, #ff7b22); color: white; text-shadow: 0 0 2px rgba(0, 0, 0, 0.2); font-weight: bold; font-size: 1em; padding: 2px 12px; border-radius: 6px;"));
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
//#region src/fire/glow.ts
var s = new Float32Array([
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
]), c = class {
	gl;
	program;
	vao;
	buffer;
	uTime;
	constructor(e, t, n) {
		this.gl = e, this.program = o(e, t, n);
		let r = e.createVertexArray(), i = e.createBuffer();
		if (!r || !i) throw Error("Failed to create glow geometry");
		this.vao = r, this.buffer = i, e.bindVertexArray(r), e.bindBuffer(e.ARRAY_BUFFER, i), e.bufferData(e.ARRAY_BUFFER, s, e.STATIC_DRAW);
		let a = e.getAttribLocation(this.program, "aPosition");
		e.enableVertexAttribArray(a), e.vertexAttribPointer(a, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.uTime = e.getUniformLocation(this.program, "uTime");
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
function l(e, t) {
	return e + Math.random() * (t - e);
}
function u(e, t, n) {
	return e + (t - e) * n;
}
function d() {
	return {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: 0,
		height: 0
	};
}
function f(e, t, n) {
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
function p(e, t) {
	return t === "burning" ? h(e) : m(e);
}
function m(e) {
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
function h(e) {
	let t = Math.max(e.width, 1), n = Math.max(e.height, 1), r = t * 2.2, i = n * .8, a = t * .6, o = n * .8, s = r + i + a + o, c = Math.random() * s;
	if (c < r) {
		let n = Math.random(), r = e.left + n * t;
		return Math.random() < .24 && (r = Math.random() < .5 ? e.left + l(0, 90) : e.right - l(0, 90)), {
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
var g = class {
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
		this.gl = e, this.count = t, this.positions = new Float32Array(t * 3), this.colors = new Float32Array(t * 3), this.sizes = new Float32Array(t), this.alphas = new Float32Array(t), this.program = o(e, n, r);
		let i = e.createVertexArray();
		if (!i) throw Error("Failed to create VAO");
		this.vao = i, e.bindVertexArray(i), this.positionBuffer = this.createAttribute("aPosition", this.positions, 3), this.colorBuffer = this.createAttribute("aColor", this.colors, 3), this.sizeBuffer = this.createAttribute("aSize", this.sizes, 1), this.alphaBuffer = this.createAttribute("aAlpha", this.alphas, 1), this.uResolution = e.getUniformLocation(this.program, "uResolution"), this.uPixelRatio = e.getUniformLocation(this.program, "uPixelRatio"), this.uCoreBoost = e.getUniformLocation(this.program, "uCoreBoost"), this.uOuterStart = e.getUniformLocation(this.program, "uOuterStart"), this.uOuterEnd = e.getUniformLocation(this.program, "uOuterEnd"), e.bindVertexArray(null), e.bindBuffer(e.ARRAY_BUFFER, null);
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
}, _ = "#version 300 es\nprecision mediump float;\nin vec3 vColor;\nin float vAlpha;\nout vec4 outColor;\nuniform float uCoreBoost;\nuniform float uOuterStart;\nuniform float uOuterEnd;\nvoid main() {\nvec2 uv = gl_PointCoord - vec2(0.5);\nuv.x *= 1.35;\nuv.y *= 0.82;\nfloat dist = length(uv);\nfloat outer = 1.0 - smoothstep(uOuterStart, uOuterEnd, dist);\nfloat core = 1.0 - smoothstep(0.0, 0.18, dist);\nvec3 color = vColor + core * vec3(0.35, 0.18, 0.05) * uCoreBoost;\nfloat alpha = outer * vAlpha;\nif (alpha < 0.01) discard;\noutColor = vec4(color, alpha);\n}", v = "#version 300 es\nprecision mediump float;\nin vec2 vUv;\nuniform float uTime;\nout vec4 outColor;\nvoid main() {\nvec2 center = vec2(0.5, 0.48);\nfloat dist = distance(vUv, center);\nfloat pulse = 0.5 + 0.5 * sin(uTime * 2.2);\nfloat redAura = smoothstep(0.7, 0.12, dist) * 0.12;\nfloat coreAura = smoothstep(0.36, 0.0, dist) * (0.06 + pulse * 0.05);\nvec3 color = vec3(\nredAura + coreAura,\nredAura * 0.22 + coreAura * 0.18,\nredAura * 0.06\n);\nfloat alpha = max(color.r, max(color.g, color.b));\nif (alpha < 0.004) discard;\noutColor = vec4(color, alpha);\n}", y = "#version 300 es\nin vec2 aPosition;\nout vec2 vUv;\nvoid main() {\nvUv = aPosition * 0.5 + 0.5;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", b = "#version 300 es\nin vec3 aPosition;\nin vec3 aColor;\nin float aSize;\nin float aAlpha;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nout vec3 vColor;\nout float vAlpha;\nvoid main() {\nvColor = aColor;\nvAlpha = aAlpha;\nvec2 clip = (aPosition.xy / uResolution) * 2.0 - 1.0;\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = max(aSize * uPixelRatio, 1.0);\n}", x = "#version 300 es\nprecision mediump float;\nin vec3 vColor;\nin float vAlpha;\nout vec4 outColor;\nvoid main() {\nvec2 uv = gl_PointCoord - vec2(0.5);\nfloat dist = length(uv);\nfloat alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;\nif (alpha < 0.01) discard;\noutColor = vec4(vColor, alpha);\n}";
//#endregion
//#region src/fire/spawn.ts
function S(e, t, n) {
	return e === "burning" ? E(t, n) : T(t, n);
}
function C(e, t) {
	let n = p(e, "burning"), r = l(1, 2.6);
	return {
		x: n.x + l(-14, 14),
		y: n.y + l(-4, 14),
		z: -2,
		vx: n.normalX * l(4, 18) + l(-16, 16),
		vy: l(18, 54),
		maxLife: r,
		life: t ? Math.random() * r : r,
		baseSize: l(20, 60),
		seed: Math.random() * Math.PI * 2
	};
}
function w(e, t, n, r, i) {
	let a, o, s;
	if (i === "burning") if (r) a = 1, o = u(.82, .14, n), s = u(.16, .02, n);
	else if (n < .18) {
		let e = n / .18;
		a = 1, o = u(.98, .68, e), s = u(.56, .08, e);
	} else if (n < .58) {
		let e = (n - .18) / .4;
		a = 1, o = u(.68, .16, e), s = u(.08, .01, e);
	} else {
		let e = (n - .58) / .42;
		a = u(1, .38, e), o = u(.16, .02, e), s = 0;
	}
	else if (r) a = 1, o = u(.65, .1, n), s = .015;
	else if (n < .22) {
		let e = n / .22;
		a = 1, o = u(.95, .58, e), s = u(.45, .03, e);
	} else if (n < .62) {
		let e = (n - .22) / .4;
		a = 1, o = u(.58, .13, e), s = u(.03, .005, e);
	} else {
		let e = (n - .62) / .38;
		a = u(1, .32, e), o = u(.13, .01, e), s = 0;
	}
	e[t * 3] = a, e[t * 3 + 1] = o, e[t * 3 + 2] = s;
}
function T(e, t) {
	let n = p(e, "border"), r = Math.random() < .12, i = {
		x: n.x + l(-2, 2),
		y: n.y + l(-2, 2),
		z: l(-1, 1),
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		baseSize: 0,
		seed: Math.random() * Math.PI * 2,
		spark: r,
		side: n.side
	};
	return r ? (i.vx = n.normalX * l(20, 80) + l(-35, 35), i.vy = l(55, 160), i.maxLife = l(.7, 1.5), i.baseSize = l(1.5, 4.5)) : (i.vx = n.normalX * l(8, 38) + l(-16, 16), i.vy = l(25, 105), n.side === "top" && (i.vy += l(25, 90)), i.maxLife = l(.35, 1.05), i.baseSize = l(10, 27)), (n.side === "left" || n.side === "right") && (i.vy *= l(.7, 1.15)), i.life = t ? Math.random() * i.maxLife : i.maxLife, i;
}
function E(e, t) {
	let n = p(e, "burning"), r = Math.random() < .17, i = {
		x: n.x + l(-3, 3),
		y: n.y + l(-3, 3),
		z: l(-1, 1),
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		baseSize: 0,
		seed: Math.random() * Math.PI * 2,
		spark: r,
		side: n.side
	};
	return r ? (i.vx = n.normalX * l(40, 120) + l(-55, 55), i.vy = l(90, 220), i.baseSize = l(2, 6), i.maxLife = l(.45, 1.2)) : (i.vx = n.normalX * l(14, 46) + l(-26, 26), i.vy = l(70, 180), i.baseSize = l(12, 34), i.maxLife = l(.35, 1.15), n.side === "top" && (i.vy += l(40, 110), i.baseSize += l(2, 10)), (n.side === "left" || n.side === "right") && (i.vx += n.normalX * l(8, 28)), Math.random() < .12 && (i.baseSize *= 1.45, i.vy *= 1.18)), i.life = t ? Math.random() * i.maxLife : i.maxLife, i;
}
//#endregion
//#region src/fire/engine.ts
var D = class {
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
	bounds = d();
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
	constructor(e = {}) {
		let t = e.preset ?? "border";
		this.options = {
			preset: t,
			particleCount: e.particleCount ?? (t === "burning" ? 2200 : 1300),
			smokeCount: e.smokeCount ?? (t === "burning" ? 520 : 0),
			glow: e.glow ?? t === "burning",
			padding: e.padding ?? (t === "burning" ? 2 : 1),
			zIndex: e.zIndex ?? 10,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles,
			onFrame: e.onFrame
		}, this.target = e.target, this.container = e.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.zIndex = String(this.options.zIndex), this.canvas.style.background = "transparent", this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let n = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !1,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!n) throw Error("WebGL2 is required but not available.");
		this.gl = n, this.fire = new g(n, this.options.particleCount, b, _), t === "burning" ? this.fire.setStyle(1, .18, .56) : this.fire.setStyle(.9, .12, .52), this.smoke = this.options.smokeCount > 0 ? new g(n, this.options.smokeCount, b, x) : null, this.glow = this.options.glow ? new c(n, y, v) : null, this.options.skipGreeting || i("agent-aura");
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
			};
			return;
		}
		this.bounds = f(t, e, this.options.padding);
	}
	seedParticles(e) {
		this.fireData = [];
		for (let t = 0; t < this.options.particleCount; t++) this.writeFire(t, S(this.options.preset, this.bounds, e));
		if (this.smokeData = [], this.smoke) for (let t = 0; t < this.options.smokeCount; t++) this.writeSmoke(t, C(this.bounds, e));
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
				this.writeFire(n, S(r, this.bounds, !1));
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
			r === "burning" ? (o = a < .1 ? a / .1 : 1 - (a - .1) / .9, o = Math.max(o, 0) ** 1.2, i.spark ? (this.fire.alphas[n] = o * 1.28, this.fire.sizes[n] = i.baseSize * (1 - a * .55)) : (this.fire.alphas[n] = o * .88, this.fire.sizes[n] = i.baseSize * (.65 + a * 1.55))) : (o = Math.max(o, 0) ** 1.25, i.spark ? (this.fire.alphas[n] = o * 1.2, this.fire.sizes[n] = i.baseSize * (1 - a * .55)) : (this.fire.alphas[n] = o * .76, this.fire.sizes[n] = i.baseSize * (.58 + a * 1.35))), w(this.fire.colors, n, a, i.spark, r);
		}
		if (this.smoke) {
			for (let n = 0; n < this.options.smokeCount; n++) {
				let r = this.smokeData[n];
				if (r.life -= t, r.life <= 0) {
					this.writeSmoke(n, C(this.bounds, !1));
					continue;
				}
				let i = 1 - r.life / r.maxLife, a = Math.sin(e * 1.8 + r.seed + i * 4);
				r.x += (r.vx + a * 12) * t, r.y += r.vy * t, this.smoke.positions[n * 3] = r.x, this.smoke.positions[n * 3 + 1] = r.y, this.smoke.sizes[n] = r.baseSize * (.65 + i * 1.85), this.smoke.alphas[n] = (1 - i) ** 1.4 * .16;
				let o = u(.16, .34, i);
				this.smoke.colors[n * 3] = o, this.smoke.colors[n * 3 + 1] = o * .92, this.smoke.colors[n * 3 + 2] = o * .9;
			}
			this.smoke.upload();
		}
		this.fire.upload(), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), n.enable(n.BLEND), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), this.glow?.draw(e), this.smoke?.draw(), n.blendFunc(n.SRC_ALPHA, n.ONE), this.fire.draw(), this.options.onFrame?.(e);
	}
}, O = class r {
	element;
	engine;
	static attach(i, a = {}) {
		let o = e(i), { container: s, ...c } = a, l = t(s);
		l && n(l);
		let u = new r({
			...c,
			target: o,
			container: l
		});
		return (l ?? document.body).appendChild(u.element), u.start(), u;
	}
	constructor(e = {}) {
		this.engine = new D({
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
}, k = class r {
	element;
	engine;
	static attach(i, a = {}) {
		let o = e(i), { container: s, ...c } = a, l = t(s);
		l && n(l);
		let u = new r({
			...c,
			target: o,
			container: l
		});
		return (l ?? document.body).appendChild(u.element), u.start(), u;
	}
	constructor(e = {}) {
		this.engine = new D({
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
//#region src/gl/geometry.ts
function A(e, t, n, r) {
	let i = Math.max(1, Math.min(e, t)), a = Math.min(Math.min(n, 20) + r, i), o = Math.min(a, Math.floor(e / 2)), s = Math.min(a, Math.floor(t / 2)), c = (t) => t / e * 2 - 1, l = (e) => e / t * 2 - 1, u = e, d = t, f = o, p = e - o, m = s, h = t - s, g = c(0), _ = c(u), v = l(0), y = l(d), b = c(f), x = c(p), S = l(m), C = l(h), w = o / e, T = 1 - o / e, E = s / t, D = 1 - s / t;
	return {
		positions: new Float32Array([
			g,
			v,
			_,
			v,
			g,
			S,
			g,
			S,
			_,
			v,
			_,
			S,
			g,
			C,
			_,
			C,
			g,
			y,
			g,
			y,
			_,
			C,
			_,
			y,
			g,
			S,
			b,
			S,
			g,
			C,
			g,
			C,
			b,
			S,
			b,
			C,
			x,
			S,
			_,
			S,
			x,
			C,
			x,
			C,
			_,
			S,
			_,
			C
		]),
		uvs: new Float32Array([
			0,
			0,
			1,
			0,
			0,
			E,
			0,
			E,
			1,
			0,
			1,
			E,
			0,
			D,
			1,
			D,
			0,
			1,
			0,
			1,
			1,
			D,
			1,
			1,
			0,
			E,
			w,
			E,
			0,
			D,
			0,
			D,
			w,
			E,
			w,
			D,
			T,
			E,
			1,
			E,
			T,
			D,
			T,
			D,
			1,
			E,
			1,
			D
		])
	};
}
//#endregion
//#region src/gl/shaders/fragment.glsl
var j = "#version 300 es\nprecision lowp float;\nin vec2 vUV;\nout vec4 outColor;\nuniform vec2 uResolution;\nuniform float uTime;\nuniform float uBorderWidth;\nuniform float uGlowWidth;\nuniform float uBorderRadius;\nuniform vec3 uColors[4];\nuniform float uGlowExponent;\nuniform float uGlowFactor;\nconst float PI = 3.14159265359;\nconst float TWO_PI = 2.0 * PI;\nconst float HALF_PI = 0.5 * PI;\nconst vec4 startPositions = vec4(0.0, PI, HALF_PI, 1.5 * PI);\nconst vec4 speeds = vec4(-1.9, -1.9, -1.5, 2.1);\nconst vec4 innerRadius = vec4(PI * 0.8, PI * 0.7, PI * 0.3, PI * 0.1);\nconst vec4 outerRadius = vec4(PI * 1.2, PI * 0.9, PI * 0.6, PI * 0.4);\nfloat random(vec2 st) {\nreturn fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\n}\nvec2 random2(vec2 st) {\nreturn vec2(random(st), random(st + 1.0));\n}\nfloat aaStep(float edge, float d) {\nfloat width = fwidth(d);\nreturn smoothstep(edge - width * 0.5, edge + width * 0.5, d);\n}\nfloat aaFract(float x) {\nfloat f = fract(x);\nfloat w = fwidth(x);\nfloat smooth_f = f * (1.0 - smoothstep(1.0 - w, 1.0, f));\nreturn smooth_f;\n}\nfloat sdRoundedBox(in vec2 p, in vec2 b, in float r) {\nvec2 q = abs(p) - b + r;\nreturn min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;\n}\nfloat getInnerGlow(vec2 p, vec2 b, float radius) {\nfloat dist_x = b.x - abs(p.x);\nfloat dist_y = b.y - abs(p.y);\nfloat glow_x = smoothstep(radius, 0.0, dist_x);\nfloat glow_y = smoothstep(radius, 0.0, dist_y);\nreturn 1.0 - (1.0 - glow_x) * (1.0 - glow_y);\n}\nfloat getVignette(vec2 uv) {\nvec2 vignetteUv = uv;\nvignetteUv = vignetteUv * (1.0 - vignetteUv);\nfloat vignette = vignetteUv.x * vignetteUv.y * 25.0;\nvignette = pow(vignette, 0.16);\nvignette = 1.0 - vignette;\nreturn vignette;\n}\nfloat uvToAngle(vec2 uv) {\nvec2 center = vec2(0.5);\nvec2 dir = uv - center;\nreturn atan(dir.y, dir.x) + PI;\n}\nvoid main() {\nvec2 uv = vUV;\nvec2 pos = uv * uResolution;\nvec2 centeredPos = pos - uResolution * 0.5;\nvec2 size = uResolution - uBorderWidth;\nvec2 halfSize = size * 0.5;\nfloat dBorderBox = sdRoundedBox(centeredPos, halfSize, uBorderRadius);\nfloat border = aaStep(0.0, dBorderBox);\nfloat glow = getInnerGlow(centeredPos, halfSize, uGlowWidth);\nfloat vignette = getVignette(uv);\nglow *= vignette;\nfloat posAngle = uvToAngle(uv);\nvec4 lightCenter = mod(startPositions + speeds * uTime, TWO_PI);\nvec4 angleDist = abs(posAngle - lightCenter);\nvec4 disToLight = min(angleDist, TWO_PI - angleDist) / TWO_PI;\nfloat intensityBorder[4];\nintensityBorder[0] = 1.0;\nintensityBorder[1] = smoothstep(0.4, 0.0, disToLight.y);\nintensityBorder[2] = smoothstep(0.4, 0.0, disToLight.z);\nintensityBorder[3] = smoothstep(0.2, 0.0, disToLight.w) * 0.5;\nvec3 borderColor = vec3(0.0);\nfor(int i = 0; i < 4; i++) {\nborderColor = mix(borderColor, uColors[i], intensityBorder[i]);\n}\nborderColor *= 1.1;\nborderColor = clamp(borderColor, 0.0, 1.0);\nfloat intensityGlow[4];\nintensityGlow[0] = smoothstep(0.9, 0.0, disToLight.x);\nintensityGlow[1] = smoothstep(0.7, 0.0, disToLight.y);\nintensityGlow[2] = smoothstep(0.4, 0.0, disToLight.z);\nintensityGlow[3] = smoothstep(0.1, 0.0, disToLight.w) * 0.7;\nvec4 breath = smoothstep(0.0, 1.0, sin(uTime * 1.0 + startPositions * PI) * 0.2 + 0.8);\nvec3 glowColor = vec3(0.0);\nglowColor += uColors[0] * intensityGlow[0] * breath.x;\nglowColor += uColors[1] * intensityGlow[1] * breath.y;\nglowColor += uColors[2] * intensityGlow[2] * breath.z;\nglowColor += uColors[3] * intensityGlow[3] * breath.w * glow;\nglow = pow(glow, uGlowExponent);\nglow *= random(pos + uTime) * 0.1 + 1.0;\nglowColor *= glow * uGlowFactor;\nglowColor = clamp(glowColor, 0.0, 1.0);\nvec3 color = mix(glowColor, borderColor + glowColor * 0.2, border);\nfloat alpha = mix(glow, 1.0, border);\noutColor = vec4(color, alpha);\n}", M = "#version 300 es\nin vec2 aPosition;\nin vec2 aUV;\nout vec2 vUV;\nvoid main() {\nvUV = aUV;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", N = [
	"rgb(57, 182, 255)",
	"rgb(189, 69, 251)",
	"rgb(255, 87, 51)",
	"rgb(255, 214, 0)"
];
function P(e) {
	let t = e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (!t) throw Error(`Invalid color format: ${e}`);
	let [, n, r, i] = t;
	return [
		parseInt(n) / 255,
		parseInt(r) / 255,
		parseInt(i) / 255
	];
}
var F = class t {
	element;
	canvas;
	options;
	running = !1;
	disposed = !1;
	startTime = 0;
	lastTime = 0;
	rafId = null;
	glr;
	observer;
	static attach(r, i = {}) {
		let a = e(r);
		n(a);
		let o = new t({
			...i,
			styles: {
				position: "absolute",
				inset: "0",
				width: "100%",
				height: "100%",
				...i.styles
			}
		});
		return a.appendChild(o.element), o.autoResize(a), o.start(), o;
	}
	constructor(e = {}) {
		this.options = {
			width: e.width ?? 600,
			height: e.height ?? 600,
			ratio: e.ratio ?? window.devicePixelRatio ?? 1,
			borderWidth: e.borderWidth ?? 8,
			glowWidth: e.glowWidth ?? 200,
			borderRadius: e.borderRadius ?? 8,
			mode: e.mode ?? "light",
			...e
		}, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.canvas.style.display = "block", this.canvas.style.transformOrigin = "center", this.canvas.style.pointerEvents = "none", this.element = this.canvas, this.setupGL(), this.options.skipGreeting || this.greet();
	}
	start() {
		if (this.disposed) throw Error("Glow instance has been disposed.");
		if (this.running) return;
		if (!this.glr) {
			console.error("WebGL resources are not initialized.");
			return;
		}
		this.running = !0, this.startTime = performance.now(), this.resize(this.options.width ?? 600, this.options.height ?? 600, this.options.ratio), this.glr.gl.viewport(0, 0, this.canvas.width, this.canvas.height), this.glr.gl.useProgram(this.glr.program), this.glr.gl.uniform2f(this.glr.uResolution, this.canvas.width, this.canvas.height), this.checkGLError(this.glr.gl, "start: after initial setup");
		let e = () => {
			if (!this.running || !this.glr) return;
			this.rafId = requestAnimationFrame(e);
			let t = performance.now();
			if (t - this.lastTime < 1e3 / 32) return;
			this.lastTime = t;
			let n = (t - this.startTime) * .001;
			this.render(n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("Glow instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId);
		let { gl: e, vao: t, positionBuffer: n, uvBuffer: r, program: i } = this.glr;
		t && e.deleteVertexArray(t), n && e.deleteBuffer(n), r && e.deleteBuffer(r), e.deleteProgram(i), this.observer && this.observer.disconnect(), this.canvas.remove();
	}
	resize(e, t, n) {
		if (this.disposed) throw Error("Glow instance has been disposed.");
		if (this.options.width = e, this.options.height = t, n && (this.options.ratio = n), !this.running) return;
		let { gl: r, program: i, vao: a, positionBuffer: o, uvBuffer: s, uResolution: c } = this.glr, l = n ?? this.options.ratio ?? window.devicePixelRatio ?? 1, u = Math.max(1, Math.floor(e * l)), d = Math.max(1, Math.floor(t * l));
		this.canvas.style.width = `${e}px`, this.canvas.style.height = `${t}px`, (this.canvas.width !== u || this.canvas.height !== d) && (this.canvas.width = u, this.canvas.height = d), r.viewport(0, 0, this.canvas.width, this.canvas.height), this.checkGLError(r, "resize: after viewport setup");
		let { positions: f, uvs: p } = A(this.canvas.width, this.canvas.height, this.options.borderWidth * l, this.options.glowWidth * l);
		r.bindVertexArray(a), r.bindBuffer(r.ARRAY_BUFFER, o), r.bufferData(r.ARRAY_BUFFER, f, r.STATIC_DRAW);
		let m = r.getAttribLocation(i, "aPosition");
		r.enableVertexAttribArray(m), r.vertexAttribPointer(m, 2, r.FLOAT, !1, 0, 0), this.checkGLError(r, "resize: after position buffer update"), r.bindBuffer(r.ARRAY_BUFFER, s), r.bufferData(r.ARRAY_BUFFER, p, r.STATIC_DRAW);
		let h = r.getAttribLocation(i, "aUV");
		r.enableVertexAttribArray(h), r.vertexAttribPointer(h, 2, r.FLOAT, !1, 0, 0), this.checkGLError(r, "resize: after UV buffer update"), r.useProgram(i), r.uniform2f(c, this.canvas.width, this.canvas.height), r.uniform1f(this.glr.uBorderWidth, this.options.borderWidth * l), r.uniform1f(this.glr.uGlowWidth, this.options.glowWidth * l), r.uniform1f(this.glr.uBorderRadius, this.options.borderRadius * l), this.checkGLError(r, "resize: after uniform updates");
		let g = performance.now();
		this.lastTime = g;
		let _ = (g - this.startTime) * .001;
		this.render(_);
	}
	autoResize(e) {
		this.observer && this.observer.disconnect(), this.observer = new ResizeObserver(() => {
			let t = e.getBoundingClientRect();
			this.resize(t.width, t.height);
		}), this.observer.observe(e);
	}
	fadeIn() {
		if (this.disposed) throw Error("Glow instance has been disposed.");
		return new Promise((e, t) => {
			let n = this.canvas.animate([{
				opacity: 0,
				transform: "scale(1.2)"
			}, {
				opacity: 1,
				transform: "scale(1)"
			}], {
				duration: 300,
				easing: "ease-out",
				fill: "forwards"
			});
			n.onfinish = () => e(), n.oncancel = () => t("canceled");
		});
	}
	fadeOut() {
		if (this.disposed) throw Error("Glow instance has been disposed.");
		return new Promise((e, t) => {
			let n = this.canvas.animate([{
				opacity: 1,
				transform: "scale(1)"
			}, {
				opacity: 0,
				transform: "scale(1.2)"
			}], {
				duration: 300,
				easing: "ease-in",
				fill: "forwards"
			});
			n.onfinish = () => e(), n.oncancel = () => t("canceled");
		});
	}
	checkGLError(e, t) {
		let n = e.getError();
		if (n !== e.NO_ERROR) {
			for (console.group(`🔴 WebGL Error in ${t}`); n !== e.NO_ERROR;) {
				let t = this.getGLErrorName(e, n);
				console.error(`${t} (0x${n.toString(16)})`), n = e.getError();
			}
			console.groupEnd();
		}
	}
	getGLErrorName(e, t) {
		switch (t) {
			case e.INVALID_ENUM: return "INVALID_ENUM";
			case e.INVALID_VALUE: return "INVALID_VALUE";
			case e.INVALID_OPERATION: return "INVALID_OPERATION";
			case e.INVALID_FRAMEBUFFER_OPERATION: return "INVALID_FRAMEBUFFER_OPERATION";
			case e.OUT_OF_MEMORY: return "OUT_OF_MEMORY";
			case e.CONTEXT_LOST_WEBGL: return "CONTEXT_LOST_WEBGL";
			default: return "UNKNOWN_ERROR";
		}
	}
	setupGL() {
		let e = this.canvas.getContext("webgl2", {
			antialias: !1,
			alpha: !0
		});
		if (!e) throw Error("WebGL2 is required but not available.");
		let t = o(e, M, j);
		this.checkGLError(e, "setupGL: after createProgram");
		let n = e.createVertexArray();
		e.bindVertexArray(n), this.checkGLError(e, "setupGL: after VAO creation");
		let { positions: r, uvs: i } = A(this.canvas.width || 2, this.canvas.height || 2, this.options.borderWidth, this.options.glowWidth), a = e.createBuffer();
		e.bindBuffer(e.ARRAY_BUFFER, a), e.bufferData(e.ARRAY_BUFFER, r, e.STATIC_DRAW);
		let s = e.getAttribLocation(t, "aPosition");
		e.enableVertexAttribArray(s), e.vertexAttribPointer(s, 2, e.FLOAT, !1, 0, 0), this.checkGLError(e, "setupGL: after position buffer setup");
		let c = e.createBuffer();
		e.bindBuffer(e.ARRAY_BUFFER, c), e.bufferData(e.ARRAY_BUFFER, i, e.STATIC_DRAW);
		let l = e.getAttribLocation(t, "aUV");
		e.enableVertexAttribArray(l), e.vertexAttribPointer(l, 2, e.FLOAT, !1, 0, 0), this.checkGLError(e, "setupGL: after UV buffer setup");
		let u = e.getUniformLocation(t, "uResolution"), d = e.getUniformLocation(t, "uTime"), f = e.getUniformLocation(t, "uBorderWidth"), p = e.getUniformLocation(t, "uGlowWidth"), m = e.getUniformLocation(t, "uBorderRadius"), h = e.getUniformLocation(t, "uColors"), g = e.getUniformLocation(t, "uGlowExponent"), _ = e.getUniformLocation(t, "uGlowFactor");
		e.useProgram(t), e.uniform1f(f, this.options.borderWidth), e.uniform1f(p, this.options.glowWidth), e.uniform1f(m, this.options.borderRadius), this.options.mode === "dark" ? (e.uniform1f(g, 2), e.uniform1f(_, 1.8)) : (e.uniform1f(g, 1), e.uniform1f(_, 1));
		let v = (this.options.colors || N).map(P);
		for (let n = 0; n < v.length; n++) e.uniform3f(e.getUniformLocation(t, `uColors[${n}]`), ...v[n]);
		this.checkGLError(e, "setupGL: after uniform setup"), e.bindVertexArray(null), e.bindBuffer(e.ARRAY_BUFFER, null), this.glr = {
			gl: e,
			program: t,
			vao: n,
			positionBuffer: a,
			uvBuffer: c,
			uResolution: u,
			uTime: d,
			uBorderWidth: f,
			uGlowWidth: p,
			uBorderRadius: m,
			uColors: h
		};
	}
	render(e) {
		if (!this.glr) return;
		let { gl: t, program: n, vao: r, uTime: i } = this.glr;
		t.useProgram(n), t.bindVertexArray(r), t.uniform1f(i, e), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.BLEND), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.drawArrays(t.TRIANGLES, 0, 24), this.checkGLError(t, "render: after draw call"), t.bindVertexArray(null);
	}
	greet() {
		i("agent-aura");
	}
}, I = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform float uTime;\nuniform vec2 uResolution;\nuniform vec2 uCardSize;\nuniform float uBorderWidth;\nuniform float uGlowWidth;\nuniform float uRadius;\n#define PI 3.14159265359\n#define TAU 6.28318530718\nfloat sdRoundBox(vec2 p, vec2 halfSize, float radius) {\nvec2 q = abs(p) - halfSize + radius;\nreturn min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;\n}\nfloat angularDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, TAU - d);\n}\nfloat movingLight(float angle, float center, float width) {\nfloat d = angularDistance(angle, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nfloat hash(vec2 p) {\nreturn fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\n}\nvoid main() {\nvec2 pixel = vUv * uResolution;\nvec2 p = pixel - uResolution * 0.5;\nvec2 halfCard = uCardSize * 0.5;\nfloat d = sdRoundBox(p, halfCard, uRadius);\nfloat dist = abs(d);\nfloat aa = max(fwidth(d), 0.8);\nfloat border = 1.0 - smoothstep(uBorderWidth, uBorderWidth + aa, dist);\nfloat glow = exp(-pow(dist / uGlowWidth, 1.45) * 3.1);\nif (d > 0.0) {\nglow *= 0.78;\n}\nif (d < -uGlowWidth * 1.55) {\nglow *= 1.0 - smoothstep(uGlowWidth * 1.55, uGlowWidth * 2.3, -d);\n}\nfloat angle = mod(atan(p.y, p.x) + TAU, TAU);\nfloat time = uTime;\nfloat l1 = movingLight(angle, mod(0.20 - time * 0.52, TAU), 2.4);\nfloat l2 = movingLight(angle, mod(2.70 - time * 0.43, TAU), 1.8);\nfloat l3 = movingLight(angle, mod(4.30 + time * 0.38, TAU), 1.25);\nfloat l4 = movingLight(angle, mod(5.40 + time * 0.61, TAU), 0.72);\nvec3 cyan = vec3(0.20, 0.72, 1.0);\nvec3 purple = vec3(0.72, 0.25, 1.0);\nvec3 orange = vec3(1.0, 0.24, 0.10);\nvec3 yellow = vec3(1.0, 0.78, 0.10);\nvec3 glowColor = cyan * l1 + purple * l2 * 0.92 + orange * l3 * 0.78 + yellow * l4 * 0.72;\nglowColor *= 0.82 + sin(time * 1.35) * 0.10;\nvec3 borderColor = cyan * 0.42 + glowColor * 0.78;\nfloat whiteLight = movingLight(angle, mod(time * 1.05, TAU), 0.18);\nvec3 whiteEnergy = vec3(0.82, 0.96, 1.0) * whiteLight;\nborderColor += whiteEnergy * 1.6;\nglowColor += whiteEnergy * 0.55;\nfloat noise = hash(floor(pixel * 0.45) + floor(time * 14.0));\nglowColor *= 0.94 + noise * 0.06;\nvec3 finalColor = glowColor * glow * 0.72;\nfinalColor = mix(finalColor, borderColor + glowColor * 0.32, border);\nfloat alpha = glow * 0.48 + border * 0.92;\nalpha += whiteLight * glow * 0.24;\nfloat farFade = 1.0 - smoothstep(uGlowWidth * 1.05, uGlowWidth * 1.75, dist);\nalpha *= farFade;\nalpha = clamp(alpha, 0.0, 1.0);\nfinalColor = clamp(finalColor, 0.0, 1.25);\noutColor = vec4(finalColor, alpha);\n}", L = "#version 300 es\nin vec2 aPosition;\nout vec2 vUv;\nvoid main() {\nvUv = aPosition * 0.5 + 0.5;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", R = new Float32Array([
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
]), z = class r {
	element;
	canvas;
	gl;
	program;
	vao;
	buffer;
	uTime;
	uResolution;
	uCardSize;
	uBorderWidth;
	uGlowWidth;
	uRadius;
	options;
	target;
	container;
	running = !1;
	disposed = !1;
	rafId = null;
	startTime = 0;
	observer;
	onResize = () => {
		this.layout();
	};
	onScroll = () => {
		this.layout();
	};
	static attach(i, a = {}) {
		let o = e(i), { container: s, ...c } = a, l = t(s) ?? (o.parentElement && o.parentElement !== document.body ? o.parentElement : void 0);
		l && n(l);
		let u = new r({
			...c,
			target: o,
			container: l
		});
		return (l ?? document.body).appendChild(u.element), u.start(), u;
	}
	constructor(e = {}) {
		this.options = {
			glowPadding: e.glowPadding ?? 110,
			borderWidth: e.borderWidth ?? 2.2,
			glowWidth: e.glowWidth ?? 115,
			borderRadius: e.borderRadius ?? 28,
			speed: e.speed ?? 1,
			zIndex: e.zIndex ?? 10,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles
		}, this.target = e.target, this.container = e.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.canvas.style.transform = "translateZ(0)", this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let t = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !1,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!t) throw Error("WebGL2 is required but not available.");
		this.gl = t, this.program = o(t, L, I);
		let n = t.createVertexArray(), r = t.createBuffer();
		if (!n || !r) throw Error("Failed to create motion border geometry");
		this.vao = n, this.buffer = r, t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, R, t.STATIC_DRAW);
		let a = t.getAttribLocation(this.program, "aPosition");
		t.enableVertexAttribArray(a), t.vertexAttribPointer(a, 2, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), this.uTime = t.getUniformLocation(this.program, "uTime"), this.uResolution = t.getUniformLocation(this.program, "uResolution"), this.uCardSize = t.getUniformLocation(this.program, "uCardSize"), this.uBorderWidth = t.getUniformLocation(this.program, "uBorderWidth"), this.uGlowWidth = t.getUniformLocation(this.program, "uGlowWidth"), this.uRadius = t.getUniformLocation(this.program, "uRadius"), this.options.skipGreeting || i("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.layout();
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.layout();
	}
	start() {
		if (this.disposed) throw Error("MotionBorder instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.observe(), this.layout(), this.render(0);
		let e = (t) => {
			this.running && (this.rafId = requestAnimationFrame(e), this.render((t - this.startTime) * .001 * this.options.speed));
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("MotionBorder instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		this.disposed || (this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect(), this.gl.deleteBuffer(this.buffer), this.gl.deleteVertexArray(this.vao), this.gl.deleteProgram(this.program), this.canvas.remove());
	}
	applyCanvasLayout() {
		this.canvas.style.position = this.container ? "absolute" : "fixed";
	}
	observe() {
		this.disconnect(), window.addEventListener("resize", this.onResize), window.addEventListener("scroll", this.onScroll, !0), this.observer = new ResizeObserver(() => this.layout()), this.target && this.observer.observe(this.target), this.container && this.observer.observe(this.container);
	}
	disconnect() {
		window.removeEventListener("resize", this.onResize), window.removeEventListener("scroll", this.onScroll, !0), this.observer?.disconnect(), this.observer = void 0;
	}
	layout() {
		if (this.disposed) return;
		let e = this.options.glowPadding, t = this.target ?? this.container;
		if (!t) return;
		let n = t.getBoundingClientRect(), r = Math.max(1, Math.round(n.width + e * 2)), i = Math.max(1, Math.round(n.height + e * 2));
		if (this.container) {
			let t = this.container.getBoundingClientRect();
			this.canvas.style.left = `${n.left - t.left - e}px`, this.canvas.style.top = `${n.top - t.top - e}px`;
		} else this.canvas.style.left = `${n.left - e}px`, this.canvas.style.top = `${n.top - e}px`;
		this.canvas.style.width = `${r}px`, this.canvas.style.height = `${i}px`;
		let a = Math.min(window.devicePixelRatio || 1, 2), o = Math.max(1, Math.floor(r * a)), s = Math.max(1, Math.floor(i * a));
		(this.canvas.width !== o || this.canvas.height !== s) && (this.canvas.width = o, this.canvas.height = s);
		let c = this.gl;
		c.viewport(0, 0, o, s), c.useProgram(this.program), c.uniform2f(this.uResolution, o, s), c.uniform2f(this.uCardSize, n.width * a, n.height * a), c.uniform1f(this.uBorderWidth, this.options.borderWidth * a), c.uniform1f(this.uGlowWidth, this.options.glowWidth * a), c.uniform1f(this.uRadius, this.options.borderRadius * a), c.clearColor(0, 0, 0, 0), c.clear(c.COLOR_BUFFER_BIT);
	}
	render(e) {
		let t = this.gl;
		t.useProgram(this.program), t.uniform1f(this.uTime, e), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.enable(t.BLEND), t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.bindVertexArray(this.vao), t.drawArrays(t.TRIANGLES, 0, 6), t.bindVertexArray(null);
	}
}, B = {
	fire(e, t) {
		return k.attach(e, t);
	},
	burning(e, t) {
		return O.attach(e, t);
	},
	border(e, t) {
		return z.attach(e, t);
	},
	glow(e, t) {
		return F.attach(e, t);
	}
};
//#endregion
export { O as BurningFire, k as FireBorder, F as Glow, z as MotionBorder, B as aura, B as default };
