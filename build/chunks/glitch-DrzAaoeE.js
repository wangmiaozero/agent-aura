/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-C-xRtUiz.js";
import { i as a, n as o, r as s, t as c } from "./path-A-tRBNDQ.js";
//#region src/glitch/shaders/glitch.frag.glsl
var l = "precision highp float;\nuniform float uTime;\nuniform float uBurst;\nuniform vec3 uColor;\nuniform float uIntensity;\nvarying float vProgress;\nvarying float vSide;\nfloat hash(float n) {\nreturn fract(sin(n) * 43758.5453123);\n}\nfloat segmentNoise(float progress, float time) {\nfloat index = floor(progress * 44.0);\nfloat frame = floor(time * 13.0);\nreturn hash(index * 17.17 + frame * 31.91);\n}\nvoid main() {\nfloat t = uTime;\nfloat d = abs(vSide);\nfloat core = exp(-pow(d * 8.0, 2.0));\nfloat halo = exp(-pow(d * 2.1, 1.4));\nfloat noise = segmentNoise(vProgress, t);\nfloat broken = step(0.18, noise);\nfloat flash = step(0.88, hash(floor(t * 24.0) + floor(vProgress * 21.0)));\nfloat scan = step(0.86, sin(vProgress * 150.0 - t * 18.0));\nfloat corruption = broken * (0.75 + noise * 0.35);\ncorruption += uBurst * (flash * 1.2 + scan * 0.65);\nvec3 color = uColor + vec3(1.0) * flash * (0.6 + uBurst);\nfloat alpha = (core * 0.82 + halo * 0.20) * corruption * uIntensity;\nif (noise < 0.13) alpha = 0.0;\ngl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));\n}", u = "precision highp float;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvec2 p = gl_PointCoord - 0.5;\nfloat edge = max(abs(p.x), abs(p.y));\nfloat alpha = 1.0 - smoothstep(0.35, 0.5, edge);\ngl_FragColor = vec4(vColor, alpha * vAlpha);\n}", d = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nattribute vec3 aColor;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvAlpha = aAlpha;\nvColor = aColor;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}", f = "precision highp float;\nuniform vec2 uResolution;\nuniform vec2 uOffset;\nattribute vec2 aPosition;\nattribute float aProgress;\nattribute float aSide;\nvarying float vProgress;\nvarying float vSide;\nvoid main() {\nvProgress = aProgress;\nvSide = aSide;\nvec2 pos = aPosition + uOffset;\nvec2 clip = vec2(\n(pos.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (pos.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", p = [
	0,
	.9647,
	1
], m = [
	1,
	.0902,
	.3098
], h = [
	.9686,
	.9725,
	1
], g = [
	.3373,
	.1451,
	1
], _ = [
	0,
	.9647,
	1
], v = [
	1,
	.0784,
	.3569
], y = class y {
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
			offset: Math.max(0, t.offset ?? 5),
			outerWidth: Math.max(1, t.outerWidth ?? 45),
			rgbWidth: Math.max(1, t.rgbWidth ?? 11),
			pathSamples: Math.max(32, Math.round(t.pathSamples ?? 500)),
			cornerSegments: Math.max(4, Math.round(t.cornerSegments ?? 22)),
			fragmentCount: Math.max(0, Math.round(t.fragmentCount ?? 130)),
			burstIntervalMin: Math.max(80, t.burstIntervalMin ?? 900),
			burstIntervalMax: Math.max(80, t.burstIntervalMax ?? 2600),
			burstDuration: Math.max(40, t.burstDuration ?? 140),
			speed: Math.max(.1, t.speed ?? 1),
			zIndex: t.zIndex ?? 20,
			skipGreeting: t.skipGreeting,
			classNames: t.classNames,
			styles: t.styles
		}, this.options.burstIntervalMax < this.options.burstIntervalMin && (this.options.burstIntervalMax = this.options.burstIntervalMin), this.target = t.target, this.container = t.container, this.burstTimer = a(this.options.burstIntervalMin, this.options.burstIntervalMax), this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let n = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !0,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!n) throw Error("WebGL2 is required but not available.");
		this.gl = n, this.ribbonProgram = i(n, f, l), this.pointProgram = i(n, d, u), this.layers.push(this.createRibbonLayer({
			halfWidth: this.options.outerWidth,
			shift: 0,
			color: g,
			intensity: .22
		}), this.createRibbonLayer({
			halfWidth: this.options.rgbWidth,
			shift: -4.5,
			color: _,
			intensity: .72
		}), this.createRibbonLayer({
			halfWidth: this.options.rgbWidth,
			shift: 4.5,
			color: v,
			intensity: .72
		}), this.createRibbonLayer({
			halfWidth: this.options.rgbWidth,
			shift: 0,
			color: h,
			intensity: .86
		}));
		let r = n.createVertexArray(), o = n.createBuffer(), s = n.createBuffer(), c = n.createBuffer(), p = n.createBuffer();
		if (!r || !o || !s || !c || !p) throw Error("Failed to create glitch-aura fragment geometry");
		this.fragmentVao = r, this.fragmentPos = o, this.fragmentSize = s, this.fragmentAlpha = c, this.fragmentColor = p, n.bindVertexArray(r), n.bindBuffer(n.ARRAY_BUFFER, o);
		let m = n.getAttribLocation(this.pointProgram, "aPosition");
		n.enableVertexAttribArray(m), n.vertexAttribPointer(m, 2, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, s);
		let y = n.getAttribLocation(this.pointProgram, "aSize");
		n.enableVertexAttribArray(y), n.vertexAttribPointer(y, 1, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, c);
		let b = n.getAttribLocation(this.pointProgram, "aAlpha");
		n.enableVertexAttribArray(b), n.vertexAttribPointer(b, 1, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, p);
		let x = n.getAttribLocation(this.pointProgram, "aColor");
		n.enableVertexAttribArray(x), n.vertexAttribPointer(x, 3, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.uRibbonRes = n.getUniformLocation(this.ribbonProgram, "uResolution"), this.uRibbonOffset = n.getUniformLocation(this.ribbonProgram, "uOffset"), this.uRibbonTime = n.getUniformLocation(this.ribbonProgram, "uTime"), this.uRibbonBurst = n.getUniformLocation(this.ribbonProgram, "uBurst"), this.uRibbonColor = n.getUniformLocation(this.ribbonProgram, "uColor"), this.uRibbonIntensity = n.getUniformLocation(this.ribbonProgram, "uIntensity"), this.uPointRes = n.getUniformLocation(this.pointProgram, "uResolution"), this.uPointDpr = n.getUniformLocation(this.pointProgram, "uPixelRatio"), this.seedFragments(), this.options.skipGreeting || e("agent-aura");
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
			speed: a(.005, .055),
			offset: a(-8, 28),
			size: a(2, 9),
			alpha: a(.12, .8),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2,
			channel: Math.floor(Math.random() * 3)
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
				let n = e / t, r = this.sample(n), c = r.point.x + r.normal.x * i.shift, l = r.point.y + r.normal.y * i.shift, u = c - r.normal.x * i.halfWidth, d = l - r.normal.y * i.halfWidth, f = c + r.normal.x * i.halfWidth, p = l + r.normal.y * i.halfWidth, m = e * 2;
				a[m * 2] = u, a[m * 2 + 1] = d, a[(m + 1) * 2] = f, a[(m + 1) * 2 + 1] = p, o[m] = n, o[m + 1] = n, s[m] = -1, s[m + 1] = 1;
			}
			e.bindBuffer(e.ARRAY_BUFFER, i.pos), e.bufferData(e.ARRAY_BUFFER, a, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.prog), e.bufferData(e.ARRAY_BUFFER, o, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, i.side), e.bufferData(e.ARRAY_BUFFER, s, e.DYNAMIC_DRAW), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, i.idx), e.bufferData(e.ELEMENT_ARRAY_BUFFER, r, e.STATIC_DRAW), i.indexCount = r.length;
		}
		e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
	}
	updateBurst(e) {
		this.burstTimer -= e * 1e3 * this.options.speed, this.burstTimer <= 0 && (this.burst = 1, this.burstTimer = a(this.options.burstIntervalMin, this.options.burstIntervalMax)), this.burst > 0 && (this.burst = Math.max(0, this.burst - e * 1e3 * this.options.speed / this.options.burstDuration));
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
		let r = this.fragmentData.length, i = new Float32Array(r * 2), o = new Float32Array(r), s = new Float32Array(r), c = new Float32Array(r * 3);
		for (let n = 0; n < r; n++) {
			let r = this.fragmentData[n];
			r.t += t * r.speed * this.options.speed;
			let l = this.sample(r.t), u = Math.sin(e * 17 + r.phase), d = Math.cos(e * 7.5 + r.phase2), f = this.burst * a(15, 60), g = r.offset + u * 8 + f, _ = d * (5 + this.burst * 25), v = Math.abs(u) > .88 ? d * 18 : 0;
			i[n * 2] = l.point.x + l.normal.x * g + l.tangent.x * _ + v, i[n * 2 + 1] = l.point.y + l.normal.y * g + l.tangent.y * _, o[n] = r.size * (.55 + Math.abs(u) * 1.2 + this.burst * 1.4);
			let y = Math.random() > .16 ? 1 : .05;
			s[n] = r.alpha * y * (.5 + this.burst * .8);
			let b = r.channel === 0 ? p : r.channel === 1 ? m : h;
			c[n * 3] = b[0], c[n * 3 + 1] = b[1], c[n * 3 + 2] = b[2];
		}
		let l = this.gl;
		l.useProgram(this.pointProgram), l.uniform2f(this.uPointRes, n.width, n.height), l.uniform1f(this.uPointDpr, this.pixelRatio), l.bindVertexArray(this.fragmentVao), l.bindBuffer(l.ARRAY_BUFFER, this.fragmentPos), l.bufferData(l.ARRAY_BUFFER, i, l.DYNAMIC_DRAW), l.bindBuffer(l.ARRAY_BUFFER, this.fragmentSize), l.bufferData(l.ARRAY_BUFFER, o, l.DYNAMIC_DRAW), l.bindBuffer(l.ARRAY_BUFFER, this.fragmentAlpha), l.bufferData(l.ARRAY_BUFFER, s, l.DYNAMIC_DRAW), l.bindBuffer(l.ARRAY_BUFFER, this.fragmentColor), l.bufferData(l.ARRAY_BUFFER, c, l.DYNAMIC_DRAW), l.drawArrays(l.POINTS, 0, r), l.bindVertexArray(null);
	}
};
//#endregion
//#region src/entries/glitch.ts
function b(e, t) {
	return y.attach(e, t);
}
//#endregion
export { y as n, b as t };
