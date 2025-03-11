/***************************************************
 * semdiag: draw SEM path diagram interactively    *
 * Authors: Yujiao Mai, Zhiyong Zhang, Ke-Hai Yuan *
 * Copyright 2015-2015, psychstat.org              *
 * Licensed under the MIT License (MIT)            *
 * Current software version 1.0                    *
 * Support email for questions zzhang4@nd.edu      *
 *                             ymai@nd.edu         *
 ***************************************************/
 function interP_2lines(a, b, c, d, e, f) {
    var g = a * e - d * b;
    if (0 === g) return { numsolution: 0, interP: {} };
    var h = (b * f - c * e) / (a * e - d * b),
        i = (d * c - a * f) / (a * e - d * b);
    return { numsolution: 1, interP: { x: h, y: i } };
}
function calculate_theta(a, b) {
    var c = 0,
        d = b.x - a.x,
        e = b.y - a.y,
        f = Math.abs(d),
        g = Math.abs(e),
        h = Math.atan(g / f);
    return (c = (d >= 0) & (e >= 0) ? h : (d < 0) & (e >= 0) ? Math.PI - h : (d < 0) & (e < 0) ? Math.PI + h : 2 * Math.PI - h);
}
function generatePointsForTriangle(a, b, c, d) {
    var e = { x: a - (c * Math.sqrt(3)) / 2, y: b + c / 2 },
        f = { x: a + (c * Math.sqrt(3)) / 2, y: b + c / 2 },
        g = { x: a, y: b - d };
    return (temp = e.x + "," + e.y + " " + f.x + "," + f.y + " " + g.x + "," + g.y + " " + e.x + "," + e.y), { p1: e, p2: f, p3: g };
}
function generatePointsForDiamond(a, b, c, d) {
    var e = { x: a - c, y: b },
        f = { x: a, y: b - d },
        g = { x: a + c, y: b },
        h = { x: a, y: b + d };
    return (temp = e.x + "," + e.y + " " + f.x + "," + f.y + " " + g.x + "," + g.y + " " + h.x + "," + h.y + " " + e.x + "," + e.y), { p1: e, p2: f, p3: g, p4: h };
}
function generatePointsForHexagon(a, b, c, d) {
    var e = { x: a - c, y: b },
        f = { x: a - c / 2, y: b - (d * Math.sqrt(3)) / 2 },
        g = { x: a + c / 2, y: b - (d * Math.sqrt(3)) / 2 },
        h = { x: a + c, y: b },
        i = { x: a + c / 2, y: b + (d * Math.sqrt(3)) / 2 },
        j = { x: a - c / 2, y: b + (d * Math.sqrt(3)) / 2 };
    return (temp = e.x + "," + e.y + " " + f.x + "," + f.y + " " + g.x + "," + g.y + " " + h.x + "," + h.y + " " + i.x + "," + i.y + " " + j.x + "," + j.y + " " + e.x + "," + e.y), { p1: e, p2: f, p3: g, p4: h, p5: i, p6: j };
}
function calculate_angles_of_triangle(a, b, c) {
    var d = 0.25 * Math.PI,
        e = 0.25 * Math.PI,
        f = 0.5 * Math.PI,
        g = !0,
        h = !1,
        i = { P1: a, P2: c },
        l = {},
        m = {},
        n = {};
    if (i.P2.x === i.P1.x) (l = { A: 1, B: 0, C: -i.P1.x }), (m = { A: 0, B: 1, C: -b.y });
    else {
        var o = (i.P2.y - i.P1.y) / (i.P2.x - i.P1.x);
        l = { A: o, B: -1, C: i.P1.y - o * i.P1.x };
        var p = Math.atan(o) - (1 * Math.PI) / 2,
            q = Math.tan(p);
        m = { A: q, B: -1, C: b.y - q * b.x };
    }
    var r = interP_2lines(l.A, l.B, l.C, m.A, m.B, m.C);
    if (1 === r.numsolution) {
        (h = !0), (n = r.interP);
        var s = Math.sqrt((n.x - b.x) * (n.x - b.x) + (n.y - b.y) * (n.y - b.y)),
            t = Math.sqrt((n.x - a.x) * (n.x - a.x) + (n.y - a.y) * (n.y - a.y)),
            u = Math.sqrt((n.x - c.x) * (n.x - c.x) + (n.y - c.y) * (n.y - c.y));
        a.x === c.x
            ? (n.y === a.y
                  ? ((d = Math.atan(s / t)), (e = Math.PI / 2))
                  : n.y === c.y
                  ? ((d = Math.PI / 2), (e = Math.atan(s / u)))
                  : (n.y > a.y) & (n.y < c.y) || (n.y > c.y) & (n.y < a.y)
                  ? ((d = Math.atan(s / t)), (e = Math.atan(s / u)))
                  : c.y >= a.y
                  ? n.y < a.y
                      ? ((d = Math.PI - Math.atan(s / t)), (e = Math.atan(s / u)))
                      : ((d = Math.atan(s / t)), (e = Math.PI - Math.atan(s / u)))
                  : n.y > a.y
                  ? ((d = Math.PI - Math.atan(s / t)), (e = Math.atan(s / u)))
                  : ((d = Math.atan(s / t)), (e = Math.PI - Math.atan(s / u))),
              (g = c.y <= a.y ? b.x >= n.x : b.x <= n.x))
            : (n.x === a.x
                  ? ((d = Math.atan(s / t)), (e = Math.PI / 2))
                  : n.x === c.x
                  ? ((d = Math.PI / 2), (e = Math.atan(s / u)))
                  : (n.x > a.x) & (n.x < c.x) || (n.x > c.x) & (n.x < a.x)
                  ? ((d = Math.atan(s / t)), (e = Math.atan(s / u)))
                  : c.x >= a.x
                  ? n.x < a.x
                      ? ((d = Math.PI - Math.atan(s / t)), (e = Math.atan(s / u)))
                      : ((d = Math.atan(s / t)), (e = Math.PI - Math.atan(s / u)))
                  : n.x > a.x
                  ? ((d = Math.PI - Math.atan(s / t)), (e = Math.atan(s / u)))
                  : ((d = Math.atan(s / t)), (e = Math.PI - Math.atan(s / u))),
              (g = c.x >= a.x ? b.y >= n.y : b.y <= n.y)),
            (f = Math.PI - d - e);
    }
    return { Is_success: h, angle_P0: d, angle_P2: e, angle_P1: f, angle_anticlockwise: g };
}
