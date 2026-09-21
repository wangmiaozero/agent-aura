/*! agent-aura v1.1.0 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, r, t as i } from "./program-CIs-YzNM.js";
//#region src/motion-border/shaders/fragment.glsl
var a = "#version 300 es\nprecision highp float;\nin vec2 vUv;\nout vec4 outColor;\nuniform float uTime;\nuniform vec2 uResolution;\nuniform vec2 uCardSize;\nuniform float uBorderWidth;\nuniform float uGlowWidth;\nuniform float uRadius;\n#define PI 3.14159265359\n#define TAU 6.28318530718\nfloat sdRoundBox(vec2 p, vec2 halfSize, float radius) {\nvec2 q = abs(p) - halfSize + radius;\nreturn min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;\n}\nfloat angularDistance(float a, float b) {\nfloat d = abs(a - b);\nreturn min(d, TAU - d);\n}\nfloat movingLight(float angle, float center, float width) {\nfloat d = angularDistance(angle, center);\nreturn 1.0 - smoothstep(0.0, width, d);\n}\nfloat hash(vec2 p) {\nreturn fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\n}\nvoid main() {\nvec2 pixel = vUv * uResolution;\nvec2 p = pixel - uResolution * 0.5;\nvec2 halfCard = uCardSize * 0.5;\nfloat d = sdRoundBox(p, halfCard, uRadius);\nfloat dist = abs(d);\nfloat aa = max(fwidth(d), 0.8);\nfloat border = 1.0 - smoothstep(uBorderWidth, uBorderWidth + aa, dist);\nfloat glow = exp(-pow(dist / uGlowWidth, 1.45) * 3.1);\nif (d > 0.0) {\nglow *= 0.78;\n}\nif (d < -uGlowWidth * 1.55) {\nglow *= 1.0 - smoothstep(uGlowWidth * 1.55, uGlowWidth * 2.3, -d);\n}\nfloat angle = mod(atan(p.y, p.x) + TAU, TAU);\nfloat time = uTime;\nfloat l1 = movingLight(angle, mod(0.20 - time * 0.52, TAU), 2.4);\nfloat l2 = movingLight(angle, mod(2.70 - time * 0.43, TAU), 1.8);\nfloat l3 = movingLight(angle, mod(4.30 + time * 0.38, TAU), 1.25);\nfloat l4 = movingLight(angle, mod(5.40 + time * 0.61, TAU), 0.72);\nvec3 cyan = vec3(0.20, 0.72, 1.0);\nvec3 purple = vec3(0.72, 0.25, 1.0);\nvec3 orange = vec3(1.0, 0.24, 0.10);\nvec3 yellow = vec3(1.0, 0.78, 0.10);\nvec3 glowColor = cyan * l1 + purple * l2 * 0.92 + orange * l3 * 0.78 + yellow * l4 * 0.72;\nglowColor *= 0.82 + sin(time * 1.35) * 0.10;\nvec3 borderColor = cyan * 0.42 + glowColor * 0.78;\nfloat whiteLight = movingLight(angle, mod(time * 1.05, TAU), 0.18);\nvec3 whiteEnergy = vec3(0.82, 0.96, 1.0) * whiteLight;\nborderColor += whiteEnergy * 1.6;\nglowColor += whiteEnergy * 0.55;\nfloat noise = hash(floor(pixel * 0.45) + floor(time * 14.0));\nglowColor *= 0.94 + noise * 0.06;\nvec3 finalColor = glowColor * glow * 0.72;\nfinalColor = mix(finalColor, borderColor + glowColor * 0.32, border);\nfloat alpha = glow * 0.48 + border * 0.92;\nalpha += whiteLight * glow * 0.24;\nfloat farFade = 1.0 - smoothstep(uGlowWidth * 1.05, uGlowWidth * 1.75, dist);\nalpha *= farFade;\nalpha = clamp(alpha, 0.0, 1.0);\nfinalColor = clamp(finalColor, 0.0, 1.25);\noutColor = vec4(finalColor, alpha);\n}", o = "#version 300 es\nin vec2 aPosition;\nout vec2 vUv;\nvoid main() {\nvUv = aPosition * 0.5 + 0.5;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", s = new Float32Array([
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
]), c = class c {
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
	static attach(e, i = {}) {
		let a = t(e), { container: o, ...s } = i, l = r(o) ?? (a.parentElement && a.parentElement !== document.body ? a.parentElement : void 0);
		l && n(l);
		let u = new c({
			...s,
			target: a,
			container: l
		});
		return (l ?? document.body).appendChild(u.element), u.start(), u;
	}
	constructor(t = {}) {
		this.options = {
			glowPadding: t.glowPadding ?? 110,
			borderWidth: t.borderWidth ?? 2.2,
			glowWidth: t.glowWidth ?? 115,
			borderRadius: t.borderRadius ?? 28,
			speed: t.speed ?? 1,
			zIndex: t.zIndex ?? 10,
			skipGreeting: t.skipGreeting,
			classNames: t.classNames,
			styles: t.styles
		}, this.target = t.target, this.container = t.container, this.canvas = document.createElement("canvas"), this.options.classNames && (this.canvas.className = this.options.classNames), this.canvas.style.display = "block", this.canvas.style.pointerEvents = "none", this.canvas.style.background = "transparent", this.canvas.style.zIndex = String(this.options.zIndex), this.canvas.style.transform = "translateZ(0)", this.applyCanvasLayout(), this.options.styles && Object.assign(this.canvas.style, this.options.styles), this.element = this.canvas;
		let n = this.canvas.getContext("webgl2", {
			alpha: !0,
			antialias: !1,
			premultipliedAlpha: !1,
			powerPreference: "high-performance"
		});
		if (!n) throw Error("WebGL2 is required but not available.");
		this.gl = n, this.program = i(n, o, a);
		let r = n.createVertexArray(), c = n.createBuffer();
		if (!r || !c) throw Error("Failed to create motion border geometry");
		this.vao = r, this.buffer = c, n.bindVertexArray(r), n.bindBuffer(n.ARRAY_BUFFER, c), n.bufferData(n.ARRAY_BUFFER, s, n.STATIC_DRAW);
		let l = n.getAttribLocation(this.program, "aPosition");
		n.enableVertexAttribArray(l), n.vertexAttribPointer(l, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.uTime = n.getUniformLocation(this.program, "uTime"), this.uResolution = n.getUniformLocation(this.program, "uResolution"), this.uCardSize = n.getUniformLocation(this.program, "uCardSize"), this.uBorderWidth = n.getUniformLocation(this.program, "uBorderWidth"), this.uGlowWidth = n.getUniformLocation(this.program, "uGlowWidth"), this.uRadius = n.getUniformLocation(this.program, "uRadius"), this.options.skipGreeting || e("agent-aura");
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
};
//#endregion
//#region src/entries/border.ts
function l(e, t) {
	return c.attach(e, t);
}
//#endregion
export { c as n, l as t };
