/*! agent-aura v1.1.1 | MIT | https://github.com/wangmiaozero/agent-aura */
//#region src/thunder/path.ts
function e(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function t(t, n, r) {
	let i = getComputedStyle(t), a = parseFloat(i.borderTopLeftRadius);
	return i.borderRadius.includes("%") ? Math.min(n, r) / 2 : e(a || 0, 0, Math.min(n, r) / 2);
}
function n(e, t, n, r, i) {
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
function r(e, t) {
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
function i(t, n, r, i, a, o, s) {
	let c = t - o, l = t + r + o, u = n - o, d = n + i + o, f = e(a + o, 0, Math.min(r, i) / 2 + o), p = [], m = (e, t, n, r) => {
		for (let i = 0; i <= s; i++) {
			let a = n + (r - n) * (i / s);
			p.push({
				x: e + Math.cos(a) * f,
				y: t + Math.sin(a) * f
			});
		}
	};
	return m(c + f, u + f, Math.PI, Math.PI * 1.5), m(l - f, u + f, Math.PI * 1.5, Math.PI * 2), m(l - f, d - f, 0, Math.PI * .5), m(c + f, d - f, Math.PI * .5, Math.PI), p;
}
function a(e, a, o, s, c) {
	let l = e.getBoundingClientRect(), u = l.left - a, d = l.top - o, f = n(getComputedStyle(e).clipPath, u, d, l.width, l.height);
	if (f) return r(f, s);
	let p = t(e, l.width, l.height);
	return i(u, d, l.width, l.height, p, s, c);
}
function o(e) {
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
function s(e, t) {
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
function c(e, t) {
	let n = Math.cos(t), r = Math.sin(t);
	return {
		x: e.x * n - e.y * r,
		y: e.x * r + e.y * n
	};
}
function l(e, t) {
	return e + Math.random() * (t - e);
}
//#endregion
export { c as a, l as i, a as n, s as r, o as t };
