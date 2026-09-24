/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-C-xRtUiz.js";
import { i as a, n as o, r as s, t as c } from "./path-A-tRBNDQ.js";
//#region src/shape-field/shaders/line.frag.glsl
var l = "precision highp float;\nuniform float uTime;\nuniform float uOpacity;\nuniform float uMode;\nuniform vec3 uColor1;\nuniform vec3 uColor2;\nuniform vec3 uColor3;\nuniform vec3 uColor4;\nvarying float vProgress;\nfloat distanceLoop(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, 1.0 - d);\n}\nfloat lightBand(float p, float center, float width) {\nfloat d = distanceLoop(p, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nvoid main() {\nfloat time = uTime;\nfloat e1 = lightBand(vProgress, fract(time * 0.052), 0.24);\nfloat e2 = lightBand(vProgress, fract(0.30 - time * 0.039), 0.16);\nfloat e3 = lightBand(vProgress, fract(0.67 + time * 0.028), 0.09);\nfloat e4 = lightBand(vProgress, fract(0.88 - time * 0.075), 0.035);\nfloat wave = sin(vProgress * 40.0 - time * 2.5);\nfloat shimmer = 0.88 + wave * 0.12;\nvec3 color = uColor1 * 0.22;\ncolor += uColor2 * e1 * 0.72;\ncolor += uColor3 * e2 * 0.68;\ncolor += uColor2 * e3 * 0.44;\ncolor += uColor4 * e4 * 1.35;\nif (uMode < 0.5) {\ncolor *= 0.90 + sin(vProgress * 22.0 + time * 3.0) * 0.08;\n}\nif (uMode > 1.5) {\ncolor *= 0.82 + abs(sin(vProgress * 17.0 - time * 4.5)) * 0.23;\n}\ncolor *= shimmer;\nfloat alpha = 0.23 + e1 * 0.28 + e2 * 0.24 + e3 * 0.18 + e4 * 0.72;\ngl_FragColor = vec4(color, alpha * uOpacity);\n}", u = "precision highp float;\nuniform vec2 uResolution;\nattribute vec2 aPosition;\nattribute float aProgress;\nvarying float vProgress;\nvoid main() {\nvProgress = aProgress;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\n}", d = "precision highp float;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvec2 uv = gl_PointCoord - 0.5;\nfloat d = length(uv);\nfloat soft = 1.0 - smoothstep(0.02, 0.5, d);\nfloat core = 1.0 - smoothstep(0.0, 0.13, d);\nvec3 color = vColor + vec3(core * 0.18);\ngl_FragColor = vec4(color, soft * vAlpha);\n}", f = "precision highp float;\nuniform vec2 uResolution;\nuniform float uPixelRatio;\nattribute vec2 aPosition;\nattribute float aSize;\nattribute float aAlpha;\nattribute vec3 aColor;\nvarying float vAlpha;\nvarying vec3 vColor;\nvoid main() {\nvAlpha = aAlpha;\nvColor = aColor;\nvec2 clip = vec2(\n(aPosition.x / uResolution.x) * 2.0 - 1.0,\n1.0 - (aPosition.y / uResolution.y) * 2.0\n);\ngl_Position = vec4(clip, 0.0, 1.0);\ngl_PointSize = aSize * uPixelRatio;\n}";
//#endregion
//#region src/shape-field/themes.ts
function p(e) {
	return [
		(e >> 16 & 255) / 255,
		(e >> 8 & 255) / 255,
		(e & 255) / 255
	];
}
var m = {
	water: {
		lineColors: [
			p(4643327),
			p(1476863),
			p(10483967),
			p(16777215)
		],
		fieldA: p(949708),
		fieldB: p(7924479),
		detailA: p(5761279),
		detailB: p(15073279),
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
			p(14125592),
			p(16763989),
			p(16773040),
			p(16777215)
		],
		fieldA: p(11098124),
		fieldB: p(16766573),
		detailA: p(16758062),
		detailB: p(16774606),
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
			p(5966760),
			p(10497279),
			p(15496447),
			p(16509439)
		],
		fieldA: p(2490415),
		fieldB: p(10492110),
		detailA: p(8065752),
		detailB: p(16740572),
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
function h(e, t, n) {
	let r = Math.max(0, Math.min(1, n));
	return [
		e[0] + (t[0] - e[0]) * r,
		e[1] + (t[1] - e[1]) * r,
		e[2] + (t[2] - e[2]) * r
	];
}
//#endregion
//#region src/shape-field/ShapeFieldAura.ts
var g = [
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
], _ = class p {
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
		this.mode = t.mode ?? "water", this.options = {
			offset: Math.max(0, t.offset ?? 7),
			cornerSegments: Math.max(4, Math.round(t.cornerSegments ?? 20)),
			pathSamples: Math.max(32, Math.round(t.pathSamples ?? 420)),
			fieldCount: Math.max(0, Math.round(t.fieldCount ?? 180)),
			detailCount: Math.max(0, Math.round(t.detailCount ?? 110)),
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
		this.gl = n, this.lineProgram = i(n, u, l), this.pointProgram = i(n, f, d);
		for (let e of g) {
			let t = n.createVertexArray(), r = n.createBuffer(), i = n.createBuffer();
			if (!t || !r || !i) throw Error("Failed to create shape-field line geometry");
			n.bindVertexArray(t), n.bindBuffer(n.ARRAY_BUFFER, r);
			let a = n.getAttribLocation(this.lineProgram, "aPosition");
			n.enableVertexAttribArray(a), n.vertexAttribPointer(a, 2, n.FLOAT, !1, 0, 0), n.bindBuffer(n.ARRAY_BUFFER, i);
			let o = n.getAttribLocation(this.lineProgram, "aProgress");
			n.enableVertexAttribArray(o), n.vertexAttribPointer(o, 1, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.layers.push({
				offset: e.offset,
				baseOpacity: e.opacity,
				vao: t,
				pos: r,
				prog: i,
				count: 0
			});
		}
		let r = n.createVertexArray(), a = n.createBuffer(), o = n.createBuffer(), s = n.createBuffer(), c = n.createBuffer(), p = n.createVertexArray(), m = n.createBuffer(), h = n.createBuffer(), _ = n.createBuffer(), v = n.createBuffer();
		if (!r || !a || !o || !s || !c || !p || !m || !h || !_ || !v) throw Error("Failed to create shape-field particle geometry");
		this.fieldVao = r, this.fieldPos = a, this.fieldSize = o, this.fieldAlpha = s, this.fieldColor = c, this.detailVao = p, this.detailPos = m, this.detailSize = h, this.detailAlpha = _, this.detailColor = v, this.bindPointVao(this.fieldVao, this.fieldPos, this.fieldSize, this.fieldAlpha, this.fieldColor), this.bindPointVao(this.detailVao, this.detailPos, this.detailSize, this.detailAlpha, this.detailColor), this.uLineRes = n.getUniformLocation(this.lineProgram, "uResolution"), this.uLineTime = n.getUniformLocation(this.lineProgram, "uTime"), this.uLineOpacity = n.getUniformLocation(this.lineProgram, "uOpacity"), this.uLineMode = n.getUniformLocation(this.lineProgram, "uMode"), this.uLineColor1 = n.getUniformLocation(this.lineProgram, "uColor1"), this.uLineColor2 = n.getUniformLocation(this.lineProgram, "uColor2"), this.uLineColor3 = n.getUniformLocation(this.lineProgram, "uColor3"), this.uLineColor4 = n.getUniformLocation(this.lineProgram, "uColor4"), this.uPointRes = n.getUniformLocation(this.pointProgram, "uResolution"), this.uPointDpr = n.getUniformLocation(this.pointProgram, "uPixelRatio"), this.seedField(), this.seedDetail(), this.options.skipGreeting || e("agent-aura");
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
		return m[this.mode];
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
			speed: a(e.pathSpeed[0], e.pathSpeed[1]),
			offset: a(e.fieldOffset[0], e.fieldOffset[1]),
			size: a(e.fieldSize[0], e.fieldSize[1]),
			alpha: a(e.fieldAlpha[0], e.fieldAlpha[1]),
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
			speed: a(e.detailSpeed[0], e.detailSpeed[1]),
			offset: a(1, 17),
			size: a(e.detailSize[0], e.detailSize[1]),
			alpha: a(e.detailAlpha[0], e.detailAlpha[1]),
			phase: Math.random() * Math.PI * 2,
			phase2: Math.random() * Math.PI * 2
		});
	}
	rebuild() {
		if (!this.target || this.disposed) return;
		let e = this.viewBox(), t = o(this.target, e.left, e.top, this.options.offset, this.options.cornerSegments);
		this.pathData = c(t), this.uploadLines();
	}
	uploadLines() {
		if (this.pathData.total <= 0) return;
		let e = this.gl, t = this.options.pathSamples;
		for (let n of this.layers) {
			let r = new Float32Array(t * 2), i = new Float32Array(t);
			for (let e = 0; e < t; e++) {
				let a = e / t, o = s(this.pathData, a);
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
		let n = this.theme(), r = this.fieldData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), c = new Float32Array(r * 3);
		for (let l = 0; l < r; l++) {
			let r = this.fieldData[l];
			r.t += t * r.speed * this.options.speed;
			let u = s(this.pathData, r.t), d = Math.sin(e * n.waveSpeed + r.phase), f = Math.sin(e * (n.waveSpeed * .57) + r.phase2), p = Math.cos(e * (n.waveSpeed * 1.37) + r.phase3), m = r.offset + d * n.fieldDrift + p * n.turbulence, g = f * n.turbulence, _ = u.point.x + u.normal.x * m + u.tangent.x * g, v = u.point.y + u.normal.y * m + u.tangent.y * g;
			this.mode === "water" ? v -= Math.sin(r.t * 40 - e * 3) * 4 : this.mode === "immortal" ? v -= (f * .5 + .5) * n.rise : (_ += Math.sin(e * 2.8 + r.phase) * 8, v -= Math.cos(e * 2.2 + r.phase3) * 12), i[l * 2] = _, i[l * 2 + 1] = v, a[l] = r.size * (.72 + (f * .5 + .5) * .46), o[l] = r.alpha * (.55 + (d * .5 + .5) * .45);
			let y = p * .5 + .5, b = h(n.fieldA, n.fieldB, y);
			c[l * 3] = b[0], c[l * 3 + 1] = b[1], c[l * 3 + 2] = b[2];
		}
		this.drawPoints(this.fieldVao, this.fieldPos, this.fieldSize, this.fieldAlpha, this.fieldColor, i, a, o, c, r);
	}
	updateDetail(e, t) {
		if (this.detailData.length === 0 || this.pathData.total <= 0) return;
		let n = this.theme(), r = this.detailData.length, i = new Float32Array(r * 2), a = new Float32Array(r), o = new Float32Array(r), c = new Float32Array(r * 3);
		for (let l = 0; l < r; l++) {
			let r = this.detailData[l];
			r.t += t * r.speed * this.options.speed;
			let u = s(this.pathData, r.t), d = Math.sin(e * 4 + r.phase), f = Math.sin(e * 1.8 + r.phase2), p = r.offset + d * 4, m = u.point.x + u.normal.x * p, g = u.point.y + u.normal.y * p;
			this.mode === "water" ? (g -= f * 7, m += Math.sin(e * 3 + r.phase2) * 3) : this.mode === "immortal" ? g -= (f * .5 + .5) * n.rise : (g -= (f * .5 + .5) * n.rise, m += Math.sin(e * 5 + r.phase) * 8), i[l * 2] = m, i[l * 2 + 1] = g, a[l] = r.size * (.65 + Math.abs(d) * .9), o[l] = r.alpha * (.4 + Math.abs(d) * .6);
			let _ = h(n.detailA, n.detailB, Math.abs(d));
			c[l * 3] = _[0], c[l * 3 + 1] = _[1], c[l * 3 + 2] = _[2];
		}
		this.drawPoints(this.detailVao, this.detailPos, this.detailSize, this.detailAlpha, this.detailColor, i, a, o, c, r);
	}
	drawPoints(e, t, n, r, i, a, o, s, c, l) {
		let u = this.gl, d = this.viewBox();
		u.useProgram(this.pointProgram), u.uniform2f(this.uPointRes, d.width, d.height), u.uniform1f(this.uPointDpr, this.pixelRatio), u.bindVertexArray(e), u.bindBuffer(u.ARRAY_BUFFER, t), u.bufferData(u.ARRAY_BUFFER, a, u.DYNAMIC_DRAW), u.bindBuffer(u.ARRAY_BUFFER, n), u.bufferData(u.ARRAY_BUFFER, o, u.DYNAMIC_DRAW), u.bindBuffer(u.ARRAY_BUFFER, r), u.bufferData(u.ARRAY_BUFFER, s, u.DYNAMIC_DRAW), u.bindBuffer(u.ARRAY_BUFFER, i), u.bufferData(u.ARRAY_BUFFER, c, u.DYNAMIC_DRAW), u.drawArrays(u.POINTS, 0, l), u.bindVertexArray(null);
	}
};
//#endregion
export { _ as t };
