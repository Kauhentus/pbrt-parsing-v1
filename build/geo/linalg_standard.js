"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cross_v = exports.dot_vec4 = exports.dot_vec3 = exports.dot_v = exports.normalize_vec3 = exports.normalize_v = exports.magnitude_vec3 = exports.magnitude_v = exports.squared_distance_v = exports.distance_v = exports.abs_v = exports.max_component_v = exports.max_v = exports.min_v = exports.lerp_v = exports.avg_v = exports.same_v = exports.sdiv_v = exports.smul_vec3 = exports.smul_v = exports.sub_v = exports.add_vs = exports.add_v = exports.zero_v = void 0;
const atom_vertex_1 = require("../geo/atom_vertex");
const zero_v = () => new atom_vertex_1.V3(0, 0, 0);
exports.zero_v = zero_v;
const add_v = (a, b) => {
    return new atom_vertex_1.V3(a.x + b.x, a.y + b.y, a.z + b.z);
};
exports.add_v = add_v;
const add_vs = (...vertices) => {
    return vertices.reduce((a, v) => (0, exports.add_v)(a, v), new atom_vertex_1.V3(0, 0, 0));
};
exports.add_vs = add_vs;
const sub_v = (a, b) => {
    return new atom_vertex_1.V3(a.x - b.x, a.y - b.y, a.z - b.z);
};
exports.sub_v = sub_v;
const smul_v = (a, s) => {
    return new atom_vertex_1.V3(a.x * s, a.y * s, a.z * s);
};
exports.smul_v = smul_v;
const smul_vec3 = (a, s) => {
    return [
        a[0] * s,
        a[1] * s,
        a[2] * s
    ];
};
exports.smul_vec3 = smul_vec3;
const sdiv_v = (a, s) => {
    return new atom_vertex_1.V3(a.x / s, a.y / s, a.z / s);
};
exports.sdiv_v = sdiv_v;
const same_v = (a, b) => {
    const delta = (0, exports.squared_distance_v)(a, b);
    return delta < 1e-4;
};
exports.same_v = same_v;
const avg_v = (...vs) => {
    return new atom_vertex_1.V3(vs.reduce((a, v) => a + v.x, 0) / vs.length, vs.reduce((a, v) => a + v.y, 0) / vs.length, vs.reduce((a, v) => a + v.z, 0) / vs.length);
};
exports.avg_v = avg_v;
const lerp_v = (t, a, b) => {
    return new atom_vertex_1.V3(t * a.x + (1 - t) * b.x, t * a.y + (1 - t) * b.y, t * a.z + (1 - t) * b.z);
};
exports.lerp_v = lerp_v;
const min_v = (a, b) => {
    return new atom_vertex_1.V3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
exports.min_v = min_v;
const max_v = (a, b) => {
    return new atom_vertex_1.V3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
exports.max_v = max_v;
const max_component_v = (a) => {
    return Math.max(a.x, a.y, a.z);
};
exports.max_component_v = max_component_v;
const abs_v = (a) => {
    return new atom_vertex_1.V3(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z));
};
exports.abs_v = abs_v;
const distance_v = (a, b) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
};
exports.distance_v = distance_v;
const squared_distance_v = (a, b) => {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
};
exports.squared_distance_v = squared_distance_v;
const magnitude_v = (a) => {
    return Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
};
exports.magnitude_v = magnitude_v;
const magnitude_vec3 = (a) => {
    return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
};
exports.magnitude_vec3 = magnitude_vec3;
const normalize_v = (a) => {
    const length = (0, exports.magnitude_v)(a);
    return new atom_vertex_1.V3(a.x / length, a.y / length, a.z / length);
};
exports.normalize_v = normalize_v;
const normalize_vec3 = (a) => {
    const length = (0, exports.magnitude_vec3)(a);
    return [
        a[0] / length,
        a[1] / length,
        a[2] / length
    ];
};
exports.normalize_vec3 = normalize_vec3;
const dot_v = (a, b) => {
    return a.x * b.x + a.y * b.y + a.z * b.z;
};
exports.dot_v = dot_v;
const dot_vec3 = (a, b) => {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
exports.dot_vec3 = dot_vec3;
const dot_vec4 = (a, b) => {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};
exports.dot_vec4 = dot_vec4;
const cross_v = (a, b) => {
    return new atom_vertex_1.V3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
};
exports.cross_v = cross_v;
