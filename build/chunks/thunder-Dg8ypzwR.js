/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-C-xRtUiz.js";
import { a, i as o, n as s, r as c, t as l } from "./path-A-tRBNDQ.js";
//#region src/thunder/shaders/border.frag.glsl
var u = "precision highp float;\nuniform float uTime;\nvarying float vProgress;\nfloat pulse(float x) {\nreturn pow(max(0.0, sin(x)), 8.0);\n}\nvoid main() {\nfloat p1 = pulse(vProgress * 32.0 - uTime * 8.0);\nfloat p2 = pulse(vProgress * 19.0 + uTime * 5.0 + 2.0);\nfloat energy = 0.32 + p1 * 0.8 + p2 * 0.45;\nvec3 purple = vec3(0.34, 0.18, 1.0);\nvec3 blue = vec3(0.28, 0.56, 1.0);\nvec3 white = vec3(0.94, 0.92, 1.0);\nvec3 color = mix(purple, blue, p2);\ncolor = mix(color, white, p1);\ngl_FragColor = vec4(color, energy);\n}", d = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nvarying float vProgress;\nvoid main() {\nvProgress = aProgress;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", f = "precision highp float;\nuniform vec3 uColor;\nuniform float uOpacity;\nvoid main() {\ngl_FragColor = vec4(uColor, uOpacity);\n}", p = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nvoid main() {\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", m = "precision highp float;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat d = length(p);\nfloat alpha = 1.0 - smoothstep(0.05, 0.5, d);\nvec3 color = mix(vec3(0.40, 0.22, 1.0), vec3(0.86, 0.80, 1.0), 1.0 - d);\ngl_FragColor = vec4(color, alpha);\n}", h = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nvoid main() {\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", g = class g {
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
	static attach(e, i = {}) {
		let a = t(e), { container: o, ...s } = i, c = r(o);
		c && n(c);
		let l = new g({
			...s,
			target: a,
			container: c
		});
		return (c ?? document.body).appendChild(l.element), l.start(), l;
	}
	constructor(t = {}) {
		this.options = {
			offset: Math.max(0, t.offset ?? 8),
			cornerSegments: Math.max(4, Math.round(t.cornerSegments ?? 12)),
			branchInterval: Math.max(20, t.branchInterval ?? 85),
			maxBranches: Math.max(1, Math.round(t.maxBranches ?? 16)),
			particleCount: Math.max(0, Math.round(t.particleCount ?? 90)),
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
		this.gl = n, this.borderProgram = i(n, d, u), this.lineProgram = i(n, p, f), this.particleProgram = i(n, h, m);
		let r = n.createVertexArray(), a = n.createBuffer(), o = n.createBuffer(), s = n.createVertexArray(), c = n.createBuffer(), l = n.createVertexArray(), g = n.createBuffer(), _ = n.createBuffer();
		if (!r || !a || !o || !s || !c || !l || !g || !_) throw Error("Failed to create thunder geometry");
		this.borderVao = r, this.borderPos = a, this.borderProg = o, this.lineVao = s, this.linePos = c, this.particleVao = l, this.particlePos = g, this.particleSize = _, n.bindVertexArray(r), n.bindBuffer(n.ARRAY_BUFFER, a);
		let v = n.getAttribLocation(this.borderProgram, "aPosition");
		n.enableVertexAttribArray(v), n.vertexAttribPointer(v, 2, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, o);
		let y = n.getAttribLocation(this.borderProgram, "aProgress");
		n.enableVertexAttribArray(y), n.vertexAttribPointer(y, 1, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), n.bindVertexArray(s), n.bindBuffer(n.ARRAY_BUFFER, c);
		let b = n.getAttribLocation(this.lineProgram, "aPosition");
		n.enableVertexAttribArray(b), n.vertexAttribPointer(b, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), n.bindVertexArray(l), n.bindBuffer(n.ARRAY_BUFFER, g);
		let x = n.getAttribLocation(this.particleProgram, "aPosition");
		n.enableVertexAttribArray(x), n.vertexAttribPointer(x, 2, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, _);
		let S = n.getAttribLocation(this.particleProgram, "aSize");
		n.enableVertexAttribArray(S), n.vertexAttribPointer(S, 1, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.uBorderRes = n.getUniformLocation(this.borderProgram, "uResolution"), this.uBorderTime = n.getUniformLocation(this.borderProgram, "uTime"), this.uLineRes = n.getUniformLocation(this.lineProgram, "uResolution"), this.uLineColor = n.getUniformLocation(this.lineProgram, "uColor"), this.uLineOpacity = n.getUniformLocation(this.lineProgram, "uOpacity"), this.uParticleRes = n.getUniformLocation(this.particleProgram, "uResolution"), this.uParticleDpr = n.getUniformLocation(this.particleProgram, "uPixelRatio"), this.seedParticles(), this.options.skipGreeting || e("agent-aura");
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
			speed: o(.025, .095),
			offset: o(-7, 15),
			size: o(2, 6),
			phase: Math.random() * Math.PI * 2
		});
	}
	rebuildPath() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = s(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = l(t), this.borderCount = t.length;
		let n = new Float32Array(t.length * 2), r = new Float32Array(t.length);
		for (let e = 0; e < t.length; e++) n[e * 2] = t[e].x, n[e * 2 + 1] = t[e].y, r[e] = e / t.length;
		let i = this.gl;
		i.bindBuffer(i.ARRAY_BUFFER, this.borderPos), i.bufferData(i.ARRAY_BUFFER, n, i.DYNAMIC_DRAW), i.bindBuffer(i.ARRAY_BUFFER, this.borderProg), i.bufferData(i.ARRAY_BUFFER, r, i.DYNAMIC_DRAW);
	}
	spawnLightning() {
		if (this.lightnings.length >= this.options.maxBranches || this.pathData.total <= 0) return;
		let e = c(this.pathData, Math.random()), t = this.viewBox(), n = this.target.getBoundingClientRect(), r = {
			x: n.left - t.left + n.width / 2,
			y: n.top - t.top + n.height / 2
		}, i = e.point.x - r.x, s = e.point.y - r.y, l = Math.hypot(i, s) || 1, u = {
			x: i / l,
			y: s / l
		}, d = e.normal;
		d.x * u.x + d.y * u.y < 0 && (d = {
			x: -d.x,
			y: -d.y
		}), d = a(d, o(-.35, .35));
		let f = o(32, 100), p = Math.floor(o(7, 14)), m = new Float32Array((p + 1) * 2), h = { ...e.point };
		m[0] = h.x, m[1] = h.y;
		let g = {
			x: -d.y,
			y: d.x
		};
		for (let e = 1; e <= p; e++) h = {
			x: h.x + d.x * f / p + g.x * o(-12, 12),
			y: h.y + d.y * f / p + g.y * o(-12, 12)
		}, m[e * 2] = h.x, m[e * 2 + 1] = h.y;
		this.lightnings.push({
			positions: m,
			life: 0,
			maxLife: o(.08, .22),
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
				let o = c(this.pathData, r.t), s = Math.sin(e * 6 + r.phase), l = r.offset + s * 3;
				i[n * 2] = o.point.x + o.normal.x * l, i[n * 2 + 1] = o.point.y + o.normal.y * l, a[n] = r.size * (.6 + Math.abs(s) * .8);
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
};
//#endregion
//#region src/entries/thunder.ts
function _(e, t) {
	return g.attach(e, t);
}
//#endregion
export { g as n, _ as t };
