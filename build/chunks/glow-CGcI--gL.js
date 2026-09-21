/*! agent-aura v1.1.0 | MIT | https://github.com/wangmiaozero/agent-aura */
import { a as e, i as t, n, t as r } from "./program-CIs-YzNM.js";
//#region src/gl/geometry.ts
function i(e, t, n, r) {
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
var a = "#version 300 es\nprecision lowp float;\nin vec2 vUV;\nout vec4 outColor;\nuniform vec2 uResolution;\nuniform float uTime;\nuniform float uBorderWidth;\nuniform float uGlowWidth;\nuniform float uBorderRadius;\nuniform vec3 uColors[4];\nuniform float uGlowExponent;\nuniform float uGlowFactor;\nconst float PI = 3.14159265359;\nconst float TWO_PI = 2.0 * PI;\nconst float HALF_PI = 0.5 * PI;\nconst vec4 startPositions = vec4(0.0, PI, HALF_PI, 1.5 * PI);\nconst vec4 speeds = vec4(-1.9, -1.9, -1.5, 2.1);\nconst vec4 innerRadius = vec4(PI * 0.8, PI * 0.7, PI * 0.3, PI * 0.1);\nconst vec4 outerRadius = vec4(PI * 1.2, PI * 0.9, PI * 0.6, PI * 0.4);\nfloat random(vec2 st) {\nreturn fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\n}\nvec2 random2(vec2 st) {\nreturn vec2(random(st), random(st + 1.0));\n}\nfloat aaStep(float edge, float d) {\nfloat width = fwidth(d);\nreturn smoothstep(edge - width * 0.5, edge + width * 0.5, d);\n}\nfloat aaFract(float x) {\nfloat f = fract(x);\nfloat w = fwidth(x);\nfloat smooth_f = f * (1.0 - smoothstep(1.0 - w, 1.0, f));\nreturn smooth_f;\n}\nfloat sdRoundedBox(in vec2 p, in vec2 b, in float r) {\nvec2 q = abs(p) - b + r;\nreturn min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;\n}\nfloat getInnerGlow(vec2 p, vec2 b, float radius) {\nfloat dist_x = b.x - abs(p.x);\nfloat dist_y = b.y - abs(p.y);\nfloat glow_x = smoothstep(radius, 0.0, dist_x);\nfloat glow_y = smoothstep(radius, 0.0, dist_y);\nreturn 1.0 - (1.0 - glow_x) * (1.0 - glow_y);\n}\nfloat getVignette(vec2 uv) {\nvec2 vignetteUv = uv;\nvignetteUv = vignetteUv * (1.0 - vignetteUv);\nfloat vignette = vignetteUv.x * vignetteUv.y * 25.0;\nvignette = pow(vignette, 0.16);\nvignette = 1.0 - vignette;\nreturn vignette;\n}\nfloat uvToAngle(vec2 uv) {\nvec2 center = vec2(0.5);\nvec2 dir = uv - center;\nreturn atan(dir.y, dir.x) + PI;\n}\nvoid main() {\nvec2 uv = vUV;\nvec2 pos = uv * uResolution;\nvec2 centeredPos = pos - uResolution * 0.5;\nvec2 size = uResolution - uBorderWidth;\nvec2 halfSize = size * 0.5;\nfloat dBorderBox = sdRoundedBox(centeredPos, halfSize, uBorderRadius);\nfloat border = aaStep(0.0, dBorderBox);\nfloat glow = getInnerGlow(centeredPos, halfSize, uGlowWidth);\nfloat vignette = getVignette(uv);\nglow *= vignette;\nfloat posAngle = uvToAngle(uv);\nvec4 lightCenter = mod(startPositions + speeds * uTime, TWO_PI);\nvec4 angleDist = abs(posAngle - lightCenter);\nvec4 disToLight = min(angleDist, TWO_PI - angleDist) / TWO_PI;\nfloat intensityBorder[4];\nintensityBorder[0] = 1.0;\nintensityBorder[1] = smoothstep(0.4, 0.0, disToLight.y);\nintensityBorder[2] = smoothstep(0.4, 0.0, disToLight.z);\nintensityBorder[3] = smoothstep(0.2, 0.0, disToLight.w) * 0.5;\nvec3 borderColor = vec3(0.0);\nfor(int i = 0; i < 4; i++) {\nborderColor = mix(borderColor, uColors[i], intensityBorder[i]);\n}\nborderColor *= 1.1;\nborderColor = clamp(borderColor, 0.0, 1.0);\nfloat intensityGlow[4];\nintensityGlow[0] = smoothstep(0.9, 0.0, disToLight.x);\nintensityGlow[1] = smoothstep(0.7, 0.0, disToLight.y);\nintensityGlow[2] = smoothstep(0.4, 0.0, disToLight.z);\nintensityGlow[3] = smoothstep(0.1, 0.0, disToLight.w) * 0.7;\nvec4 breath = smoothstep(0.0, 1.0, sin(uTime * 1.0 + startPositions * PI) * 0.2 + 0.8);\nvec3 glowColor = vec3(0.0);\nglowColor += uColors[0] * intensityGlow[0] * breath.x;\nglowColor += uColors[1] * intensityGlow[1] * breath.y;\nglowColor += uColors[2] * intensityGlow[2] * breath.z;\nglowColor += uColors[3] * intensityGlow[3] * breath.w * glow;\nglow = pow(glow, uGlowExponent);\nglow *= random(pos + uTime) * 0.1 + 1.0;\nglowColor *= glow * uGlowFactor;\nglowColor = clamp(glowColor, 0.0, 1.0);\nvec3 color = mix(glowColor, borderColor + glowColor * 0.2, border);\nfloat alpha = mix(glow, 1.0, border);\noutColor = vec4(color, alpha);\n}", o = "#version 300 es\nin vec2 aPosition;\nin vec2 aUV;\nout vec2 vUV;\nvoid main() {\nvUV = aUV;\ngl_Position = vec4(aPosition, 0.0, 1.0);\n}", s = [
	"rgb(57, 182, 255)",
	"rgb(189, 69, 251)",
	"rgb(255, 87, 51)",
	"rgb(255, 214, 0)"
];
function c(e) {
	let t = e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (!t) throw Error(`Invalid color format: ${e}`);
	let [, n, r, i] = t;
	return [
		parseInt(n) / 255,
		parseInt(r) / 255,
		parseInt(i) / 255
	];
}
var l = class l {
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
	static attach(e, r = {}) {
		let i = t(e);
		n(i);
		let a = new l({
			...r,
			styles: {
				position: "absolute",
				inset: "0",
				width: "100%",
				height: "100%",
				...r.styles
			}
		});
		return i.appendChild(a.element), a.autoResize(i), a.start(), a;
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
		let { gl: r, program: a, vao: o, positionBuffer: s, uvBuffer: c, uResolution: l } = this.glr, u = n ?? this.options.ratio ?? window.devicePixelRatio ?? 1, d = Math.max(1, Math.floor(e * u)), f = Math.max(1, Math.floor(t * u));
		this.canvas.style.width = `${e}px`, this.canvas.style.height = `${t}px`, (this.canvas.width !== d || this.canvas.height !== f) && (this.canvas.width = d, this.canvas.height = f), r.viewport(0, 0, this.canvas.width, this.canvas.height), this.checkGLError(r, "resize: after viewport setup");
		let { positions: p, uvs: m } = i(this.canvas.width, this.canvas.height, this.options.borderWidth * u, this.options.glowWidth * u);
		r.bindVertexArray(o), r.bindBuffer(r.ARRAY_BUFFER, s), r.bufferData(r.ARRAY_BUFFER, p, r.STATIC_DRAW);
		let h = r.getAttribLocation(a, "aPosition");
		r.enableVertexAttribArray(h), r.vertexAttribPointer(h, 2, r.FLOAT, !1, 0, 0), this.checkGLError(r, "resize: after position buffer update"), r.bindBuffer(r.ARRAY_BUFFER, c), r.bufferData(r.ARRAY_BUFFER, m, r.STATIC_DRAW);
		let g = r.getAttribLocation(a, "aUV");
		r.enableVertexAttribArray(g), r.vertexAttribPointer(g, 2, r.FLOAT, !1, 0, 0), this.checkGLError(r, "resize: after UV buffer update"), r.useProgram(a), r.uniform2f(l, this.canvas.width, this.canvas.height), r.uniform1f(this.glr.uBorderWidth, this.options.borderWidth * u), r.uniform1f(this.glr.uGlowWidth, this.options.glowWidth * u), r.uniform1f(this.glr.uBorderRadius, this.options.borderRadius * u), this.checkGLError(r, "resize: after uniform updates");
		let _ = performance.now();
		this.lastTime = _;
		let v = (_ - this.startTime) * .001;
		this.render(v);
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
		let t = r(e, o, a);
		this.checkGLError(e, "setupGL: after createProgram");
		let n = e.createVertexArray();
		e.bindVertexArray(n), this.checkGLError(e, "setupGL: after VAO creation");
		let { positions: l, uvs: u } = i(this.canvas.width || 2, this.canvas.height || 2, this.options.borderWidth, this.options.glowWidth), d = e.createBuffer();
		e.bindBuffer(e.ARRAY_BUFFER, d), e.bufferData(e.ARRAY_BUFFER, l, e.STATIC_DRAW);
		let f = e.getAttribLocation(t, "aPosition");
		e.enableVertexAttribArray(f), e.vertexAttribPointer(f, 2, e.FLOAT, !1, 0, 0), this.checkGLError(e, "setupGL: after position buffer setup");
		let p = e.createBuffer();
		e.bindBuffer(e.ARRAY_BUFFER, p), e.bufferData(e.ARRAY_BUFFER, u, e.STATIC_DRAW);
		let m = e.getAttribLocation(t, "aUV");
		e.enableVertexAttribArray(m), e.vertexAttribPointer(m, 2, e.FLOAT, !1, 0, 0), this.checkGLError(e, "setupGL: after UV buffer setup");
		let h = e.getUniformLocation(t, "uResolution"), g = e.getUniformLocation(t, "uTime"), _ = e.getUniformLocation(t, "uBorderWidth"), v = e.getUniformLocation(t, "uGlowWidth"), y = e.getUniformLocation(t, "uBorderRadius"), b = e.getUniformLocation(t, "uColors"), x = e.getUniformLocation(t, "uGlowExponent"), S = e.getUniformLocation(t, "uGlowFactor");
		e.useProgram(t), e.uniform1f(_, this.options.borderWidth), e.uniform1f(v, this.options.glowWidth), e.uniform1f(y, this.options.borderRadius), this.options.mode === "dark" ? (e.uniform1f(x, 2), e.uniform1f(S, 1.8)) : (e.uniform1f(x, 1), e.uniform1f(S, 1));
		let C = (this.options.colors || s).map(c);
		for (let n = 0; n < C.length; n++) e.uniform3f(e.getUniformLocation(t, `uColors[${n}]`), ...C[n]);
		this.checkGLError(e, "setupGL: after uniform setup"), e.bindVertexArray(null), e.bindBuffer(e.ARRAY_BUFFER, null), this.glr = {
			gl: e,
			program: t,
			vao: n,
			positionBuffer: d,
			uvBuffer: p,
			uResolution: h,
			uTime: g,
			uBorderWidth: _,
			uGlowWidth: v,
			uBorderRadius: y,
			uColors: b
		};
	}
	render(e) {
		if (!this.glr) return;
		let { gl: t, program: n, vao: r, uTime: i } = this.glr;
		t.useProgram(n), t.bindVertexArray(r), t.uniform1f(i, e), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.disable(t.BLEND), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.drawArrays(t.TRIANGLES, 0, 24), this.checkGLError(t, "render: after draw call"), t.bindVertexArray(null);
	}
	greet() {
		e("agent-aura");
	}
};
//#endregion
//#region src/entries/glow.ts
function u(e, t) {
	return l.attach(e, t);
}
//#endregion
export { l as n, u as t };
