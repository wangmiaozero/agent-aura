/*! agent-aura v1.1.0 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-CIs-YzNM.js";
import { i as a, n as o, r as s, t as c } from "./path-BwdbaU64.js";
//#region src/void/shaders/glow.frag.glsl
var l = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nuniform float uCoreBoost;\nuniform float uHaloBoost;\nvarying float vProgress;\nvarying float vSide;\nfloat loopDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat band(float p, float center, float width) {\nfloat d = loopDistance(p, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat t = uTime;\nfloat b1 = band(vProgress, fract(0.03 + t * 0.050), 0.21);\nfloat b2 = band(vProgress, fract(0.32 - t * 0.040), 0.16);\nfloat b3 = band(vProgress, fract(0.61 + t * 0.030), 0.10);\nfloat b4 = band(vProgress, fract(0.86 - t * 0.073), 0.055);\nfloat scan = band(vProgress, fract(t * 0.110), 0.016);\nvec3 indigo = vec3(0.18, 0.10, 0.60);\nvec3 violet = vec3(0.58, 0.18, 1.00);\nvec3 magenta = vec3(1.00, 0.32, 0.92);\nvec3 blue = vec3(0.30, 0.48, 1.00);\nvec3 white = vec3(0.94, 0.92, 1.00);\nvec3 color = indigo * 0.15;\ncolor += violet * b1 * 0.78;\ncolor += blue * b2 * 0.45;\ncolor += magenta * b3 * 0.75;\ncolor += white * b4 * 1.20;\ncolor += white * scan * 1.50;\nfloat d = abs(vSide);\nfloat core = exp(-pow(d * 8.0, 2.0));\nfloat halo = exp(-pow(d * 2.2, 1.45));\nfloat noiseWave = 0.90 + sin(vProgress * 54.0 - t * 2.6) * 0.08;\nfloat breath = 0.88 + sin(t * 1.3) * 0.10;\ncolor *= noiseWave * breath;\nfloat alpha = halo * 0.38 * uHaloBoost + core * 0.88 * uCoreBoost;\nalpha += scan * halo * 0.42;\ncolor += white * scan * core * 0.7;\ngl_FragColor = vec4(color, clamp(alpha * uOpacity, 0.0, 1.0));\n}", u = "precision highp float;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat d = length(p);\nfloat alpha = 1.0 - smoothstep(0.04, 0.5, d);\nfloat core = 1.0 - smoothstep(0.0, 0.14, d);\nvec3 color = vColor + vec3(core * 0.18);\ngl_FragColor = vec4(color, alpha * vAlpha);\n}", d = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nattribute vec3 aColor;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvAlpha = aAlpha;\nvColor = aColor;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", f = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nattribute float aSide;\nvarying float vProgress;\nvarying float vSide;\nvoid main() {\nvProgress = aProgress;\nvSide = aSide;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", p = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nvarying float vProgress;\nvarying float vSide;\nfloat loopDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat band(float p, float center, float width) {\nfloat d = loopDistance(p, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat t = uTime;\nfloat d = abs(vSide);\nfloat haze = exp(-pow(d * 1.9, 1.4));\nfloat edge = exp(-pow(d * 4.0, 2.0));\nfloat r1 = band(vProgress, fract(0.18 + t * 0.032), 0.22);\nfloat r2 = band(vProgress, fract(0.67 - t * 0.028), 0.18);\nfloat r3 = band(vProgress, fract(0.86 + t * 0.045), 0.07);\nvec3 blackPurple = vec3(0.04, 0.02, 0.08);\nvec3 deepVoid = vec3(0.08, 0.03, 0.14);\nvec3 violet = vec3(0.26, 0.07, 0.42);\nvec3 color = blackPurple * 0.85;\ncolor += deepVoid * haze * 0.55;\ncolor += violet * edge * (r1 * 0.38 + r2 * 0.25 + r3 * 0.45);\nfloat pulse = 0.85 + sin(t * 1.1) * 0.08;\ncolor *= pulse;\nfloat alpha = haze * 0.34 + edge * 0.12 * (r1 + r2 + r3);\ngl_FragColor = vec4(color, alpha * uOpacity);\n}", m = [
	.0706,
	.0314,
	.0902
], h = [
	.3647,
	.0745,
	.5647
], g = [
	.4,
	.1255,
	1
], _ = [
	.9529,
	.6902,
	1
];
function v(e, t, n) {
	return [
		e[0] + (t[0] - e[0]) * n,
		e[1] + (t[1] - e[1]) * n,
		e[2] + (t[2] - e[2]) * n
	];
}
var y = class y {
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
	static attach(e, i = {}) {
		let a = t(e), { container: o, ...s } = i, c = r(o);
		c && n(c);
		let l = new y({
			...s,
			target: a,
			container: c
		});
		return (c ?? document.body).appendChild(l.element), l.start(), l;
	}
	constructor(t = {}) {
		this.options = {
			offset: Math.max(0, t.offset ?? 6),
			shadowWidth: Math.max(1, t.shadowWidth ?? 78),
			horizonWidth: Math.max(1, t.horizonWidth ?? 30),
			highlightWidth: Math.max(1, t.highlightWidth ?? 12),
			pathSamples: Math.max(32, Math.round(t.pathSamples ?? 520)),
			cornerSegments: Math.max(4, Math.round(t.cornerSegments ?? 24)),
			mistCount: Math.max(0, Math.round(t.mistCount ?? 190)),
			sparkCount: Math.max(0, Math.round(t.sparkCount ?? 95)),
			speed: Math.max(.1, t.speed ?? 1),
			zIndex: t.zIndex ?? 20,
			skipGreeting: t.skipGreeting,
			classNames: t.classNames,
			styles: t.styles
		}, this.target = t.target, this.container = t.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let n = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!n) throw Error("WebGL2 is required but not available.");
		this.gl = n, this.shadowProgram = i(n, f, p), this.glowProgram = i(n, f, l), this.pointProgram = i(n, d, u), this.layers.push(this.createRibbonLayer({
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
		})), this.mistGpu = this.createParticleGpu(), this.sparkGpu = this.createParticleGpu(), this.uShadowRes = n.getUniformLocation(this.shadowProgram, "uResolution"), this.uShadowTime = n.getUniformLocation(this.shadowProgram, "uTime"), this.uShadowOpacity = n.getUniformLocation(this.shadowProgram, "uOpacity"), this.uGlowRes = n.getUniformLocation(this.glowProgram, "uResolution"), this.uGlowTime = n.getUniformLocation(this.glowProgram, "uTime"), this.uGlowOpacity = n.getUniformLocation(this.glowProgram, "uOpacity"), this.uGlowCore = n.getUniformLocation(this.glowProgram, "uCoreBoost"), this.uGlowHalo = n.getUniformLocation(this.glowProgram, "uHaloBoost"), this.uPointRes = n.getUniformLocation(this.pointProgram, "uResolution"), this.uPointDpr = n.getUniformLocation(this.pointProgram, "uPixelRatio"), this.seedParticles(), this.options.skipGreeting || e("agent-aura");
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
			speed: a(.003, .02),
			offset: a(-18, 56),
			swirl: a(8, 26),
			size: a(24, 92),
			alpha: a(.018, .11),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2,
			phase3: Math.random() * Math.PI * 2
		});
		this.sparkData = [];
		for (let e = 0; e < this.options.sparkCount; e++) this.sparkData.push({
			t: Math.random(),
			speed: a(.018, .085),
			offset: a(2, 18),
			size: a(2, 6),
			alpha: a(.26, .95),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2
		});
	}
	rebuild() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = o(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = c(t), this.center = this.pathCenter(t), this.uploadRibbons();
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
		let t = s(this.pathData, e), n = t.point.x - this.center.x, r = t.point.y - this.center.y;
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
			let c = this.sample(r.t), l = Math.sin(e * 1.3 + r.phase), u = Math.cos(e * .8 + r.phase2), d = Math.sin(e * 2.1 + r.phase3), f = r.offset + l * r.swirl, p = u * 15, g = -Math.abs(d) * 14;
			i[n * 2] = c.point.x + c.normal.x * (f + g) + c.tangent.x * p, i[n * 2 + 1] = c.point.y + c.normal.y * (f + g) + c.tangent.y * p, a[n] = r.size * (.7 + (u * .5 + .5) * .5), o[n] = r.alpha * (.48 + (l * .5 + .5) * .52);
			let _ = v(m, h, d * .5 + .5);
			s[n * 3] = _[0], s[n * 3 + 1] = _[1], s[n * 3 + 2] = _[2];
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
			let p = v(g, _, Math.abs(l));
			s[n * 3] = p[0], s[n * 3 + 1] = p[1], s[n * 3 + 2] = p[2];
		}
		this.drawParticles(this.sparkGpu, n, r, i, a, o, s);
	}
	drawParticles(e, t, n, r, i, a, o) {
		let s = this.gl;
		s.useProgram(this.pointProgram), s.uniform2f(this.uPointRes, t.width, t.height), s.uniform1f(this.uPointDpr, this.pixelRatio), s.bindVertexArray(e.vao), s.bindBuffer(s.ARRAY_BUFFER, e.pos), s.bufferData(s.ARRAY_BUFFER, r, s.DYNAMIC_DRAW), s.bindBuffer(s.ARRAY_BUFFER, e.size), s.bufferData(s.ARRAY_BUFFER, i, s.DYNAMIC_DRAW), s.bindBuffer(s.ARRAY_BUFFER, e.alpha), s.bufferData(s.ARRAY_BUFFER, a, s.DYNAMIC_DRAW), s.bindBuffer(s.ARRAY_BUFFER, e.color), s.bufferData(s.ARRAY_BUFFER, o, s.DYNAMIC_DRAW), s.drawArrays(s.POINTS, 0, n), s.bindVertexArray(null);
	}
};
//#endregion
//#region src/entries/void.ts
function b(e, t) {
	return y.attach(e, t);
}
//#endregion
export { y as n, b as t };
