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
}, _ = "#version 300 es\nprecision mediump float;\nin vec3 vColor;\nin float vAlpha;\nout vec4 outColor;\nuniform float uCoreBoost;\nuniform float uOuterStart;\nuniform float uOuterEnd;\nvec3 linearToSrgb(vec3 c) {\nvec3 higher = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;\nvec3 lower = c * 12.92;\nbvec3 cutoff = lessThan(c, vec3(0.0031308));\nreturn vec3(\ncutoff.x ? lower.x : higher.x,\ncutoff.y ? lower.y : higher.y,\ncutoff.z ? lower.z : higher.z\n);\n}\nvoid main() {\nvec2 uv = gl_PointCoord - vec2(0.5);\nuv.x *= 1.35;\nuv.y *= 0.82;\nfloat dist = length(uv);\nfloat outer = 1.0 - smoothstep(uOuterStart, uOuterEnd, dist);\nfloat core = 1.0 - smoothstep(0.0, 0.18, dist);\nvec3 color = vColor + core * vec3(0.45, 0.22, 0.05) * uCoreBoost;\nfloat alpha = outer * vAlpha;\nif (alpha < 0.01) discard;\nvec3 srgb = linearToSrgb(color);\noutColor = vec4(srgb * alpha, alpha);\n}", v = "#version 300 es\nprecision mediump float;\nin vec2 vUv;\nuniform float uTime;\nout vec4 outColor;\nvoid main() {\nvec2 center = vec2(0.5, 0.48);\nfloat dist = distance(vUv, center);\nfloat pulse = 0.5 + 0.5 * sin(uTime * 2.2);\nfloat redAura = smoothstep(0.78, 0.1, dist) * 0.22;\nfloat coreAura = smoothstep(0.42, 0.0, dist) * (0.1 + pulse * 0.08);\nvec3 color = vec3(\nredAura + coreAura,\nredAura * 0.22 + coreAura * 0.18,\nredAura * 0.06\n);\nfloat alpha = max(color.r, max(color.g, color.b));\nif (alpha < 0.004) discard;\noutColor = vec4(color * alpha, alpha);\n}", y = "#version 300 es\nin vec2 aPosition;\nout vec2 vUv;\nvoid main() {\nvUv = aPosition * 0.5 + 0.5;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", b = "#version 300 es\nin vec3 aPosition;\nin vec3 aColor;\nin float aSize;\nin float aAlpha;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nout vec3 vColor;\nout float vAlpha;\nvoid main() {\nvColor = aColor;\nvAlpha = aAlpha;\nvec2 clip = (aPosition.xy / uResolution) * 2.0 - 1.0;\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = max(aSize * uPixelRatio, 1.0);\n}", x = "#version 300 es\nprecision mediump float;\nin vec3 vColor;\nin float vAlpha;\nout vec4 outColor;\nvoid main() {\nvec2 uv = gl_PointCoord - vec2(0.5);\nfloat dist = length(uv);\nfloat alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;\nif (alpha < 0.01) discard;\noutColor = vec4(vColor * alpha, alpha);\n}";
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
	return r ? (i.vx = n.normalX * l(20, 80) + l(-35, 35), i.vy = l(55, 160), i.maxLife = l(.7, 1.5), i.baseSize = l(2, 6)) : (i.vx = n.normalX * l(8, 38) + l(-16, 16), i.vy = l(25, 105), n.side === "top" && (i.vy += l(25, 90)), i.maxLife = l(.35, 1.05), i.baseSize = l(13, 32)), (n.side === "left" || n.side === "right") && (i.vy *= l(.7, 1.15)), i.life = t ? Math.random() * i.maxLife : i.maxLife, i;
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
	return r ? (i.vx = n.normalX * l(40, 120) + l(-55, 55), i.vy = l(90, 220), i.baseSize = l(3, 7), i.maxLife = l(.45, 1.2)) : (i.vx = n.normalX * l(14, 46) + l(-26, 26), i.vy = l(70, 180), i.baseSize = l(14, 38), i.maxLife = l(.35, 1.15), n.side === "top" && (i.vy += l(40, 110), i.baseSize += l(4, 14)), (n.side === "left" || n.side === "right") && (i.vx += n.normalX * l(8, 28)), Math.random() < .12 && (i.baseSize *= 1.45, i.vy *= 1.18)), i.life = t ? Math.random() * i.maxLife : i.maxLife, i;
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
			antialias: !0,
			premultipliedAlpha: !0,
			powerPreference: "high-performance"
		});
		if (!n) throw Error("WebGL2 is required but not available.");
		this.gl = n, this.fire = new g(n, this.options.particleCount, b, _), t === "burning" ? this.fire.setStyle(1.15, .18, .56) : this.fire.setStyle(1.05, .12, .52), this.smoke = this.options.smokeCount > 0 ? new g(n, this.options.smokeCount, b, x) : null, this.glow = this.options.glow ? new c(n, y, v) : null, this.options.skipGreeting || i("agent-aura");
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
			r === "burning" ? (o = a < .1 ? a / .1 : 1 - (a - .1) / .9, o = Math.max(o, 0) ** 1.2, i.spark ? (this.fire.alphas[n] = o * 1.32, this.fire.sizes[n] = i.baseSize * (1 - a * .55)) : (this.fire.alphas[n] = o * 1, this.fire.sizes[n] = i.baseSize * (.65 + a * 1.55))) : (o = Math.max(o, 0) ** 1.25, i.spark ? (this.fire.alphas[n] = o * 1.22, this.fire.sizes[n] = i.baseSize * (1 - a * .55)) : (this.fire.alphas[n] = o * .86, this.fire.sizes[n] = i.baseSize * (.58 + a * 1.4))), w(this.fire.colors, n, a, i.spark, r);
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
		this.fire.upload(), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), n.enable(n.BLEND), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.blendFuncSeparate(n.ONE, n.ONE_MINUS_SRC_ALPHA, n.ONE, n.ONE_MINUS_SRC_ALPHA), this.glow?.draw(e), this.smoke?.draw(), n.blendFuncSeparate(n.ONE, n.ONE, n.ONE, n.ONE), this.fire.draw(), this.options.onFrame?.(e);
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
};
//#endregion
//#region src/thunder/path.ts
function k(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function ee(e, t, n) {
	let r = getComputedStyle(e), i = parseFloat(r.borderTopLeftRadius);
	return r.borderRadius.includes("%") ? Math.min(t, n) / 2 : k(i || 0, 0, Math.min(t, n) / 2);
}
function te(e, t, n, r, i) {
	if (!e || !e.startsWith("polygon(")) return null;
	let a = e.replace("polygon(", "").replace(")", "").split(","), o = [];
	for (let e of a) {
		let a = e.trim().split(/\s+/);
		if (a.length < 2) continue;
		let s = a[0].includes("%") ? t + parseFloat(a[0]) / 100 * r : t + parseFloat(a[0]), c = a[1].includes("%") ? n + parseFloat(a[1]) / 100 * i : n + parseFloat(a[1]);
		o.push({
			x: s,
			y: c
		});
	}
	return o.length > 2 ? o : null;
}
function ne(e, t) {
	let n = 0, r = 0;
	for (let t of e) n += t.x, r += t.y;
	return n /= e.length, r /= e.length, e.map((e) => {
		let i = e.x - n, a = e.y - r, o = Math.hypot(i, a) || 1;
		return {
			x: e.x + i / o * t,
			y: e.y + a / o * t
		};
	});
}
function re(e, t, n, r, i, a, o) {
	let s = e - a, c = e + n + a, l = t - a, u = t + r + a, d = k(i + a, 0, Math.min(n, r) / 2 + a), f = [], p = (e, t, n, r) => {
		for (let i = 0; i <= o; i++) {
			let a = n + (r - n) * (i / o);
			f.push({
				x: e + Math.cos(a) * d,
				y: t + Math.sin(a) * d
			});
		}
	};
	return p(s + d, l + d, Math.PI, Math.PI * 1.5), p(c - d, l + d, Math.PI * 1.5, Math.PI * 2), p(c - d, u - d, 0, Math.PI * .5), p(s + d, u - d, Math.PI * .5, Math.PI), f;
}
function A(e, t, n, r, i) {
	let a = e.getBoundingClientRect(), o = a.left - t, s = a.top - n, c = te(getComputedStyle(e).clipPath, o, s, a.width, a.height);
	if (c) return ne(c, r);
	let l = ee(e, a.width, a.height);
	return re(o, s, a.width, a.height, l, r, i);
}
function j(e) {
	let t = [], n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = e[(r + 1) % e.length], o = Math.hypot(a.x - i.x, a.y - i.y);
		t.push(o), n += o;
	}
	return {
		path: e,
		lengths: t,
		total: n
	};
}
function M(e, t) {
	let { path: n, lengths: r, total: i } = e;
	if (n.length === 0 || i <= 0) return {
		point: {
			x: 0,
			y: 0
		},
		tangent: {
			x: 1,
			y: 0
		},
		normal: {
			x: 0,
			y: 1
		}
	};
	let a = (t % 1 + 1) % 1 * i;
	for (let e = 0; e < r.length; e++) {
		if (a <= r[e]) {
			let t = n[e], i = n[(e + 1) % n.length], o = r[e] > 0 ? a / r[e] : 0, s = {
				x: t.x + (i.x - t.x) * o,
				y: t.y + (i.y - t.y) * o
			}, c = i.x - t.x, l = i.y - t.y, u = Math.hypot(c, l) || 1, d = {
				x: c / u,
				y: l / u
			};
			return {
				point: s,
				tangent: d,
				normal: {
					x: -d.y,
					y: d.x
				}
			};
		}
		a -= r[e];
	}
	return {
		point: { ...n[0] },
		tangent: {
			x: 1,
			y: 0
		},
		normal: {
			x: 0,
			y: 1
		}
	};
}
function ie(e, t) {
	let n = Math.cos(t), r = Math.sin(t);
	return {
		x: e.x * n - e.y * r,
		y: e.x * r + e.y * n
	};
}
function N(e, t) {
	return e + Math.random() * (t - e);
}
//#endregion
//#region src/shape-field/shaders/line.frag.glsl
var ae = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nuniform float uMode;\nuniform vec3 uColor1;\nuniform vec3 uColor2;\nuniform vec3 uColor3;\nuniform vec3 uColor4;\nvarying float vProgress;\nfloat distanceLoop(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat lightBand(float p, float center, float width) {\nfloat d = distanceLoop(p, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat time = uTime;\nfloat e1 = lightBand(vProgress, fract(time * 0.052), 0.24);\nfloat e2 = lightBand(vProgress, fract(0.30 - time * 0.039), 0.16);\nfloat e3 = lightBand(vProgress, fract(0.67 + time * 0.028), 0.09);\nfloat e4 = lightBand(vProgress, fract(0.88 - time * 0.075), 0.035);\nfloat wave = sin(vProgress * 40.0 - time * 2.5);\nfloat shimmer = 0.88 + wave * 0.12;\nvec3 color = uColor1 * 0.22;\ncolor += uColor2 * e1 * 0.72;\ncolor += uColor3 * e2 * 0.68;\ncolor += uColor2 * e3 * 0.44;\ncolor += uColor4 * e4 * 1.35;\nif (uMode < 0.5) {\ncolor *= 0.90 + sin(vProgress * 22.0 + time * 3.0) * 0.08;\n}\nif (uMode > 1.5) {\ncolor *= 0.82 + abs(sin(vProgress * 17.0 - time * 4.5)) * 0.23;\n}\ncolor *= shimmer;\nfloat alpha = 0.23 + e1 * 0.28 + e2 * 0.24 + e3 * 0.18 + e4 * 0.72;\ngl_FragColor = vec4(color, alpha * uOpacity);\n}", oe = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nvarying float vProgress;\nvoid main() {\nvProgress = aProgress;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", se = "precision highp float;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvec2 uv = gl_PointCoord - 0.5;\nfloat d = length(uv);\nfloat soft = 1.0 - smoothstep(0.02, 0.5, d);\nfloat core = 1.0 - smoothstep(0.0, 0.13, d);\nvec3 color = vColor + vec3(core * 0.18);\ngl_FragColor = vec4(color, soft * vAlpha);\n}", ce = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nattribute vec3 aColor;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvAlpha = aAlpha;\nvColor = aColor;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}";
//#endregion
//#region src/shape-field/themes.ts
function P(e) {
	return [
		(e >> 16 & 255) / 255,
		(e >> 8 & 255) / 255,
		(e & 255) / 255
	];
}
var le = {
	water: {
		lineColors: [
			P(4643327),
			P(1476863),
			P(10483967),
			P(16777215)
		],
		fieldA: P(949708),
		fieldB: P(7924479),
		detailA: P(5761279),
		detailB: P(15073279),
		fieldSize: [22, 58],
		detailSize: [2, 6],
		fieldAlpha: [.025, .1],
		detailAlpha: [.28, .85],
		fieldOffset: [5, 34],
		fieldDrift: 18,
		pathSpeed: [.008, .03],
		detailSpeed: [.02, .07],
		rise: 12,
		waveSpeed: 2.2,
		turbulence: 7,
		modeId: 0
	},
	immortal: {
		lineColors: [
			P(14125592),
			P(16763989),
			P(16773040),
			P(16777215)
		],
		fieldA: P(11098124),
		fieldB: P(16766573),
		detailA: P(16758062),
		detailB: P(16774606),
		fieldSize: [30, 82],
		detailSize: [2, 7],
		fieldAlpha: [.018, .095],
		detailAlpha: [.3, .95],
		fieldOffset: [10, 52],
		fieldDrift: 26,
		pathSpeed: [.004, .019],
		detailSpeed: [.014, .055],
		rise: 30,
		waveSpeed: 1.25,
		turbulence: 12,
		modeId: 1
	},
	demonic: {
		lineColors: [
			P(5966760),
			P(10497279),
			P(15496447),
			P(16509439)
		],
		fieldA: P(2490415),
		fieldB: P(10492110),
		detailA: P(8065752),
		detailB: P(16740572),
		fieldSize: [34, 94],
		detailSize: [2, 8],
		fieldAlpha: [.022, .13],
		detailAlpha: [.28, .95],
		fieldOffset: [8, 58],
		fieldDrift: 34,
		pathSpeed: [.004, .024],
		detailSpeed: [.016, .07],
		rise: 38,
		waveSpeed: 1.8,
		turbulence: 18,
		modeId: 2
	}
};
function F(e, t, n) {
	let r = Math.max(0, Math.min(1, n));
	return [
		e[0] + (t[0] - e[0]) * r,
		e[1] + (t[1] - e[1]) * r,
		e[2] + (t[2] - e[2]) * r
	];
}
//#endregion
//#region src/shape-field/ShapeFieldAura.ts
var ue = [
	{
		offset: 0,
		opacity: 1
	},
	{
		offset: 7,
		opacity: .22
	},
	{
		offset: -4,
		opacity: .13
	}
], I = class r {
	element;
	mode;
	canvas;
	gl;
	lineProgram;
	pointProgram;
	fieldVao;
	fieldPos;
	fieldSize;
	fieldAlpha;
	fieldColor;
	detailVao;
	detailPos;
	detailSize;
	detailAlpha;
	detailColor;
	uLineRes;
	uLineTime;
	uLineOpacity;
	uLineMode;
	uLineColor1;
	uLineColor2;
	uLineColor3;
	uLineColor4;
	uPointRes;
	uPointDpr;
	layers = [];
	fieldData = [];
	detailData = [];
	pathData = {
		path: [],
		lengths: [],
		total: 0
	};
	options;
	target;
	container;
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
		this.rebuild();
	};
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
		this.mode = e.mode ?? "water", this.options = {
			offset: Math.max(0, e.offset ?? 7),
			cornerSegments: Math.max(4, Math.round(e.cornerSegments ?? 20)),
			pathSamples: Math.max(32, Math.round(e.pathSamples ?? 420)),
			fieldCount: Math.max(0, Math.round(e.fieldCount ?? 180)),
			detailCount: Math.max(0, Math.round(e.detailCount ?? 110)),
			speed: Math.max(.1, e.speed ?? 1),
			zIndex: e.zIndex ?? 20,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles
		}, this.target = e.target, this.container = e.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let t = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!t) throw Error("WebGL2 is required but not available.");
		this.gl = t, this.lineProgram = o(t, oe, ae), this.pointProgram = o(t, ce, se);
		for (let e of ue) {
			let n = t.createVertexArray(), r = t.createBuffer(), i = t.createBuffer();
			if (!n || !r || !i) throw Error("Failed to create shape-field line geometry");
			t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r);
			let a = t.getAttribLocation(this.lineProgram, "aPosition");
			t.enableVertexAttribArray(a), t.vertexAttribPointer(a, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, i);
			let o = t.getAttribLocation(this.lineProgram, "aProgress");
			t.enableVertexAttribArray(o), t.vertexAttribPointer(o, 1, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), this.layers.push({
				offset: e.offset,
				baseOpacity: e.opacity,
				vao: n,
				pos: r,
				prog: i,
				count: 0
			});
		}
		let n = t.createVertexArray(), r = t.createBuffer(), a = t.createBuffer(), s = t.createBuffer(), c = t.createBuffer(), l = t.createVertexArray(), u = t.createBuffer(), d = t.createBuffer(), f = t.createBuffer(), p = t.createBuffer();
		if (!n || !r || !a || !s || !c || !l || !u || !d || !f || !p) throw Error("Failed to create shape-field particle geometry");
		this.fieldVao = n, this.fieldPos = r, this.fieldSize = a, this.fieldAlpha = s, this.fieldColor = c, this.detailVao = l, this.detailPos = u, this.detailSize = d, this.detailAlpha = f, this.detailColor = p, this.bindPointVao(this.fieldVao, this.fieldPos, this.fieldSize, this.fieldAlpha, this.fieldColor), this.bindPointVao(this.detailVao, this.detailPos, this.detailSize, this.detailAlpha, this.detailColor), this.uLineRes = t.getUniformLocation(this.lineProgram, "uResolution"), this.uLineTime = t.getUniformLocation(this.lineProgram, "uTime"), this.uLineOpacity = t.getUniformLocation(this.lineProgram, "uOpacity"), this.uLineMode = t.getUniformLocation(this.lineProgram, "uMode"), this.uLineColor1 = t.getUniformLocation(this.lineProgram, "uColor1"), this.uLineColor2 = t.getUniformLocation(this.lineProgram, "uColor2"), this.uLineColor3 = t.getUniformLocation(this.lineProgram, "uColor3"), this.uLineColor4 = t.getUniformLocation(this.lineProgram, "uColor4"), this.uPointRes = t.getUniformLocation(this.pointProgram, "uResolution"), this.uPointDpr = t.getUniformLocation(this.pointProgram, "uPixelRatio"), this.seedField(), this.seedDetail(), this.options.skipGreeting || i("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.rebuild();
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.resizeToView();
	}
	start() {
		if (this.disposed) throw Error("ShapeFieldAura instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.observe(), this.resizeToView();
		let e = (t) => {
			if (!this.running) return;
			this.rafId = requestAnimationFrame(e);
			let n = Math.min((t - this.lastTime) / 1e3, .033);
			this.lastTime = t, this.render((t - this.startTime) * .001, n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("ShapeFieldAura instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect();
		let e = this.gl;
		for (let t of this.layers) e.deleteBuffer(t.pos), e.deleteBuffer(t.prog), e.deleteVertexArray(t.vao);
		e.deleteBuffer(this.fieldPos), e.deleteBuffer(this.fieldSize), e.deleteBuffer(this.fieldAlpha), e.deleteBuffer(this.fieldColor), e.deleteBuffer(this.detailPos), e.deleteBuffer(this.detailSize), e.deleteBuffer(this.detailAlpha), e.deleteBuffer(this.detailColor), e.deleteVertexArray(this.fieldVao), e.deleteVertexArray(this.detailVao), e.deleteProgram(this.lineProgram), e.deleteProgram(this.pointProgram), this.canvas.remove();
	}
	theme() {
		return le[this.mode];
	}
	bindPointVao(e, t, n, r, i) {
		let a = this.gl;
		a.bindVertexArray(e), a.bindBuffer(a.ARRAY_BUFFER, t);
		let o = a.getAttribLocation(this.pointProgram, "aPosition");
		a.enableVertexAttribArray(o), a.vertexAttribPointer(o, 2, a.FLOAT, !1, 0, 0), a.bindBuffer(a.ARRAY_BUFFER, n);
		let s = a.getAttribLocation(this.pointProgram, "aSize");
		a.enableVertexAttribArray(s), a.vertexAttribPointer(s, 1, a.FLOAT, !1, 0, 0), a.bindBuffer(a.ARRAY_BUFFER, r);
		let c = a.getAttribLocation(this.pointProgram, "aAlpha");
		a.enableVertexAttribArray(c), a.vertexAttribPointer(c, 1, a.FLOAT, !1, 0, 0), a.bindBuffer(a.ARRAY_BUFFER, i);
		let l = a.getAttribLocation(this.pointProgram, "aColor");
		a.enableVertexAttribArray(l), a.vertexAttribPointer(l, 3, a.FLOAT, !1, 0, 0), a.bindVertexArray(null);
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
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n), this.gl.viewport(0, 0, t, n), this.rebuild();
	}
	seedField() {
		let e = this.theme();
		this.fieldData = [];
		for (let t = 0; t < this.options.fieldCount; t++) this.fieldData.push({
			t: Math.random(),
			speed: N(e.pathSpeed[0], e.pathSpeed[1]),
			offset: N(e.fieldOffset[0], e.fieldOffset[1]),
			size: N(e.fieldSize[0], e.fieldSize[1]),
			alpha: N(e.fieldAlpha[0], e.fieldAlpha[1]),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2,
			phase3: Math.random() * Math.PI * 2
		});
	}
	seedDetail() {
		let e = this.theme();
		this.detailData = [];
		for (let t = 0; t < this.options.detailCount; t++) this.detailData.push({
			t: Math.random(),
			speed: N(e.detailSpeed[0], e.detailSpeed[1]),
			offset: N(1, 17),
			size: N(e.detailSize[0], e.detailSize[1]),
			alpha: N(e.detailAlpha[0], e.detailAlpha[1]),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2
		});
	}
	rebuild() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = A(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = j(t), this.uploadLines();
	}
	uploadLines() {
		if (this.pathData.total <= 0) return;
		let e = this.gl, t = this.options.pathSamples;
		for (let n of this.layers) {
			let r = new Float32Array(t * 2), i = new Float32Array(t);
			for (let e = 0; e < t; e++) {
				let a = e / t, o = M(this.pathData, a);
				r[e * 2] = o.point.x + o.normal.x * n.offset, r[e * 2 + 1] = o.point.y + o.normal.y * n.offset, i[e] = a;
			}
			e.bindBuffer(e.ARRAY_BUFFER, n.pos), e.bufferData(e.ARRAY_BUFFER, r, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, n.prog), e.bufferData(e.ARRAY_BUFFER, i, e.DYNAMIC_DRAW), n.count = t;
		}
	}
	render(e, t) {
		if (this.disposed || !this.target) return;
		let n = this.gl, r = this.viewBox(), i = this.theme(), a = e * this.options.speed;
		if (n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE), n.disable(n.DEPTH_TEST), this.pathData.total > 0) {
			n.useProgram(this.lineProgram), n.uniform2f(this.uLineRes, r.width, r.height), n.uniform1f(this.uLineTime, a), n.uniform1f(this.uLineMode, i.modeId), n.uniform3f(this.uLineColor1, i.lineColors[0][0], i.lineColors[0][1], i.lineColors[0][2]), n.uniform3f(this.uLineColor2, i.lineColors[1][0], i.lineColors[1][1], i.lineColors[1][2]), n.uniform3f(this.uLineColor3, i.lineColors[2][0], i.lineColors[2][1], i.lineColors[2][2]), n.uniform3f(this.uLineColor4, i.lineColors[3][0], i.lineColors[3][1], i.lineColors[3][2]);
			let e = .85 + Math.sin(a * 1.3) * .1;
			for (let t of this.layers) t.count < 2 || (n.uniform1f(this.uLineOpacity, t.baseOpacity * e), n.bindVertexArray(t.vao), n.drawArrays(n.LINE_LOOP, 0, t.count));
			n.bindVertexArray(null);
		}
		this.updateField(a, t), this.updateDetail(a, t);
	}
	updateField(e, t) {
		if (this.fieldData.length === 0 || this.pathData.total <= 0) return;
		let n = this.theme(), r = this.fieldData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), s = new Float32Array(r * 3);
		for (let c = 0; c < r; c++) {
			let r = this.fieldData[c];
			r.t += t * r.speed * this.options.speed;
			let l = M(this.pathData, r.t), u = Math.sin(e * n.waveSpeed + r.phase), d = Math.sin(e * (n.waveSpeed * .57) + r.phase2), f = Math.cos(e * (n.waveSpeed * 1.37) + r.phase3), p = r.offset + u * n.fieldDrift + f * n.turbulence, m = d * n.turbulence, h = l.point.x + l.normal.x * p + l.tangent.x * m, g = l.point.y + l.normal.y * p + l.tangent.y * m;
			this.mode === "water" ? g -= Math.sin(r.t * 40 - e * 3) * 4 : this.mode === "immortal" ? g -= (d * .5 + .5) * n.rise : (h += Math.sin(e * 2.8 + r.phase) * 8, g -= Math.cos(e * 2.2 + r.phase3) * 12), i[c * 2] = h, i[c * 2 + 1] = g, a[c] = r.size * (.72 + (d * .5 + .5) * .46), o[c] = r.alpha * (.55 + (u * .5 + .5) * .45);
			let _ = f * .5 + .5, v = F(n.fieldA, n.fieldB, _);
			s[c * 3] = v[0], s[c * 3 + 1] = v[1], s[c * 3 + 2] = v[2];
		}
		this.drawPoints(this.fieldVao, this.fieldPos, this.fieldSize, this.fieldAlpha, this.fieldColor, i, a, o, s, r);
	}
	updateDetail(e, t) {
		if (this.detailData.length === 0 || this.pathData.total <= 0) return;
		let n = this.theme(), r = this.detailData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), s = new Float32Array(r * 3);
		for (let c = 0; c < r; c++) {
			let r = this.detailData[c];
			r.t += t * r.speed * this.options.speed;
			let l = M(this.pathData, r.t), u = Math.sin(e * 4 + r.phase), d = Math.sin(e * 1.8 + r.phase2), f = r.offset + u * 4, p = l.point.x + l.normal.x * f, m = l.point.y + l.normal.y * f;
			this.mode === "water" ? (m -= d * 7, p += Math.sin(e * 3 + r.phase2) * 3) : this.mode === "immortal" ? m -= (d * .5 + .5) * n.rise : (m -= (d * .5 + .5) * n.rise, p += Math.sin(e * 5 + r.phase) * 8), i[c * 2] = p, i[c * 2 + 1] = m, a[c] = r.size * (.65 + Math.abs(u) * .9), o[c] = r.alpha * (.4 + Math.abs(u) * .6);
			let h = F(n.detailA, n.detailB, Math.abs(u));
			s[c * 3] = h[0], s[c * 3 + 1] = h[1], s[c * 3 + 2] = h[2];
		}
		this.drawPoints(this.detailVao, this.detailPos, this.detailSize, this.detailAlpha, this.detailColor, i, a, o, s, r);
	}
	drawPoints(e, t, n, r, i, a, o, s, c, l) {
		let u = this.gl, d = this.viewBox();
		u.useProgram(this.pointProgram), u.uniform2f(this.uPointRes, d.width, d.height), u.uniform1f(this.uPointDpr, this.pixelRatio), u.bindVertexArray(e), u.bindBuffer(u.ARRAY_BUFFER, t), u.bufferData(u.ARRAY_BUFFER, a, u.DYNAMIC_DRAW), u.bindBuffer(u.ARRAY_BUFFER, n), u.bufferData(u.ARRAY_BUFFER, o, u.DYNAMIC_DRAW), u.bindBuffer(u.ARRAY_BUFFER, r), u.bufferData(u.ARRAY_BUFFER, s, u.DYNAMIC_DRAW), u.bindBuffer(u.ARRAY_BUFFER, i), u.bufferData(u.ARRAY_BUFFER, c, u.DYNAMIC_DRAW), u.drawArrays(u.POINTS, 0, l), u.bindVertexArray(null);
	}
};
//#endregion
//#region src/CultivationAura.ts
function L(e) {
	let { mistCount: t, spiritCount: n, auraSamples: r, fieldCount: i, detailCount: a, pathSamples: o, ...s } = e;
	return {
		...s,
		fieldCount: i ?? t,
		detailCount: a ?? n,
		pathSamples: o ?? r
	};
}
var R = class extends I {
	static attach(e, t = {}) {
		let { container: n, ...r } = t;
		return I.attach(e, {
			...L(r),
			container: n,
			mode: "immortal"
		});
	}
	constructor(e = {}) {
		super({
			...L(e),
			mode: "immortal"
		});
	}
}, z = class extends I {
	static attach(e, t = {}) {
		return I.attach(e, {
			...t,
			mode: "demonic"
		});
	}
	constructor(e = {}) {
		super({
			...e,
			mode: "demonic"
		});
	}
}, B = class r {
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
}, de = "precision highp float;\nuniform float uTime;\nuniform float uBurst;\nuniform vec3 uColor;\nuniform float uIntensity;\nvarying float vProgress;\nvarying float vSide;\nfloat hash(float n) {\nreturn fract(sin(n) * 43758.5453123);\n}\nfloat segmentNoise(float progress, float time) {\nfloat index = floor(progress * 44.0);\nfloat frame = floor(time * 13.0);\nreturn hash(index * 17.17 + frame * 31.91);\n}\nvoid main() {\nfloat t = uTime;\nfloat d = abs(vSide);\nfloat core = exp(-pow(d * 8.0, 2.0));\nfloat halo = exp(-pow(d * 2.1, 1.4));\nfloat noise = segmentNoise(vProgress, t);\nfloat broken = step(0.18, noise);\nfloat flash = step(0.88, hash(floor(t * 24.0) + floor(vProgress * 21.0)));\nfloat scan = step(0.86, sin(vProgress * 150.0 - t * 18.0));\nfloat corruption = broken * (0.75 + noise * 0.35);\ncorruption += uBurst * (flash * 1.2 + scan * 0.65);\nvec3 color = uColor + vec3(1.0) * flash * (0.6 + uBurst);\nfloat alpha = (core * 0.82 + halo * 0.20) * corruption * uIntensity;\nif (noise < 0.13) alpha = 0.0;\ngl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));\n}", fe = "precision highp float;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat edge = max(abs(p.x), abs(p.y));\nfloat alpha = 1.0 - smoothstep(0.35, 0.5, edge);\ngl_FragColor = vec4(vColor, alpha * vAlpha);\n}", pe = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nattribute vec3 aColor;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvAlpha = aAlpha;\nvColor = aColor;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", me = "precision highp float;\nuniform vec2 uResolution;\nuniform vec2 uOffset;\nattribute vec2 aPosition;\nattribute float aProgress;\nattribute float aSide;\nvarying float vProgress;\nvarying float vSide;\nvoid main() {\nvProgress = aProgress;\nvSide = aSide;\nvec2 pos = aPosition + uOffset;\nvec2 clip = vec2(\n(pos.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (pos.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", he = [
	0,
	.9647,
	1
], ge = [
	1,
	.0902,
	.3098
], V = [
	.9686,
	.9725,
	1
], _e = [
	.3373,
	.1451,
	1
], ve = [
	0,
	.9647,
	1
], ye = [
	1,
	.0784,
	.3569
], H = class r {
	element;
	canvas;
	gl;
	ribbonProgram;
	pointProgram;
	layers = [];
	fragmentVao;
	fragmentPos;
	fragmentSize;
	fragmentAlpha;
	fragmentColor;
	uRibbonRes;
	uRibbonOffset;
	uRibbonTime;
	uRibbonBurst;
	uRibbonColor;
	uRibbonIntensity;
	uPointRes;
	uPointDpr;
	fragmentData = [];
	pathData = {
		path: [],
		lengths: [],
		total: 0
	};
	center = {
		x: 0,
		y: 0
	};
	burst = 0;
	burstTimer = 0;
	options;
	target;
	container;
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
		this.rebuild();
	};
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
		this.options = {
			offset: Math.max(0, e.offset ?? 5),
			outerWidth: Math.max(1, e.outerWidth ?? 45),
			rgbWidth: Math.max(1, e.rgbWidth ?? 11),
			pathSamples: Math.max(32, Math.round(e.pathSamples ?? 500)),
			cornerSegments: Math.max(4, Math.round(e.cornerSegments ?? 22)),
			fragmentCount: Math.max(0, Math.round(e.fragmentCount ?? 130)),
			burstIntervalMin: Math.max(80, e.burstIntervalMin ?? 900),
			burstIntervalMax: Math.max(80, e.burstIntervalMax ?? 2600),
			burstDuration: Math.max(40, e.burstDuration ?? 140),
			speed: Math.max(.1, e.speed ?? 1),
			zIndex: e.zIndex ?? 20,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles
		}, this.options.burstIntervalMax < this.options.burstIntervalMin && (this.options.burstIntervalMax = this.options.burstIntervalMin), this.target = e.target, this.container = e.container, this.burstTimer = N(this.options.burstIntervalMin, this.options.burstIntervalMax), this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let t = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!t) throw Error("WebGL2 is required but not available.");
		this.gl = t, this.ribbonProgram = o(t, me, de), this.pointProgram = o(t, pe, fe), this.layers.push(this.createRibbonLayer({
			halfWidth: this.options.outerWidth,
			shift: 0,
			color: _e,
			intensity: .22
		}), this.createRibbonLayer({
			halfWidth: this.options.rgbWidth,
			shift: -4.5,
			color: ve,
			intensity: .72
		}), this.createRibbonLayer({
			halfWidth: this.options.rgbWidth,
			shift: 4.5,
			color: ye,
			intensity: .72
		}), this.createRibbonLayer({
			halfWidth: this.options.rgbWidth,
			shift: 0,
			color: V,
			intensity: .86
		}));
		let n = t.createVertexArray(), r = t.createBuffer(), a = t.createBuffer(), s = t.createBuffer(), c = t.createBuffer();
		if (!n || !r || !a || !s || !c) throw Error("Failed to create glitch-aura fragment geometry");
		this.fragmentVao = n, this.fragmentPos = r, this.fragmentSize = a, this.fragmentAlpha = s, this.fragmentColor = c, t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r);
		let l = t.getAttribLocation(this.pointProgram, "aPosition");
		t.enableVertexAttribArray(l), t.vertexAttribPointer(l, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, a);
		let u = t.getAttribLocation(this.pointProgram, "aSize");
		t.enableVertexAttribArray(u), t.vertexAttribPointer(u, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, s);
		let d = t.getAttribLocation(this.pointProgram, "aAlpha");
		t.enableVertexAttribArray(d), t.vertexAttribPointer(d, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, c);
		let f = t.getAttribLocation(this.pointProgram, "aColor");
		t.enableVertexAttribArray(f), t.vertexAttribPointer(f, 3, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), this.uRibbonRes = t.getUniformLocation(this.ribbonProgram, "uResolution"), this.uRibbonOffset = t.getUniformLocation(this.ribbonProgram, "uOffset"), this.uRibbonTime = t.getUniformLocation(this.ribbonProgram, "uTime"), this.uRibbonBurst = t.getUniformLocation(this.ribbonProgram, "uBurst"), this.uRibbonColor = t.getUniformLocation(this.ribbonProgram, "uColor"), this.uRibbonIntensity = t.getUniformLocation(this.ribbonProgram, "uIntensity"), this.uPointRes = t.getUniformLocation(this.pointProgram, "uResolution"), this.uPointDpr = t.getUniformLocation(this.pointProgram, "uPixelRatio"), this.seedFragments(), this.options.skipGreeting || i("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.rebuild();
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.resizeToView();
	}
	start() {
		if (this.disposed) throw Error("GlitchAura instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.observe(), this.resizeToView();
		let e = (t) => {
			if (!this.running) return;
			this.rafId = requestAnimationFrame(e);
			let n = Math.min((t - this.lastTime) / 1e3, .033);
			this.lastTime = t, this.render((t - this.startTime) * .001, n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("GlitchAura instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect();
		let e = this.gl;
		for (let t of this.layers) e.deleteBuffer(t.pos), e.deleteBuffer(t.prog), e.deleteBuffer(t.side), e.deleteBuffer(t.idx), e.deleteVertexArray(t.vao);
		e.deleteBuffer(this.fragmentPos), e.deleteBuffer(this.fragmentSize), e.deleteBuffer(this.fragmentAlpha), e.deleteBuffer(this.fragmentColor), e.deleteVertexArray(this.fragmentVao), e.deleteProgram(this.ribbonProgram), e.deleteProgram(this.pointProgram), this.canvas.remove();
	}
	createRibbonLayer(e) {
		let t = this.gl, n = t.createVertexArray(), r = t.createBuffer(), i = t.createBuffer(), a = t.createBuffer(), o = t.createBuffer();
		if (!n || !r || !i || !a || !o) throw Error("Failed to create glitch-aura ribbon geometry");
		t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r);
		let s = t.getAttribLocation(this.ribbonProgram, "aPosition");
		t.enableVertexAttribArray(s), t.vertexAttribPointer(s, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, i);
		let c = t.getAttribLocation(this.ribbonProgram, "aProgress");
		t.enableVertexAttribArray(c), t.vertexAttribPointer(c, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, a);
		let l = t.getAttribLocation(this.ribbonProgram, "aSide");
		return t.enableVertexAttribArray(l), t.vertexAttribPointer(l, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, o), t.bindVertexArray(null), {
			...e,
			offsetX: 0,
			offsetY: 0,
			vao: n,
			pos: r,
			prog: i,
			side: a,
			idx: o,
			indexCount: 0
		};
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
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n), this.gl.viewport(0, 0, t, n), this.rebuild();
	}
	seedFragments() {
		this.fragmentData = [];
		for (let e = 0; e < this.options.fragmentCount; e++) this.fragmentData.push({
			t: Math.random(),
			speed: N(.005, .055),
			offset: N(-8, 28),
			size: N(2, 9),
			alpha: N(.12, .8),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2,
			channel: Math.floor(Math.random() * 3)
		});
	}
	rebuild() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = A(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = j(t), this.center = this.pathCenter(t), this.uploadRibbons();
	}
	pathCenter(e) {
		if (e.length === 0) return {
			x: 0,
			y: 0
		};
		let t = 0, n = 0;
		for (let r of e) t += r.x, n += r.y;
		return {
			x: t / e.length,
			y: n / e.length
		};
	}
	sample(e) {
		let t = M(this.pathData, e), n = t.point.x - this.center.x, r = t.point.y - this.center.y;
		return t.normal.x * n + t.normal.y * r < 0 ? {
			point: t.point,
			tangent: t.tangent,
			normal: {
				x: -t.normal.x,
				y: -t.normal.y
			}
		} : t;
	}
	uploadRibbons() {
		if (this.pathData.total <= 0) return;
		let e = this.gl, t = this.options.pathSamples, n = (t + 1) * 2, r = new Uint16Array(t * 6);
		for (let e = 0; e < t; e++) {
			let t = e * 2, n = t + 1, i = t + 2, a = t + 3, o = e * 6;
			r[o] = t, r[o + 1] = n, r[o + 2] = i, r[o + 3] = n, r[o + 4] = a, r[o + 5] = i;
		}
		for (let i of this.layers) {
			let a = new Float32Array(n * 2), o = new Float32Array(n), s = new Float32Array(n);
			for (let e = 0; e <= t; e++) {
				let n = e / t, r = this.sample(n), c = r.point.x + r.normal.x * i.shift, l = r.point.y + r.normal.y * i.shift, u = c - r.normal.x * i.halfWidth, d = l - r.normal.y * i.halfWidth, f = c + r.normal.x * i.halfWidth, p = l + r.normal.y * i.halfWidth, m = e * 2;
				a[m * 2] = u, a[m * 2 + 1] = d, a[(m + 1) * 2] = f, a[(m + 1) * 2 + 1] = p, o[m] = n, o[m + 1] = n, s[m] = -1, s[m + 1] = 1;
			}
			e.bindBuffer(e.ARRAY_BUFFER, i.pos), e.bufferData(e.ARRAY_BUFFER, a, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.prog), e.bufferData(e.ARRAY_BUFFER, o, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.side), e.bufferData(e.ARRAY_BUFFER, s, e.DYNAMIC_DRAW), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, i.idx), e.bufferData(e.ELEMENT_ARRAY_BUFFER, r, e.STATIC_DRAW), i.indexCount = r.length;
		}
		e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
	}
	updateBurst(e) {
		this.burstTimer -= e * 1e3 * this.options.speed, this.burstTimer <= 0 && (this.burst = 1, this.burstTimer = N(this.options.burstIntervalMin, this.options.burstIntervalMax)), this.burst > 0 && (this.burst = Math.max(0, this.burst - e * 1e3 * this.options.speed / this.options.burstDuration));
	}
	render(e, t) {
		if (this.disposed || !this.target) return;
		let n = this.gl, r = this.viewBox(), i = e * this.options.speed;
		if (this.updateBurst(t), this.layers.length >= 4) {
			let e = this.burst * 7;
			this.layers[1].offsetX = Math.sin(i * 70) * e, this.layers[1].offsetY = 0, this.layers[2].offsetX = Math.cos(i * 63) * e, this.layers[2].offsetY = 0, this.layers[3].offsetX = 0, this.layers[3].offsetY = Math.sin(i * 91) * this.burst * 3;
		}
		n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), n.useProgram(this.ribbonProgram), n.uniform2f(this.uRibbonRes, r.width, r.height), n.uniform1f(this.uRibbonTime, i), n.uniform1f(this.uRibbonBurst, this.burst);
		for (let e of this.layers) e.indexCount !== 0 && (n.uniform2f(this.uRibbonOffset, e.offsetX, e.offsetY), n.uniform3f(this.uRibbonColor, e.color[0], e.color[1], e.color[2]), n.uniform1f(this.uRibbonIntensity, e.intensity), n.bindVertexArray(e.vao), n.drawElements(n.TRIANGLES, e.indexCount, n.UNSIGNED_SHORT, 0));
		n.bindVertexArray(null), this.updateFragments(i, t, r);
	}
	updateFragments(e, t, n) {
		if (this.fragmentData.length === 0 || this.pathData.total <= 0) return;
		let r = this.fragmentData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), s = new Float32Array(r * 3);
		for (let n = 0; n < r; n++) {
			let r = this.fragmentData[n];
			r.t += t * r.speed * this.options.speed;
			let c = this.sample(r.t), l = Math.sin(e * 17 + r.phase), u = Math.cos(e * 7.5 + r.phase2), d = this.burst * N(15, 60), f = r.offset + l * 8 + d, p = u * (5 + this.burst * 25), m = Math.abs(l) > .88 ? u * 18 : 0;
			i[n * 2] = c.point.x + c.normal.x * f + c.tangent.x * p + m, i[n * 2 + 1] = c.point.y + c.normal.y * f + c.tangent.y * p, a[n] = r.size * (.55 + Math.abs(l) * 1.2 + this.burst * 1.4);
			let h = Math.random() > .16 ? 1 : .05;
			o[n] = r.alpha * h * (.5 + this.burst * .8);
			let g = r.channel === 0 ? he : r.channel === 1 ? ge : V;
			s[n * 3] = g[0], s[n * 3 + 1] = g[1], s[n * 3 + 2] = g[2];
		}
		let c = this.gl;
		c.useProgram(this.pointProgram), c.uniform2f(this.uPointRes, n.width, n.height), c.uniform1f(this.uPointDpr, this.pixelRatio), c.bindVertexArray(this.fragmentVao), c.bindBuffer(c.ARRAY_BUFFER, this.fragmentPos), c.bufferData(c.ARRAY_BUFFER, i, c.DYNAMIC_DRAW), c.bindBuffer(c.ARRAY_BUFFER, this.fragmentSize), c.bufferData(c.ARRAY_BUFFER, a, c.DYNAMIC_DRAW), c.bindBuffer(c.ARRAY_BUFFER, this.fragmentAlpha), c.bufferData(c.ARRAY_BUFFER, o, c.DYNAMIC_DRAW), c.bindBuffer(c.ARRAY_BUFFER, this.fragmentColor), c.bufferData(c.ARRAY_BUFFER, s, c.DYNAMIC_DRAW), c.drawArrays(c.POINTS, 0, r), c.bindVertexArray(null);
	}
};
//#endregion
//#region src/gl/geometry.ts
function U(e, t, n, r) {
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
var be = "#version 300 es\nprecision lowp float;\nin vec2 vUV;\nout vec4 outColor;\nuniform vec2 uResolution;\nuniform float uTime;\nuniform float uBorderWidth;\nuniform float uGlowWidth;\nuniform float uBorderRadius;\nuniform vec3 uColors[4];\nuniform float uGlowExponent;\nuniform float uGlowFactor;\nconst float PI = 3.14159265359;\nconst float TWO_PI = 2.0 * PI;\nconst float HALF_PI = 0.5 * PI;\nconst vec4 startPositions = vec4(0.0, PI, HALF_PI, 1.5 * PI);\nconst vec4 speeds = vec4(-1.9, -1.9, -1.5, 2.1);\nconst vec4 innerRadius = vec4(PI * 0.8, PI * 0.7, PI * 0.3, PI * 0.1);\nconst vec4 outerRadius = vec4(PI * 1.2, PI * 0.9, PI * 0.6, PI * 0.4);\nfloat random(vec2 st) {\nreturn fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\n}\nvec2 random2(vec2 st) {\nreturn vec2(random(st), random(st + 1.0));\n}\nfloat aaStep(float edge, float d) {\nfloat width = fwidth(d);\nreturn smoothstep(edge - width * 0.5, edge + width * 0.5, d);\n}\nfloat aaFract(float x) {\nfloat f = fract(x);\nfloat w = fwidth(x);\nfloat smooth_f = f * (1.0 - smoothstep(1.0 - w, 1.0, f));\nreturn smooth_f;\n}\nfloat sdRoundedBox(in vec2 p, in vec2 b, in float r) {\nvec2 q = abs(p) - b + r;\nreturn min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;\n}\nfloat getInnerGlow(vec2 p, vec2 b, float radius) {\nfloat dist_x = b.x - abs(p.x);\nfloat dist_y = b.y - abs(p.y);\nfloat glow_x = smoothstep(radius, 0.0, dist_x);\nfloat glow_y = smoothstep(radius, 0.0, dist_y);\nreturn 1.0 - (1.0 - glow_x) * (1.0 - glow_y);\n}\nfloat getVignette(vec2 uv) {\nvec2 vignetteUv = uv;\nvignetteUv = vignetteUv * (1.0 - vignetteUv);\nfloat vignette = vignetteUv.x * vignetteUv.y * 25.0;\nvignette = pow(vignette, 0.16);\nvignette = 1.0 - vignette;\nreturn vignette;\n}\nfloat uvToAngle(vec2 uv) {\nvec2 center = vec2(0.5);\nvec2 dir = uv - center;\nreturn atan(dir.y, dir.x) + PI;\n}\nvoid main() {\nvec2 uv = vUV;\nvec2 pos = uv * uResolution;\nvec2 centeredPos = pos - uResolution * 0.5;\nvec2 size = uResolution - uBorderWidth;\nvec2 halfSize = size * 0.5;\nfloat dBorderBox = sdRoundedBox(centeredPos, halfSize, uBorderRadius);\nfloat border = aaStep(0.0, dBorderBox);\nfloat glow = getInnerGlow(centeredPos, halfSize, uGlowWidth);\nfloat vignette = getVignette(uv);\nglow *= vignette;\nfloat posAngle = uvToAngle(uv);\nvec4 lightCenter = mod(startPositions + speeds * uTime, TWO_PI);\nvec4 angleDist = abs(posAngle - lightCenter);\nvec4 disToLight = min(angleDist, TWO_PI - angleDist) / TWO_PI;\nfloat intensityBorder[4];\nintensityBorder[0] = 1.0;\nintensityBorder[1] = smoothstep(0.4, 0.0, disToLight.y);\nintensityBorder[2] = smoothstep(0.4, 0.0, disToLight.z);\nintensityBorder[3] = smoothstep(0.2, 0.0, disToLight.w) * 0.5;\nvec3 borderColor = vec3(0.0);\nfor(int i = 0; i < 4; i++) {\nborderColor = mix(borderColor, uColors[i], intensityBorder[i]);\n}\nborderColor *= 1.1;\nborderColor = clamp(borderColor, 0.0, 1.0);\nfloat intensityGlow[4];\nintensityGlow[0] = smoothstep(0.9, 0.0, disToLight.x);\nintensityGlow[1] = smoothstep(0.7, 0.0, disToLight.y);\nintensityGlow[2] = smoothstep(0.4, 0.0, disToLight.z);\nintensityGlow[3] = smoothstep(0.1, 0.0, disToLight.w) * 0.7;\nvec4 breath = smoothstep(0.0, 1.0, sin(uTime * 1.0 + startPositions * PI) * 0.2 + 0.8);\nvec3 glowColor = vec3(0.0);\nglowColor += uColors[0] * intensityGlow[0] * breath.x;\nglowColor += uColors[1] * intensityGlow[1] * breath.y;\nglowColor += uColors[2] * intensityGlow[2] * breath.z;\nglowColor += uColors[3] * intensityGlow[3] * breath.w * glow;\nglow = pow(glow, uGlowExponent);\nglow *= random(pos + uTime) * 0.1 + 1.0;\nglowColor *= glow * uGlowFactor;\nglowColor = clamp(glowColor, 0.0, 1.0);\nvec3 color = mix(glowColor, borderColor + glowColor * 0.2, border);\nfloat alpha = mix(glow, 1.0, border);\noutColor = vec4(color, alpha);\n}", xe = "#version 300 es\nin vec2 aPosition;\nin vec2 aUV;\nout vec2 vUV;\nvoid main() {\nvUV = aUV;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", Se = [
	"rgb(57, 182, 255)",
	"rgb(189, 69, 251)",
	"rgb(255, 87, 51)",
	"rgb(255, 214, 0)"
];
function Ce(e) {
	let t = e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (!t) throw Error(`Invalid color format: ${e}`);
	let [, n, r, i] = t;
	return [
		parseInt(n) / 255,
		parseInt(r) / 255,
		parseInt(i) / 255
	];
}
var W = class t {
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
		let { positions: f, uvs: p } = U(this.canvas.width, this.canvas.height, this.options.borderWidth * l, this.options.glowWidth * l);
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
		let t = o(e, xe, be);
		this.checkGLError(e, "setupGL: after createProgram");
		let n = e.createVertexArray();
		e.bindVertexArray(n), this.checkGLError(e, "setupGL: after VAO creation");
		let { positions: r, uvs: i } = U(this.canvas.width || 2, this.canvas.height || 2, this.options.borderWidth, this.options.glowWidth), a = e.createBuffer();
		e.bindBuffer(e.ARRAY_BUFFER, a), e.bufferData(e.ARRAY_BUFFER, r, e.STATIC_DRAW);
		let s = e.getAttribLocation(t, "aPosition");
		e.enableVertexAttribArray(s), e.vertexAttribPointer(s, 2, e.FLOAT, !1, 0, 0), this.checkGLError(e, "setupGL: after position buffer setup");
		let c = e.createBuffer();
		e.bindBuffer(e.ARRAY_BUFFER, c), e.bufferData(e.ARRAY_BUFFER, i, e.STATIC_DRAW);
		let l = e.getAttribLocation(t, "aUV");
		e.enableVertexAttribArray(l), e.vertexAttribPointer(l, 2, e.FLOAT, !1, 0, 0), this.checkGLError(e, "setupGL: after UV buffer setup");
		let u = e.getUniformLocation(t, "uResolution"), d = e.getUniformLocation(t, "uTime"), f = e.getUniformLocation(t, "uBorderWidth"), p = e.getUniformLocation(t, "uGlowWidth"), m = e.getUniformLocation(t, "uBorderRadius"), h = e.getUniformLocation(t, "uColors"), g = e.getUniformLocation(t, "uGlowExponent"), _ = e.getUniformLocation(t, "uGlowFactor");
		e.useProgram(t), e.uniform1f(f, this.options.borderWidth), e.uniform1f(p, this.options.glowWidth), e.uniform1f(m, this.options.borderRadius), this.options.mode === "dark" ? (e.uniform1f(g, 2), e.uniform1f(_, 1.8)) : (e.uniform1f(g, 1), e.uniform1f(_, 1));
		let v = (this.options.colors || Se).map(Ce);
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
}, we = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform float uTime;\nuniform vec2 uResolution;\nuniform vec2 uCardSize;\nuniform float uBorderWidth;\nuniform float uGlowWidth;\nuniform float uRadius;\n#define PI 3.14159265359\n#define TAU 6.28318530718\nfloat sdRoundBox(vec2 p, vec2 halfSize, float radius) {\nvec2 q = abs(p) - halfSize + radius;\nreturn min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;\n}\nfloat angularDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, TAU - d);\n}\nfloat movingLight(float angle, float center, float width) {\nfloat d = angularDistance(angle, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nfloat hash(vec2 p) {\nreturn fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\n}\nvoid main() {\nvec2 pixel = vUv * uResolution;\nvec2 p = pixel - uResolution * 0.5;\nvec2 halfCard = uCardSize * 0.5;\nfloat d = sdRoundBox(p, halfCard, uRadius);\nfloat dist = abs(d);\nfloat aa = max(fwidth(d), 0.8);\nfloat border = 1.0 - smoothstep(uBorderWidth, uBorderWidth + aa, dist);\nfloat glow = exp(-pow(dist / uGlowWidth, 1.45) * 3.1);\nif (d > 0.0) {\nglow *= 0.78;\n}\nif (d < -uGlowWidth * 1.55) {\nglow *= 1.0 - smoothstep(uGlowWidth * 1.55, uGlowWidth * 2.3, -d);\n}\nfloat angle = mod(atan(p.y, p.x) + TAU, TAU);\nfloat time = uTime;\nfloat l1 = movingLight(angle, mod(0.20 - time * 0.52, TAU), 2.4);\nfloat l2 = movingLight(angle, mod(2.70 - time * 0.43, TAU), 1.8);\nfloat l3 = movingLight(angle, mod(4.30 + time * 0.38, TAU), 1.25);\nfloat l4 = movingLight(angle, mod(5.40 + time * 0.61, TAU), 0.72);\nvec3 cyan = vec3(0.20, 0.72, 1.0);\nvec3 purple = vec3(0.72, 0.25, 1.0);\nvec3 orange = vec3(1.0, 0.24, 0.10);\nvec3 yellow = vec3(1.0, 0.78, 0.10);\nvec3 glowColor = cyan * l1 + purple * l2 * 0.92 + orange * l3 * 0.78 + yellow * l4 * 0.72;\nglowColor *= 0.82 + sin(time * 1.35) * 0.10;\nvec3 borderColor = cyan * 0.42 + glowColor * 0.78;\nfloat whiteLight = movingLight(angle, mod(time * 1.05, TAU), 0.18);\nvec3 whiteEnergy = vec3(0.82, 0.96, 1.0) * whiteLight;\nborderColor += whiteEnergy * 1.6;\nglowColor += whiteEnergy * 0.55;\nfloat noise = hash(floor(pixel * 0.45) + floor(time * 14.0));\nglowColor *= 0.94 + noise * 0.06;\nvec3 finalColor = glowColor * glow * 0.72;\nfinalColor = mix(finalColor, borderColor + glowColor * 0.32, border);\nfloat alpha = glow * 0.48 + border * 0.92;\nalpha += whiteLight * glow * 0.24;\nfloat farFade = 1.0 - smoothstep(uGlowWidth * 1.05, uGlowWidth * 1.75, dist);\nalpha *= farFade;\nalpha = clamp(alpha, 0.0, 1.0);\nfinalColor = clamp(finalColor, 0.0, 1.25);\noutColor = vec4(finalColor, alpha);\n}", Te = "#version 300 es\nin vec2 aPosition;\nout vec2 vUv;\nvoid main() {\nvUv = aPosition * 0.5 + 0.5;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", Ee = new Float32Array([
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
]), G = class r {
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
		this.gl = t, this.program = o(t, Te, we);
		let n = t.createVertexArray(), r = t.createBuffer();
		if (!n || !r) throw Error("Failed to create motion border geometry");
		this.vao = n, this.buffer = r, t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, Ee, t.STATIC_DRAW);
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
}, K = "precision highp float;\nvarying float vAlpha;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat d = length(p);\nfloat alpha = 1.0 - smoothstep(0.02, 0.5, d);\nvec3 color = mix(\nvec3(0.15, 0.46, 1.0),\nvec3(0.70, 0.94, 1.0),\n1.0 - d\n);\ngl_FragColor = vec4(color, alpha * vAlpha);\n}", De = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nvarying float vAlpha;\nvoid main() {\nvAlpha = aAlpha;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", Oe = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nuniform float uCoreStrength;\nuniform float uHaloStrength;\nvarying float vProgress;\nvarying float vSide;\nfloat loopDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat energyBand(float progress, float center, float width) {\nfloat d = loopDistance(progress, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat t = uTime;\nfloat b1 = energyBand(vProgress, fract(0.02 + t * 0.052), 0.24);\nfloat b2 = energyBand(vProgress, fract(0.32 - t * 0.041), 0.18);\nfloat b3 = energyBand(vProgress, fract(0.63 + t * 0.029), 0.12);\nfloat b4 = energyBand(vProgress, fract(0.82 - t * 0.067), 0.075);\nfloat scan = energyBand(vProgress, fract(t * 0.115), 0.018);\nvec3 cyan = vec3(0.16, 0.73, 1.0);\nvec3 blue = vec3(0.20, 0.38, 1.0);\nvec3 purple = vec3(0.68, 0.24, 1.0);\nvec3 pink = vec3(1.0, 0.24, 0.67);\nvec3 white = vec3(0.92, 0.99, 1.0);\nvec3 color = cyan * 0.13;\ncolor += cyan * b1 * 0.85;\ncolor += blue * b2 * 0.70;\ncolor += purple * b3 * 0.85;\ncolor += pink * b4 * 0.60;\ncolor += white * scan * 1.5;\nfloat d = abs(vSide);\nfloat core = exp(-pow(d * 8.5, 2.0));\nfloat halo = exp(-pow(d * 2.15, 1.45));\nfloat breath = 0.88 + sin(t * 1.45) * 0.10;\nfloat wave = 0.92 + sin(vProgress * 46.0 - t * 2.2) * 0.08;\ncolor *= breath * wave;\nfloat alpha = halo * 0.36 * uHaloStrength + core * 0.90 * uCoreStrength;\nalpha += scan * halo * 0.40;\ncolor += white * scan * core * 0.8;\nalpha *= uOpacity;\ngl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));\n}", ke = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nattribute float aSide;\nvarying float vProgress;\nvarying float vSide;\nvoid main() {\nvProgress = aProgress;\nvSide = aSide;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", q = class r {
	element;
	canvas;
	gl;
	ribbonProgram;
	dustProgram;
	layers = [];
	dustVao;
	dustPos;
	dustSize;
	dustAlpha;
	uRibbonRes;
	uRibbonTime;
	uRibbonOpacity;
	uRibbonCore;
	uRibbonHalo;
	uDustRes;
	uDustDpr;
	dustData = [];
	pathData = {
		path: [],
		lengths: [],
		total: 0
	};
	center = {
		x: 0,
		y: 0
	};
	options;
	target;
	container;
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
		this.rebuild();
	};
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
		this.options = {
			offset: Math.max(0, e.offset ?? 5),
			auraWidth: Math.max(1, e.auraWidth ?? 33),
			outerGlowWidth: Math.max(1, e.outerGlowWidth ?? 86),
			pathSamples: Math.max(32, Math.round(e.pathSamples ?? 500)),
			cornerSegments: Math.max(4, Math.round(e.cornerSegments ?? 24)),
			dustCount: Math.max(0, Math.round(e.dustCount ?? 75)),
			speed: Math.max(.1, e.speed ?? 1),
			zIndex: e.zIndex ?? 20,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles
		}, this.target = e.target, this.container = e.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let t = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!t) throw Error("WebGL2 is required but not available.");
		this.gl = t, this.ribbonProgram = o(t, ke, Oe), this.dustProgram = o(t, De, K);
		let n = [{
			halfWidth: this.options.outerGlowWidth,
			opacity: .22,
			coreStrength: 0,
			haloStrength: 1
		}, {
			halfWidth: this.options.auraWidth,
			opacity: 1,
			coreStrength: 1,
			haloStrength: .85
		}];
		for (let e of n) this.layers.push(this.createRibbonLayer(e));
		let r = t.createVertexArray(), a = t.createBuffer(), s = t.createBuffer(), c = t.createBuffer();
		if (!r || !a || !s || !c) throw Error("Failed to create shape-aura dust geometry");
		this.dustVao = r, this.dustPos = a, this.dustSize = s, this.dustAlpha = c, t.bindVertexArray(r), t.bindBuffer(t.ARRAY_BUFFER, a);
		let l = t.getAttribLocation(this.dustProgram, "aPosition");
		t.enableVertexAttribArray(l), t.vertexAttribPointer(l, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, s);
		let u = t.getAttribLocation(this.dustProgram, "aSize");
		t.enableVertexAttribArray(u), t.vertexAttribPointer(u, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, c);
		let d = t.getAttribLocation(this.dustProgram, "aAlpha");
		t.enableVertexAttribArray(d), t.vertexAttribPointer(d, 1, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), this.uRibbonRes = t.getUniformLocation(this.ribbonProgram, "uResolution"), this.uRibbonTime = t.getUniformLocation(this.ribbonProgram, "uTime"), this.uRibbonOpacity = t.getUniformLocation(this.ribbonProgram, "uOpacity"), this.uRibbonCore = t.getUniformLocation(this.ribbonProgram, "uCoreStrength"), this.uRibbonHalo = t.getUniformLocation(this.ribbonProgram, "uHaloStrength"), this.uDustRes = t.getUniformLocation(this.dustProgram, "uResolution"), this.uDustDpr = t.getUniformLocation(this.dustProgram, "uPixelRatio"), this.seedDust(), this.options.skipGreeting || i("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.rebuild();
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.resizeToView();
	}
	start() {
		if (this.disposed) throw Error("ShapeAura instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.observe(), this.resizeToView();
		let e = (t) => {
			if (!this.running) return;
			this.rafId = requestAnimationFrame(e);
			let n = Math.min((t - this.lastTime) / 1e3, .033);
			this.lastTime = t, this.render((t - this.startTime) * .001, n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("ShapeAura instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect();
		let e = this.gl;
		for (let t of this.layers) e.deleteBuffer(t.pos), e.deleteBuffer(t.prog), e.deleteBuffer(t.side), e.deleteBuffer(t.idx), e.deleteVertexArray(t.vao);
		e.deleteBuffer(this.dustPos), e.deleteBuffer(this.dustSize), e.deleteBuffer(this.dustAlpha), e.deleteVertexArray(this.dustVao), e.deleteProgram(this.ribbonProgram), e.deleteProgram(this.dustProgram), this.canvas.remove();
	}
	createRibbonLayer(e) {
		let t = this.gl, n = t.createVertexArray(), r = t.createBuffer(), i = t.createBuffer(), a = t.createBuffer(), o = t.createBuffer();
		if (!n || !r || !i || !a || !o) throw Error("Failed to create shape-aura ribbon geometry");
		t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r);
		let s = t.getAttribLocation(this.ribbonProgram, "aPosition");
		t.enableVertexAttribArray(s), t.vertexAttribPointer(s, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, i);
		let c = t.getAttribLocation(this.ribbonProgram, "aProgress");
		t.enableVertexAttribArray(c), t.vertexAttribPointer(c, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, a);
		let l = t.getAttribLocation(this.ribbonProgram, "aSide");
		return t.enableVertexAttribArray(l), t.vertexAttribPointer(l, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, o), t.bindVertexArray(null), {
			...e,
			vao: n,
			pos: r,
			prog: i,
			side: a,
			idx: o,
			indexCount: 0
		};
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
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n), this.gl.viewport(0, 0, t, n), this.rebuild();
	}
	seedDust() {
		this.dustData = [];
		for (let e = 0; e < this.options.dustCount; e++) this.dustData.push({
			t: Math.random(),
			speed: N(.005, .023),
			offset: N(10, 58),
			size: N(5, 17),
			alpha: N(.025, .14),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2
		});
	}
	rebuild() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = A(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = j(t), this.center = this.pathCenter(t), this.uploadRibbons();
	}
	pathCenter(e) {
		if (e.length === 0) return {
			x: 0,
			y: 0
		};
		let t = 0, n = 0;
		for (let r of e) t += r.x, n += r.y;
		return {
			x: t / e.length,
			y: n / e.length
		};
	}
	sample(e) {
		let t = M(this.pathData, e), n = t.point.x - this.center.x, r = t.point.y - this.center.y;
		return t.normal.x * n + t.normal.y * r < 0 ? {
			point: t.point,
			tangent: t.tangent,
			normal: {
				x: -t.normal.x,
				y: -t.normal.y
			}
		} : t;
	}
	uploadRibbons() {
		if (this.pathData.total <= 0) return;
		let e = this.gl, t = this.options.pathSamples, n = (t + 1) * 2, r = new Uint16Array(t * 6);
		for (let e = 0; e < t; e++) {
			let t = e * 2, n = t + 1, i = t + 2, a = t + 3, o = e * 6;
			r[o] = t, r[o + 1] = n, r[o + 2] = i, r[o + 3] = n, r[o + 4] = a, r[o + 5] = i;
		}
		for (let i of this.layers) {
			let a = new Float32Array(n * 2), o = new Float32Array(n), s = new Float32Array(n);
			for (let e = 0; e <= t; e++) {
				let n = e / t, r = this.sample(n), c = r.point.x - r.normal.x * i.halfWidth, l = r.point.y - r.normal.y * i.halfWidth, u = r.point.x + r.normal.x * i.halfWidth, d = r.point.y + r.normal.y * i.halfWidth, f = e * 2;
				a[f * 2] = c, a[f * 2 + 1] = l, a[(f + 1) * 2] = u, a[(f + 1) * 2 + 1] = d, o[f] = n, o[f + 1] = n, s[f] = -1, s[f + 1] = 1;
			}
			e.bindBuffer(e.ARRAY_BUFFER, i.pos), e.bufferData(e.ARRAY_BUFFER, a, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.prog), e.bufferData(e.ARRAY_BUFFER, o, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.side), e.bufferData(e.ARRAY_BUFFER, s, e.DYNAMIC_DRAW), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, i.idx), e.bufferData(e.ELEMENT_ARRAY_BUFFER, r, e.STATIC_DRAW), i.indexCount = r.length;
		}
		e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
	}
	render(e, t) {
		if (this.disposed || !this.target) return;
		let n = this.gl, r = this.viewBox(), i = e * this.options.speed;
		if (n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE), this.pathData.total > 0) {
			n.useProgram(this.ribbonProgram), n.uniform2f(this.uRibbonRes, r.width, r.height), n.uniform1f(this.uRibbonTime, i);
			for (let e of this.layers) e.indexCount !== 0 && (n.uniform1f(this.uRibbonOpacity, e.opacity), n.uniform1f(this.uRibbonCore, e.coreStrength), n.uniform1f(this.uRibbonHalo, e.haloStrength), n.bindVertexArray(e.vao), n.drawElements(n.TRIANGLES, e.indexCount, n.UNSIGNED_SHORT, 0));
			n.bindVertexArray(null);
		}
		this.updateDust(i, t);
	}
	updateDust(e, t) {
		if (this.dustData.length === 0 || this.pathData.total <= 0) return;
		let n = this.dustData.length, r = new Float32Array(n * 2), i = new Float32Array(n), a = new Float32Array(n);
		for (let o = 0; o < n; o++) {
			let n = this.dustData[o];
			n.t += t * n.speed * this.options.speed;
			let s = this.sample(n.t), c = Math.sin(e * 1.5 + n.phase), l = Math.cos(e * .8 + n.phase2), u = n.offset + c * 12, d = l * 10;
			r[o * 2] = s.point.x + s.normal.x * u + s.tangent.x * d, r[o * 2 + 1] = s.point.y + s.normal.y * u + s.tangent.y * d, i[o] = n.size * (.75 + (l * .5 + .5) * .45), a[o] = n.alpha * (.5 + (c * .5 + .5) * .5);
		}
		let o = this.gl, s = this.viewBox();
		o.useProgram(this.dustProgram), o.uniform2f(this.uDustRes, s.width, s.height), o.uniform1f(this.uDustDpr, this.pixelRatio), o.bindVertexArray(this.dustVao), o.bindBuffer(o.ARRAY_BUFFER, this.dustPos), o.bufferData(o.ARRAY_BUFFER, r, o.DYNAMIC_DRAW), o.bindBuffer(o.ARRAY_BUFFER, this.dustSize), o.bufferData(o.ARRAY_BUFFER, i, o.DYNAMIC_DRAW), o.bindBuffer(o.ARRAY_BUFFER, this.dustAlpha), o.bufferData(o.ARRAY_BUFFER, a, o.DYNAMIC_DRAW), o.drawArrays(o.POINTS, 0, n), o.bindVertexArray(null);
	}
}, Ae = "precision highp float;\nuniform float uTime;\nvarying float vProgress;\nfloat pulse(float x) {\nreturn pow(max(0.0, sin(x)), 8.0);\n}\nvoid main() {\nfloat p1 = pulse(vProgress * 32.0 - uTime * 8.0);\nfloat p2 = pulse(vProgress * 19.0 + uTime * 5.0 + 2.0);\nfloat energy = 0.32 + p1 * 0.8 + p2 * 0.45;\nvec3 purple = vec3(0.34, 0.18, 1.0);\nvec3 blue = vec3(0.28, 0.56, 1.0);\nvec3 white = vec3(0.94, 0.92, 1.0);\nvec3 color = mix(purple, blue, p2);\ncolor = mix(color, white, p1);\ngl_FragColor = vec4(color, energy);\n}", je = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nvarying float vProgress;\nvoid main() {\nvProgress = aProgress;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", Me = "precision highp float;\nuniform vec3 uColor;\nuniform float uOpacity;\nvoid main() {\ngl_FragColor = vec4(uColor, uOpacity);\n}", Ne = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nvoid main() {\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", Pe = "precision highp float;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat d = length(p);\nfloat alpha = 1.0 - smoothstep(0.05, 0.5, d);\nvec3 color = mix(vec3(0.40, 0.22, 1.0), vec3(0.86, 0.80, 1.0), 1.0 - d);\ngl_FragColor = vec4(color, alpha);\n}", Fe = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nvoid main() {\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", J = class r {
	element;
	canvas;
	gl;
	borderProgram;
	lineProgram;
	particleProgram;
	borderVao;
	borderPos;
	borderProg;
	lineVao;
	linePos;
	particleVao;
	particlePos;
	particleSize;
	uBorderRes;
	uBorderTime;
	uLineRes;
	uLineColor;
	uLineOpacity;
	uParticleRes;
	uParticleDpr;
	options;
	target;
	container;
	pathData = {
		path: [],
		lengths: [],
		total: 0
	};
	particles = [];
	lightnings = [];
	nextBranch = Math.random() * 200;
	borderCount = 0;
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
		this.rebuildPath();
	};
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
		this.options = {
			offset: Math.max(0, e.offset ?? 8),
			cornerSegments: Math.max(4, Math.round(e.cornerSegments ?? 12)),
			branchInterval: Math.max(20, e.branchInterval ?? 85),
			maxBranches: Math.max(1, Math.round(e.maxBranches ?? 16)),
			particleCount: Math.max(0, Math.round(e.particleCount ?? 90)),
			zIndex: e.zIndex ?? 20,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles
		}, this.target = e.target, this.container = e.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let t = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!t) throw Error("WebGL2 is required but not available.");
		this.gl = t, this.borderProgram = o(t, je, Ae), this.lineProgram = o(t, Ne, Me), this.particleProgram = o(t, Fe, Pe);
		let n = t.createVertexArray(), r = t.createBuffer(), a = t.createBuffer(), s = t.createVertexArray(), c = t.createBuffer(), l = t.createVertexArray(), u = t.createBuffer(), d = t.createBuffer();
		if (!n || !r || !a || !s || !c || !l || !u || !d) throw Error("Failed to create thunder geometry");
		this.borderVao = n, this.borderPos = r, this.borderProg = a, this.lineVao = s, this.linePos = c, this.particleVao = l, this.particlePos = u, this.particleSize = d, t.bindVertexArray(n), t.bindBuffer(t.ARRAY_BUFFER, r);
		let f = t.getAttribLocation(this.borderProgram, "aPosition");
		t.enableVertexAttribArray(f), t.vertexAttribPointer(f, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, a);
		let p = t.getAttribLocation(this.borderProgram, "aProgress");
		t.enableVertexAttribArray(p), t.vertexAttribPointer(p, 1, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), t.bindVertexArray(s), t.bindBuffer(t.ARRAY_BUFFER, c);
		let m = t.getAttribLocation(this.lineProgram, "aPosition");
		t.enableVertexAttribArray(m), t.vertexAttribPointer(m, 2, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), t.bindVertexArray(l), t.bindBuffer(t.ARRAY_BUFFER, u);
		let h = t.getAttribLocation(this.particleProgram, "aPosition");
		t.enableVertexAttribArray(h), t.vertexAttribPointer(h, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, d);
		let g = t.getAttribLocation(this.particleProgram, "aSize");
		t.enableVertexAttribArray(g), t.vertexAttribPointer(g, 1, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), this.uBorderRes = t.getUniformLocation(this.borderProgram, "uResolution"), this.uBorderTime = t.getUniformLocation(this.borderProgram, "uTime"), this.uLineRes = t.getUniformLocation(this.lineProgram, "uResolution"), this.uLineColor = t.getUniformLocation(this.lineProgram, "uColor"), this.uLineOpacity = t.getUniformLocation(this.lineProgram, "uOpacity"), this.uParticleRes = t.getUniformLocation(this.particleProgram, "uResolution"), this.uParticleDpr = t.getUniformLocation(this.particleProgram, "uPixelRatio"), this.seedParticles(), this.options.skipGreeting || i("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.rebuildPath();
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.resizeToView();
	}
	start() {
		if (this.disposed) throw Error("ThunderAura instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.observe(), this.resizeToView();
		let e = (t) => {
			if (!this.running) return;
			this.rafId = requestAnimationFrame(e);
			let n = Math.min((t - this.lastTime) / 1e3, .033);
			this.lastTime = t, this.render((t - this.startTime) * .001, n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("ThunderAura instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect();
		let e = this.gl;
		e.deleteBuffer(this.borderPos), e.deleteBuffer(this.borderProg), e.deleteBuffer(this.linePos), e.deleteBuffer(this.particlePos), e.deleteBuffer(this.particleSize), e.deleteVertexArray(this.borderVao), e.deleteVertexArray(this.lineVao), e.deleteVertexArray(this.particleVao), e.deleteProgram(this.borderProgram), e.deleteProgram(this.lineProgram), e.deleteProgram(this.particleProgram), this.canvas.remove();
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
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n), this.gl.viewport(0, 0, t, n), this.rebuildPath();
	}
	seedParticles() {
		this.particles = [];
		for (let e = 0; e < this.options.particleCount; e++) this.particles.push({
			t: Math.random(),
			speed: N(.025, .095),
			offset: N(-7, 15),
			size: N(2, 6),
			phase: Math.random() * Math.PI * 2
		});
	}
	rebuildPath() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = A(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = j(t), this.borderCount = t.length;
		let n = new Float32Array(t.length * 2), r = new Float32Array(t.length);
		for (let e = 0; e < t.length; e++) n[e * 2] = t[e].x, n[e * 2 + 1] = t[e].y, r[e] = e / t.length;
		let i = this.gl;
		i.bindBuffer(i.ARRAY_BUFFER, this.borderPos), i.bufferData(i.ARRAY_BUFFER, n, i.DYNAMIC_DRAW), i.bindBuffer(i.ARRAY_BUFFER, this.borderProg), i.bufferData(i.ARRAY_BUFFER, r, i.DYNAMIC_DRAW);
	}
	spawnLightning() {
		if (this.lightnings.length >= this.options.maxBranches || this.pathData.total <= 0) return;
		let e = M(this.pathData, Math.random()), t = this.viewBox(), n = this.target.getBoundingClientRect(), r = {
			x: n.left - t.left + n.width / 2,
			y: n.top - t.top + n.height / 2
		}, i = e.point.x - r.x, a = e.point.y - r.y, o = Math.hypot(i, a) || 1, s = {
			x: i / o,
			y: a / o
		}, c = e.normal;
		c.x * s.x + c.y * s.y < 0 && (c = {
			x: -c.x,
			y: -c.y
		}), c = ie(c, N(-.35, .35));
		let l = N(32, 100), u = Math.floor(N(7, 14)), d = new Float32Array((u + 1) * 2), f = { ...e.point };
		d[0] = f.x, d[1] = f.y;
		let p = {
			x: -c.y,
			y: c.x
		};
		for (let e = 1; e <= u; e++) f = {
			x: f.x + c.x * l / u + p.x * N(-12, 12),
			y: f.y + c.y * l / u + p.y * N(-12, 12)
		}, d[e * 2] = f.x, d[e * 2 + 1] = f.y;
		this.lightnings.push({
			positions: d,
			life: 0,
			maxLife: N(.08, .22),
			glowX: e.point.x,
			glowY: e.point.y
		});
	}
	drawLine(e, t, n) {
		let r = this.gl, i = this.viewBox();
		r.useProgram(this.lineProgram), r.uniform2f(this.uLineRes, i.width, i.height), r.uniform3f(this.uLineColor, t[0], t[1], t[2]), r.uniform1f(this.uLineOpacity, n), r.bindVertexArray(this.lineVao), r.bindBuffer(r.ARRAY_BUFFER, this.linePos), r.bufferData(r.ARRAY_BUFFER, e, r.DYNAMIC_DRAW), r.drawArrays(r.LINE_STRIP, 0, e.length / 2), r.bindVertexArray(null);
	}
	drawGlow(e, t, n, r) {
		let i = 8 * n, a = /* @__PURE__ */ new Float32Array(36);
		a[0] = e, a[1] = t;
		for (let n = 0; n <= 16; n++) {
			let r = n / 16 * Math.PI * 2;
			a[(n + 1) * 2] = e + Math.cos(r) * i, a[(n + 1) * 2 + 1] = t + Math.sin(r) * i;
		}
		this.drawLine(a, [
			.66,
			.55,
			1
		], r * .4);
	}
	render(e, t) {
		if (this.disposed || !this.target) return;
		let n = this.gl, r = this.viewBox();
		if (n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE), n.disable(n.DEPTH_TEST), this.borderCount > 1 && (n.useProgram(this.borderProgram), n.uniform2f(this.uBorderRes, r.width, r.height), n.uniform1f(this.uBorderTime, e), n.bindVertexArray(this.borderVao), n.drawArrays(n.LINE_LOOP, 0, this.borderCount), n.bindVertexArray(null)), this.particles.length > 0 && this.pathData.total > 0) {
			let i = new Float32Array(this.particles.length * 2), a = new Float32Array(this.particles.length);
			for (let n = 0; n < this.particles.length; n++) {
				let r = this.particles[n];
				r.t += t * r.speed;
				let o = M(this.pathData, r.t), s = Math.sin(e * 6 + r.phase), c = r.offset + s * 3;
				i[n * 2] = o.point.x + o.normal.x * c, i[n * 2 + 1] = o.point.y + o.normal.y * c, a[n] = r.size * (.6 + Math.abs(s) * .8);
			}
			n.useProgram(this.particleProgram), n.uniform2f(this.uParticleRes, r.width, r.height), n.uniform1f(this.uParticleDpr, this.pixelRatio), n.bindVertexArray(this.particleVao), n.bindBuffer(n.ARRAY_BUFFER, this.particlePos), n.bufferData(n.ARRAY_BUFFER, i, n.DYNAMIC_DRAW), n.bindBuffer(n.ARRAY_BUFFER, this.particleSize), n.bufferData(n.ARRAY_BUFFER, a, n.DYNAMIC_DRAW), n.drawArrays(n.POINTS, 0, this.particles.length), n.bindVertexArray(null);
		}
		this.nextBranch -= t * 1e3, this.nextBranch <= 0 && (this.spawnLightning(), Math.random() < .18 && (this.spawnLightning(), this.spawnLightning()), this.nextBranch = this.options.branchInterval + Math.random() * 260);
		for (let e = this.lightnings.length - 1; e >= 0; e--) {
			let n = this.lightnings[e];
			n.life += t;
			let r = n.life / n.maxLife, i = Math.random() > .28 ? 1 : .15;
			this.drawLine(n.positions, [
				.59,
				.41,
				1
			], (1 - r) * .35), this.drawLine(n.positions, [
				.94,
				.92,
				1
			], (1 - r) * i), this.drawGlow(n.glowX, n.glowY, 1 + r * 2.5, (1 - r) * .4), n.life >= n.maxLife && this.lightnings.splice(e, 1);
		}
	}
}, Ie = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nuniform float uCoreBoost;\nuniform float uHaloBoost;\nvarying float vProgress;\nvarying float vSide;\nfloat loopDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat band(float p, float center, float width) {\nfloat d = loopDistance(p, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat t = uTime;\nfloat b1 = band(vProgress, fract(0.03 + t * 0.050), 0.21);\nfloat b2 = band(vProgress, fract(0.32 - t * 0.040), 0.16);\nfloat b3 = band(vProgress, fract(0.61 + t * 0.030), 0.10);\nfloat b4 = band(vProgress, fract(0.86 - t * 0.073), 0.055);\nfloat scan = band(vProgress, fract(t * 0.110), 0.016);\nvec3 indigo = vec3(0.18, 0.10, 0.60);\nvec3 violet = vec3(0.58, 0.18, 1.00);\nvec3 magenta = vec3(1.00, 0.32, 0.92);\nvec3 blue = vec3(0.30, 0.48, 1.00);\nvec3 white = vec3(0.94, 0.92, 1.00);\nvec3 color = indigo * 0.15;\ncolor += violet * b1 * 0.78;\ncolor += blue * b2 * 0.45;\ncolor += magenta * b3 * 0.75;\ncolor += white * b4 * 1.20;\ncolor += white * scan * 1.50;\nfloat d = abs(vSide);\nfloat core = exp(-pow(d * 8.0, 2.0));\nfloat halo = exp(-pow(d * 2.2, 1.45));\nfloat noiseWave = 0.90 + sin(vProgress * 54.0 - t * 2.6) * 0.08;\nfloat breath = 0.88 + sin(t * 1.3) * 0.10;\ncolor *= noiseWave * breath;\nfloat alpha = halo * 0.38 * uHaloBoost + core * 0.88 * uCoreBoost;\nalpha += scan * halo * 0.42;\ncolor += white * scan * core * 0.7;\ngl_FragColor = vec4(color, clamp(alpha * uOpacity, 0.0, 1.0));\n}", Le = "precision highp float;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat d = length(p);\nfloat alpha = 1.0 - smoothstep(0.04, 0.5, d);\nfloat core = 1.0 - smoothstep(0.0, 0.14, d);\nvec3 color = vColor + vec3(core * 0.18);\ngl_FragColor = vec4(color, alpha * vAlpha);\n}", Re = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nattribute vec3 aColor;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvAlpha = aAlpha;\nvColor = aColor;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", Y = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nattribute float aSide;\nvarying float vProgress;\nvarying float vSide;\nvoid main() {\nvProgress = aProgress;\nvSide = aSide;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", ze = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nvarying float vProgress;\nvarying float vSide;\nfloat loopDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat band(float p, float center, float width) {\nfloat d = loopDistance(p, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat t = uTime;\nfloat d = abs(vSide);\nfloat haze = exp(-pow(d * 1.9, 1.4));\nfloat edge = exp(-pow(d * 4.0, 2.0));\nfloat r1 = band(vProgress, fract(0.18 + t * 0.032), 0.22);\nfloat r2 = band(vProgress, fract(0.67 - t * 0.028), 0.18);\nfloat r3 = band(vProgress, fract(0.86 + t * 0.045), 0.07);\nvec3 blackPurple = vec3(0.04, 0.02, 0.08);\nvec3 deepVoid = vec3(0.08, 0.03, 0.14);\nvec3 violet = vec3(0.26, 0.07, 0.42);\nvec3 color = blackPurple * 0.85;\ncolor += deepVoid * haze * 0.55;\ncolor += violet * edge * (r1 * 0.38 + r2 * 0.25 + r3 * 0.45);\nfloat pulse = 0.85 + sin(t * 1.1) * 0.08;\ncolor *= pulse;\nfloat alpha = haze * 0.34 + edge * 0.12 * (r1 + r2 + r3);\ngl_FragColor = vec4(color, alpha * uOpacity);\n}", Be = [
	.0706,
	.0314,
	.0902
], Ve = [
	.3647,
	.0745,
	.5647
], He = [
	.4,
	.1255,
	1
], Ue = [
	.9529,
	.6902,
	1
];
function X(e, t, n) {
	return [
		e[0] + (t[0] - e[0]) * n,
		e[1] + (t[1] - e[1]) * n,
		e[2] + (t[2] - e[2]) * n
	];
}
var Z = class r {
	element;
	canvas;
	gl;
	shadowProgram;
	glowProgram;
	pointProgram;
	layers = [];
	mistGpu;
	sparkGpu;
	uShadowRes;
	uShadowTime;
	uShadowOpacity;
	uGlowRes;
	uGlowTime;
	uGlowOpacity;
	uGlowCore;
	uGlowHalo;
	uPointRes;
	uPointDpr;
	mistData = [];
	sparkData = [];
	pathData = {
		path: [],
		lengths: [],
		total: 0
	};
	center = {
		x: 0,
		y: 0
	};
	options;
	target;
	container;
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
		this.rebuild();
	};
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
		this.options = {
			offset: Math.max(0, e.offset ?? 6),
			shadowWidth: Math.max(1, e.shadowWidth ?? 78),
			horizonWidth: Math.max(1, e.horizonWidth ?? 30),
			highlightWidth: Math.max(1, e.highlightWidth ?? 12),
			pathSamples: Math.max(32, Math.round(e.pathSamples ?? 520)),
			cornerSegments: Math.max(4, Math.round(e.cornerSegments ?? 24)),
			mistCount: Math.max(0, Math.round(e.mistCount ?? 190)),
			sparkCount: Math.max(0, Math.round(e.sparkCount ?? 95)),
			speed: Math.max(.1, e.speed ?? 1),
			zIndex: e.zIndex ?? 20,
			skipGreeting: e.skipGreeting,
			classNames: e.classNames,
			styles: e.styles
		}, this.target = e.target, this.container = e.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let t = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!t) throw Error("WebGL2 is required but not available.");
		this.gl = t, this.shadowProgram = o(t, Y, ze), this.glowProgram = o(t, Y, Ie), this.pointProgram = o(t, Re, Le), this.layers.push(this.createRibbonLayer({
			kind: "shadow",
			halfWidth: this.options.shadowWidth,
			opacity: .88,
			coreBoost: 0,
			haloBoost: 1
		}), this.createRibbonLayer({
			kind: "glow",
			halfWidth: this.options.horizonWidth,
			opacity: 1,
			coreBoost: .85,
			haloBoost: .95
		}), this.createRibbonLayer({
			kind: "glow",
			halfWidth: this.options.highlightWidth,
			opacity: .85,
			coreBoost: 1.1,
			haloBoost: .2
		})), this.mistGpu = this.createParticleGpu(), this.sparkGpu = this.createParticleGpu(), this.uShadowRes = t.getUniformLocation(this.shadowProgram, "uResolution"), this.uShadowTime = t.getUniformLocation(this.shadowProgram, "uTime"), this.uShadowOpacity = t.getUniformLocation(this.shadowProgram, "uOpacity"), this.uGlowRes = t.getUniformLocation(this.glowProgram, "uResolution"), this.uGlowTime = t.getUniformLocation(this.glowProgram, "uTime"), this.uGlowOpacity = t.getUniformLocation(this.glowProgram, "uOpacity"), this.uGlowCore = t.getUniformLocation(this.glowProgram, "uCoreBoost"), this.uGlowHalo = t.getUniformLocation(this.glowProgram, "uHaloBoost"), this.uPointRes = t.getUniformLocation(this.pointProgram, "uResolution"), this.uPointDpr = t.getUniformLocation(this.pointProgram, "uPixelRatio"), this.seedParticles(), this.options.skipGreeting || i("agent-aura");
	}
	setTarget(e) {
		this.target = e, this.observe(), this.rebuild();
	}
	setContainer(e) {
		this.container = e, this.applyCanvasLayout(), this.observe(), this.resizeToView();
	}
	start() {
		if (this.disposed) throw Error("VoidAura instance has been disposed.");
		if (this.running) return;
		this.running = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.observe(), this.resizeToView();
		let e = (t) => {
			if (!this.running) return;
			this.rafId = requestAnimationFrame(e);
			let n = Math.min((t - this.lastTime) / 1e3, .033);
			this.lastTime = t, this.render((t - this.startTime) * .001, n);
		};
		this.rafId = requestAnimationFrame(e);
	}
	pause() {
		if (this.disposed) throw Error("VoidAura instance has been disposed.");
		this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = null;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = !0, this.running = !1, this.rafId !== null && cancelAnimationFrame(this.rafId), this.disconnect();
		let e = this.gl;
		for (let t of this.layers) e.deleteBuffer(t.pos), e.deleteBuffer(t.prog), e.deleteBuffer(t.side), e.deleteBuffer(t.idx), e.deleteVertexArray(t.vao);
		this.deleteParticleGpu(this.mistGpu), this.deleteParticleGpu(this.sparkGpu), e.deleteProgram(this.shadowProgram), e.deleteProgram(this.glowProgram), e.deleteProgram(this.pointProgram), this.canvas.remove();
	}
	createRibbonLayer(e) {
		let t = this.gl, n = e.kind === "shadow" ? this.shadowProgram : this.glowProgram, r = t.createVertexArray(), i = t.createBuffer(), a = t.createBuffer(), o = t.createBuffer(), s = t.createBuffer();
		if (!r || !i || !a || !o || !s) throw Error("Failed to create void-aura ribbon geometry");
		t.bindVertexArray(r), t.bindBuffer(t.ARRAY_BUFFER, i);
		let c = t.getAttribLocation(n, "aPosition");
		t.enableVertexAttribArray(c), t.vertexAttribPointer(c, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, a);
		let l = t.getAttribLocation(n, "aProgress");
		t.enableVertexAttribArray(l), t.vertexAttribPointer(l, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, o);
		let u = t.getAttribLocation(n, "aSide");
		return t.enableVertexAttribArray(u), t.vertexAttribPointer(u, 1, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, s), t.bindVertexArray(null), {
			...e,
			vao: r,
			pos: i,
			prog: a,
			side: o,
			idx: s,
			indexCount: 0
		};
	}
	createParticleGpu() {
		let e = this.gl, t = e.createVertexArray(), n = e.createBuffer(), r = e.createBuffer(), i = e.createBuffer(), a = e.createBuffer();
		if (!t || !n || !r || !i || !a) throw Error("Failed to create void-aura particle geometry");
		e.bindVertexArray(t), e.bindBuffer(e.ARRAY_BUFFER, n);
		let o = e.getAttribLocation(this.pointProgram, "aPosition");
		e.enableVertexAttribArray(o), e.vertexAttribPointer(o, 2, e.FLOAT, !1, 0, 0), e.bindBuffer(e.ARRAY_BUFFER, r);
		let s = e.getAttribLocation(this.pointProgram, "aSize");
		e.enableVertexAttribArray(s), e.vertexAttribPointer(s, 1, e.FLOAT, !1, 0, 0), e.bindBuffer(e.ARRAY_BUFFER, i);
		let c = e.getAttribLocation(this.pointProgram, "aAlpha");
		e.enableVertexAttribArray(c), e.vertexAttribPointer(c, 1, e.FLOAT, !1, 0, 0), e.bindBuffer(e.ARRAY_BUFFER, a);
		let l = e.getAttribLocation(this.pointProgram, "aColor");
		return e.enableVertexAttribArray(l), e.vertexAttribPointer(l, 3, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), {
			vao: t,
			pos: n,
			size: r,
			alpha: i,
			color: a
		};
	}
	deleteParticleGpu(e) {
		let t = this.gl;
		t.deleteBuffer(e.pos), t.deleteBuffer(e.size), t.deleteBuffer(e.alpha), t.deleteBuffer(e.color), t.deleteVertexArray(e.vao);
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
		(this.canvas.width !== t || this.canvas.height !== n) && (this.canvas.width = t, this.canvas.height = n), this.gl.viewport(0, 0, t, n), this.rebuild();
	}
	seedParticles() {
		this.mistData = [];
		for (let e = 0; e < this.options.mistCount; e++) this.mistData.push({
			t: Math.random(),
			speed: N(.003, .02),
			offset: N(-18, 56),
			swirl: N(8, 26),
			size: N(24, 92),
			alpha: N(.018, .11),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2,
			phase3: Math.random() * Math.PI * 2
		});
		this.sparkData = [];
		for (let e = 0; e < this.options.sparkCount; e++) this.sparkData.push({
			t: Math.random(),
			speed: N(.018, .085),
			offset: N(2, 18),
			size: N(2, 6),
			alpha: N(.26, .95),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2
		});
	}
	rebuild() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = A(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = j(t), this.center = this.pathCenter(t), this.uploadRibbons();
	}
	pathCenter(e) {
		if (e.length === 0) return {
			x: 0,
			y: 0
		};
		let t = 0, n = 0;
		for (let r of e) t += r.x, n += r.y;
		return {
			x: t / e.length,
			y: n / e.length
		};
	}
	sample(e) {
		let t = M(this.pathData, e), n = t.point.x - this.center.x, r = t.point.y - this.center.y;
		return t.normal.x * n + t.normal.y * r < 0 ? {
			point: t.point,
			tangent: t.tangent,
			normal: {
				x: -t.normal.x,
				y: -t.normal.y
			}
		} : t;
	}
	uploadRibbons() {
		if (this.pathData.total <= 0) return;
		let e = this.gl, t = this.options.pathSamples, n = (t + 1) * 2, r = new Uint16Array(t * 6);
		for (let e = 0; e < t; e++) {
			let t = e * 2, n = t + 1, i = t + 2, a = t + 3, o = e * 6;
			r[o] = t, r[o + 1] = n, r[o + 2] = i, r[o + 3] = n, r[o + 4] = a, r[o + 5] = i;
		}
		for (let i of this.layers) {
			let a = new Float32Array(n * 2), o = new Float32Array(n), s = new Float32Array(n);
			for (let e = 0; e <= t; e++) {
				let n = e / t, r = this.sample(n), c = r.point.x - r.normal.x * i.halfWidth, l = r.point.y - r.normal.y * i.halfWidth, u = r.point.x + r.normal.x * i.halfWidth, d = r.point.y + r.normal.y * i.halfWidth, f = e * 2;
				a[f * 2] = c, a[f * 2 + 1] = l, a[(f + 1) * 2] = u, a[(f + 1) * 2 + 1] = d, o[f] = n, o[f + 1] = n, s[f] = -1, s[f + 1] = 1;
			}
			e.bindBuffer(e.ARRAY_BUFFER, i.pos), e.bufferData(e.ARRAY_BUFFER, a, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.prog), e.bufferData(e.ARRAY_BUFFER, o, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.side), e.bufferData(e.ARRAY_BUFFER, s, e.DYNAMIC_DRAW), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, i.idx), e.bufferData(e.ELEMENT_ARRAY_BUFFER, r, e.STATIC_DRAW), i.indexCount = r.length;
		}
		e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
	}
	render(e, t) {
		if (this.disposed || !this.target) return;
		let n = this.gl, r = this.viewBox(), i = e * this.options.speed;
		n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT), n.enable(n.BLEND), n.disable(n.DEPTH_TEST), n.disable(n.CULL_FACE);
		let a = this.layers[0], o = this.layers[1], s = this.layers[2];
		n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), this.drawRibbon(a, r, i, this.shadowProgram), n.blendFunc(n.SRC_ALPHA, n.ONE), this.updateMist(i, t, r), this.drawRibbon(o, r, i, this.glowProgram), this.drawRibbon(s, r, i, this.glowProgram), this.updateSparks(i, t, r);
	}
	drawRibbon(e, t, n, r) {
		if (e.indexCount === 0) return;
		let i = this.gl;
		i.useProgram(r), e.kind === "shadow" ? (i.uniform2f(this.uShadowRes, t.width, t.height), i.uniform1f(this.uShadowTime, n), i.uniform1f(this.uShadowOpacity, e.opacity)) : (i.uniform2f(this.uGlowRes, t.width, t.height), i.uniform1f(this.uGlowTime, n), i.uniform1f(this.uGlowOpacity, e.opacity), i.uniform1f(this.uGlowCore, e.coreBoost), i.uniform1f(this.uGlowHalo, e.haloBoost)), i.bindVertexArray(e.vao), i.drawElements(i.TRIANGLES, e.indexCount, i.UNSIGNED_SHORT, 0), i.bindVertexArray(null);
	}
	updateMist(e, t, n) {
		if (this.mistData.length === 0 || this.pathData.total <= 0) return;
		let r = this.mistData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), s = new Float32Array(r * 3);
		for (let n = 0; n < r; n++) {
			let r = this.mistData[n];
			r.t += t * r.speed * this.options.speed;
			let c = this.sample(r.t), l = Math.sin(e * 1.3 + r.phase), u = Math.cos(e * .8 + r.phase2), d = Math.sin(e * 2.1 + r.phase3), f = r.offset + l * r.swirl, p = u * 15, m = -Math.abs(d) * 14;
			i[n * 2] = c.point.x + c.normal.x * (f + m) + c.tangent.x * p, i[n * 2 + 1] = c.point.y + c.normal.y * (f + m) + c.tangent.y * p, a[n] = r.size * (.7 + (u * .5 + .5) * .5), o[n] = r.alpha * (.48 + (l * .5 + .5) * .52);
			let h = X(Be, Ve, d * .5 + .5);
			s[n * 3] = h[0], s[n * 3 + 1] = h[1], s[n * 3 + 2] = h[2];
		}
		this.drawParticles(this.mistGpu, n, r, i, a, o, s);
	}
	updateSparks(e, t, n) {
		if (this.sparkData.length === 0 || this.pathData.total <= 0) return;
		let r = this.sparkData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), s = new Float32Array(r * 3);
		for (let n = 0; n < r; n++) {
			let r = this.sparkData[n];
			r.t += t * r.speed * this.options.speed;
			let c = this.sample(r.t), l = Math.sin(e * 4.2 + r.phase), u = Math.cos(e * 2.6 + r.phase2), d = r.offset + l * 4, f = u * 8;
			i[n * 2] = c.point.x + c.normal.x * d + c.tangent.x * f, i[n * 2 + 1] = c.point.y + c.normal.y * d + c.tangent.y * f, a[n] = r.size * (.65 + Math.abs(l) * 1), o[n] = r.alpha * (.4 + Math.abs(l) * .6);
			let p = X(He, Ue, Math.abs(l));
			s[n * 3] = p[0], s[n * 3 + 1] = p[1], s[n * 3 + 2] = p[2];
		}
		this.drawParticles(this.sparkGpu, n, r, i, a, o, s);
	}
	drawParticles(e, t, n, r, i, a, o) {
		let s = this.gl;
		s.useProgram(this.pointProgram), s.uniform2f(this.uPointRes, t.width, t.height), s.uniform1f(this.uPointDpr, this.pixelRatio), s.bindVertexArray(e.vao), s.bindBuffer(s.ARRAY_BUFFER, e.pos), s.bufferData(s.ARRAY_BUFFER, r, s.DYNAMIC_DRAW), s.bindBuffer(s.ARRAY_BUFFER, e.size), s.bufferData(s.ARRAY_BUFFER, i, s.DYNAMIC_DRAW), s.bindBuffer(s.ARRAY_BUFFER, e.alpha), s.bufferData(s.ARRAY_BUFFER, a, s.DYNAMIC_DRAW), s.bindBuffer(s.ARRAY_BUFFER, e.color), s.bufferData(s.ARRAY_BUFFER, o, s.DYNAMIC_DRAW), s.drawArrays(s.POINTS, 0, n), s.bindVertexArray(null);
	}
}, Q = class extends I {
	static attach(e, t = {}) {
		return I.attach(e, {
			...t,
			mode: "water"
		});
	}
	constructor(e = {}) {
		super({
			...e,
			mode: "water"
		});
	}
}, $ = {
	fire(e, t) {
		return B.attach(e, t);
	},
	burning(e, t) {
		return O.attach(e, t);
	},
	border(e, t) {
		return G.attach(e, t);
	},
	glow(e, t) {
		return W.attach(e, t);
	},
	shape(e, t) {
		return q.attach(e, t);
	},
	water(e, t) {
		return Q.attach(e, t);
	},
	cultivation(e, t) {
		return R.attach(e, t);
	},
	demonic(e, t) {
		return z.attach(e, t);
	},
	thunder(e, t) {
		return J.attach(e, t);
	},
	void(e, t) {
		return Z.attach(e, t);
	},
	glitch(e, t) {
		return H.attach(e, t);
	}
};
//#endregion
export { O as BurningFire, R as CultivationAura, z as DemonicAura, B as FireBorder, H as GlitchAura, W as Glow, G as MotionBorder, q as ShapeAura, I as ShapeFieldAura, J as ThunderAura, Z as VoidAura, Q as WaterAura, $ as aura, $ as default };
