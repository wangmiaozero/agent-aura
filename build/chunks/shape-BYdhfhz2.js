/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-C-xRtUiz.js";
import { i as a, n as o, r as s, t as c } from "./path-A-tRBNDQ.js";
//#region src/shape/shaders/dust.frag.glsl
var l = "precision highp float;\nvarying float vAlpha;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat d = length(p);\nfloat alpha = 1.0 - smoothstep(0.02, 0.5, d);\nvec3 color = mix(\nvec3(0.15, 0.46, 1.0),\nvec3(0.70, 0.94, 1.0),\n1.0 - d\n);\ngl_FragColor = vec4(color, alpha * vAlpha);\n}", u = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nvarying float vAlpha;\nvoid main() {\nvAlpha = aAlpha;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", d = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nuniform float uCoreStrength;\nuniform float uHaloStrength;\nvarying float vProgress;\nvarying float vSide;\nfloat loopDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat energyBand(float progress, float center, float width) {\nfloat d = loopDistance(progress, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat t = uTime;\nfloat b1 = energyBand(vProgress, fract(0.02 + t * 0.052), 0.24);\nfloat b2 = energyBand(vProgress, fract(0.32 - t * 0.041), 0.18);\nfloat b3 = energyBand(vProgress, fract(0.63 + t * 0.029), 0.12);\nfloat b4 = energyBand(vProgress, fract(0.82 - t * 0.067), 0.075);\nfloat scan = energyBand(vProgress, fract(t * 0.115), 0.018);\nvec3 cyan = vec3(0.16, 0.73, 1.0);\nvec3 blue = vec3(0.20, 0.38, 1.0);\nvec3 purple = vec3(0.68, 0.24, 1.0);\nvec3 pink = vec3(1.0, 0.24, 0.67);\nvec3 white = vec3(0.92, 0.99, 1.0);\nvec3 color = cyan * 0.13;\ncolor += cyan * b1 * 0.85;\ncolor += blue * b2 * 0.70;\ncolor += purple * b3 * 0.85;\ncolor += pink * b4 * 0.60;\ncolor += white * scan * 1.5;\nfloat d = abs(vSide);\nfloat core = exp(-pow(d * 8.5, 2.0));\nfloat halo = exp(-pow(d * 2.15, 1.45));\nfloat breath = 0.88 + sin(t * 1.45) * 0.10;\nfloat wave = 0.92 + sin(vProgress * 46.0 - t * 2.2) * 0.08;\ncolor *= breath * wave;\nfloat alpha = halo * 0.36 * uHaloStrength + core * 0.90 * uCoreStrength;\nalpha += scan * halo * 0.40;\ncolor += white * scan * core * 0.8;\nalpha *= uOpacity;\ngl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));\n}", f = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nattribute float aSide;\nvarying float vProgress;\nvarying float vSide;\nvoid main() {\nvProgress = aProgress;\nvSide = aSide;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", p = class p {
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
	static attach(e, i = {}) {
		let a = t(e), { container: o, ...s } = i, c = r(o);
		c && n(c);
		let l = new p({
			...s,
			target: a,
			container: c
		});
		return (c ?? document.body).appendChild(l.element), l.start(), l;
	}
	constructor(t = {}) {
		this.options = {
			offset: Math.max(0, t.offset ?? 5),
			auraWidth: Math.max(1, t.auraWidth ?? 33),
			outerGlowWidth: Math.max(1, t.outerGlowWidth ?? 86),
			pathSamples: Math.max(32, Math.round(t.pathSamples ?? 500)),
			cornerSegments: Math.max(4, Math.round(t.cornerSegments ?? 24)),
			dustCount: Math.max(0, Math.round(t.dustCount ?? 75)),
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
		this.gl = n, this.ribbonProgram = i(n, f, d), this.dustProgram = i(n, u, l);
		let r = [{
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
		for (let e of r) this.layers.push(this.createRibbonLayer(e));
		let a = n.createVertexArray(), o = n.createBuffer(), s = n.createBuffer(), c = n.createBuffer();
		if (!a || !o || !s || !c) throw Error("Failed to create shape-aura dust geometry");
		this.dustVao = a, this.dustPos = o, this.dustSize = s, this.dustAlpha = c, n.bindVertexArray(a), n.bindBuffer(n.ARRAY_BUFFER, o);
		let p = n.getAttribLocation(this.dustProgram, "aPosition");
		n.enableVertexAttribArray(p), n.vertexAttribPointer(p, 2, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, s);
		let m = n.getAttribLocation(this.dustProgram, "aSize");
		n.enableVertexAttribArray(m), n.vertexAttribPointer(m, 1, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, c);
		let h = n.getAttribLocation(this.dustProgram, "aAlpha");
		n.enableVertexAttribArray(h), n.vertexAttribPointer(h, 1, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.uRibbonRes = n.getUniformLocation(this.ribbonProgram, "uResolution"), this.uRibbonTime = n.getUniformLocation(this.ribbonProgram, "uTime"), this.uRibbonOpacity = n.getUniformLocation(this.ribbonProgram, "uOpacity"), this.uRibbonCore = n.getUniformLocation(this.ribbonProgram, "uCoreStrength"), this.uRibbonHalo = n.getUniformLocation(this.ribbonProgram, "uHaloStrength"), this.uDustRes = n.getUniformLocation(this.dustProgram, "uResolution"), this.uDustDpr = n.getUniformLocation(this.dustProgram, "uPixelRatio"), this.seedDust(), this.options.skipGreeting || e("agent-aura");
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
			speed: a(.005, .023),
			offset: a(10, 58),
			size: a(5, 17),
			alpha: a(.025, .14),
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
};
//#endregion
//#region src/entries/shape.ts
function m(e, t) {
	return p.attach(e, t);
}
//#endregion
export { p as n, m as t };
