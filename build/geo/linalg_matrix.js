"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.world_to_camera = exports.mat3_to_mat4 = exports.mat4_to_mat3 = exports.mat4_scale = exports.mat3_scale = exports.mat4_translate = exports.mat3_translate = exports.mat4_tranpose = exports.mat3_tranpose = exports.mat4_invert_with_check = exports.mat4_det = exports.mat4_invert = exports.mat3_det = exports.mat3_invert = exports.mat4_trace = exports.mat3_trace = exports.mat4_applyv3 = exports.mat3_applyv = exports.vec4_dot = exports.mat4_vecmul = exports.mat3_vecmul = exports.mat4_matmul = exports.mat3_matmul = exports.mat3_chain = exports.smul_mat4 = exports.smul_mat3 = exports.sub_mat4 = exports.sub_mat3 = exports.add_mat4 = exports.add_mat3 = exports.mat4_rot_axis = exports.mat4_rot_z = exports.mat3_rot_z = exports.mat4_rot_y = exports.mat3_rot_y = exports.mat4_rot_x = exports.mat3_rot_x = exports.mat4_clone = exports.mat3_clone = exports.mat4_zeroes = exports.mat3_zeroes = exports.mat4_identity = exports.mat3_identity = exports.vec3_sub = exports.vec3_smul = void 0;
const atom_vertex_1 = require("../geo/atom_vertex");
const linalg_standard_1 = require("./linalg_standard");
const vec3_smul = (v3, s) => {
    return v3.map(n => n * s);
};
exports.vec3_smul = vec3_smul;
const vec3_sub = (a, b) => {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
    ];
};
exports.vec3_sub = vec3_sub;
// matrix creation
const mat3_identity = () => {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];
};
exports.mat3_identity = mat3_identity;
const mat4_identity = () => {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
};
exports.mat4_identity = mat4_identity;
const mat3_zeroes = () => {
    return [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];
};
exports.mat3_zeroes = mat3_zeroes;
const mat4_zeroes = () => {
    return [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
};
exports.mat4_zeroes = mat4_zeroes;
const mat3_clone = (mat) => {
    return mat.slice(0);
};
exports.mat3_clone = mat3_clone;
const mat4_clone = (mat) => {
    return mat.slice(0);
};
exports.mat4_clone = mat4_clone;
const mat3_rot_x = (theta) => {
    return [
        1, 0, 0,
        0, Math.cos(theta), Math.sin(theta),
        0, -Math.sin(theta), Math.cos(theta),
    ];
};
exports.mat3_rot_x = mat3_rot_x;
const mat4_rot_x = (theta) => {
    return [
        1, 0, 0, 0,
        0, Math.cos(theta), Math.sin(theta), 0,
        0, -Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    ];
};
exports.mat4_rot_x = mat4_rot_x;
const mat3_rot_y = (theta) => {
    return [
        Math.cos(theta), 0, Math.sin(theta),
        0, 1, 0,
        -Math.sin(theta), 0, Math.cos(theta)
    ];
};
exports.mat3_rot_y = mat3_rot_y;
const mat4_rot_y = (theta) => {
    return [
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    ];
};
exports.mat4_rot_y = mat4_rot_y;
const mat3_rot_z = (theta) => {
    return [
        Math.cos(theta), -Math.sin(theta), 0,
        Math.sin(theta), Math.cos(theta), 0,
        0, 0, 1
    ];
};
exports.mat3_rot_z = mat3_rot_z;
const mat4_rot_z = (theta) => {
    return [
        Math.cos(theta), -Math.sin(theta), 0, 0,
        Math.sin(theta), Math.cos(theta), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
};
exports.mat4_rot_z = mat4_rot_z;
const mat4_rot_axis = (axis, theta) => {
    const t = theta * Math.PI / 180;
    const cost = Math.cos(t);
    const sint = Math.sin(t);
    const [ux, uy, uz] = axis;
    return (0, exports.mat4_tranpose)([
        cost + ux * ux * (1 - cost), ux * uy * (1 - cost) - uz * sint, ux * uz * (1 - cost) + uy * sint, 0,
        uy * ux * (1 - cost) + uz * sint, cost + uy * uy * (1 - cost), uy * uz * (1 - cost) - ux * sint, 0,
        uz * ux * (1 - cost) - uy * sint, uz * uy * (1 - cost) + ux * sint, cost + uz * uz * (1 - cost), 0,
        0, 0, 0, 1
    ]);
};
exports.mat4_rot_axis = mat4_rot_axis;
// matrix operations
const add_mat3 = (a, b) => {
    return [
        a[0] + b[0], a[1] + b[1], a[2] + b[2],
        a[3] + b[3], a[4] + b[4], a[5] + b[5],
        a[6] + b[6], a[7] + b[7], a[8] + b[8]
    ];
};
exports.add_mat3 = add_mat3;
const add_mat4 = (a, b) => {
    return [
        a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3],
        a[4] + b[4], a[5] + b[5], a[6] + b[6], a[7] + b[7],
        a[8] + b[8], a[9] + b[9], a[10] + b[10], a[11] + b[11],
        a[12] + b[12], a[13] + b[13], a[14] + b[14], a[15] + b[15]
    ];
};
exports.add_mat4 = add_mat4;
const sub_mat3 = (a, b) => {
    return [
        a[0] - b[0], a[1] - b[1], a[2] - b[2],
        a[3] - b[3], a[4] - b[4], a[5] - b[5],
        a[6] - b[6], a[7] - b[7], a[8] - b[8]
    ];
};
exports.sub_mat3 = sub_mat3;
const sub_mat4 = (a, b) => {
    return [
        a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3],
        a[4] - b[4], a[5] - b[5], a[6] - b[6], a[7] - b[7],
        a[8] - b[8], a[9] - b[9], a[10] - b[10], a[11] - b[11],
        a[12] - b[12], a[13] - b[13], a[14] - b[14], a[15] - b[15]
    ];
};
exports.sub_mat4 = sub_mat4;
const smul_mat3 = (a, s) => {
    return [
        a[0] * s, a[1] * s, a[2] * s,
        a[3] * s, a[4] * s, a[5] * s,
        a[6] * s, a[7] * s, a[8] * s
    ];
};
exports.smul_mat3 = smul_mat3;
const smul_mat4 = (a, s) => {
    return [
        a[0] * s, a[1] * s, a[2] * s, a[3] * s,
        a[4] * s, a[5] * s, a[6] * s, a[7] * s,
        a[8] * s, a[9] * s, a[10] * s, a[11] * s,
        a[12] * s, a[13] * s, a[14] * s, a[15] * s
    ];
};
exports.smul_mat4 = smul_mat4;
const mat3_chain = (...matmul) => {
    return matmul.reduceRight((a, m) => (0, exports.mat3_matmul)(a, m), (0, exports.mat3_identity)());
};
exports.mat3_chain = mat3_chain;
const mat3_matmul = (a, b) => {
    return [
        // col 1
        a[0] * b[0] + a[3] * b[1] + a[6] * b[2],
        a[1] * b[0] + a[4] * b[1] + a[7] * b[2],
        a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
        // col 2
        a[0] * b[3] + a[3] * b[4] + a[6] * b[5],
        a[1] * b[3] + a[4] * b[4] + a[7] * b[5],
        a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
        // col 3
        a[0] * b[6] + a[3] * b[7] + a[6] * b[8],
        a[1] * b[6] + a[4] * b[7] + a[7] * b[8],
        a[2] * b[6] + a[5] * b[7] + a[8] * b[8],
    ];
};
exports.mat3_matmul = mat3_matmul;
const mat4_matmul = (a, b) => {
    return [
        // col 1
        a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
        a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
        a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
        a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
        // col 2
        a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
        a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
        a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
        a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
        // col 3
        a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
        a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
        a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
        a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
        // col 4
        a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
        a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
        a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
        a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
    ];
};
exports.mat4_matmul = mat4_matmul;
const mat3_vecmul = (mat, vec3) => {
    return [
        mat[0] * vec3[0] + mat[3] * vec3[1] + mat[6] * vec3[2],
        mat[1] * vec3[0] + mat[4] * vec3[1] + mat[7] * vec3[2],
        mat[2] * vec3[0] + mat[5] * vec3[1] + mat[8] * vec3[2],
    ];
};
exports.mat3_vecmul = mat3_vecmul;
const mat4_vecmul = (mat, vec4) => {
    return [
        mat[0] * vec4[0] + mat[4] * vec4[1] + mat[8] * vec4[2] + mat[12] * vec4[3],
        mat[1] * vec4[0] + mat[5] * vec4[1] + mat[9] * vec4[2] + mat[13] * vec4[3],
        mat[2] * vec4[0] + mat[6] * vec4[1] + mat[10] * vec4[2] + mat[14] * vec4[3],
        mat[3] * vec4[0] + mat[7] * vec4[1] + mat[11] * vec4[2] + mat[15] * vec4[3],
    ];
};
exports.mat4_vecmul = mat4_vecmul;
const vec4_dot = (a, b) => {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};
exports.vec4_dot = vec4_dot;
const mat3_applyv = (mat, v) => {
    let r = (0, exports.mat3_vecmul)(mat, [v.x, v.y, v.z]);
    return new atom_vertex_1.V3(r[0], r[1], r[2]);
};
exports.mat3_applyv = mat3_applyv;
const mat4_applyv3 = (mat, v, w_one, homogenize) => {
    let r = (0, exports.mat4_vecmul)(mat, [v.x, v.y, v.z, w_one ? 1 : 0]);
    if (homogenize) {
        return new atom_vertex_1.V3(r[0] / r[3], r[1] / r[3], r[2] / r[3]);
    }
    else {
        return new atom_vertex_1.V3(r[0], r[1], r[2]);
    }
};
exports.mat4_applyv3 = mat4_applyv3;
const mat3_trace = (a) => {
    return a[0] + a[4] + a[8];
};
exports.mat3_trace = mat3_trace;
const mat4_trace = (a) => {
    return a[0] + a[5] + a[10] + a[15];
};
exports.mat4_trace = mat4_trace;
const mat3_invert = (m) => {
    // 0  3  6
    // 1  4  7  
    // 2  5  8
    const det = m[0] * (m[4] * m[8] - m[7] * m[5]) -
        m[1] * (m[3] * m[8] - m[5] * m[6]) +
        m[2] * (m[3] * m[7] - m[4] * m[6]);
    if (det == 0)
        console.error("non-invertible matrix encountered");
    const invdet = 1 / det;
    const minv = new Array(9);
    minv[0] = (m[4] * m[8] - m[7] * m[5]) * invdet;
    minv[1] = (m[2] * m[7] - m[1] * m[8]) * invdet;
    minv[2] = (m[1] * m[5] - m[2] * m[4]) * invdet;
    minv[3] = (m[5] * m[6] - m[3] * m[8]) * invdet;
    minv[4] = (m[0] * m[8] - m[2] * m[6]) * invdet;
    minv[5] = (m[3] * m[2] - m[0] * m[5]) * invdet;
    minv[6] = (m[3] * m[7] - m[6] * m[4]) * invdet;
    minv[7] = (m[6] * m[1] - m[0] * m[7]) * invdet;
    minv[8] = (m[0] * m[4] - m[3] * m[1]) * invdet;
    return minv;
};
exports.mat3_invert = mat3_invert;
const mat3_det = (m) => {
    const det = m[0] * (m[4] * m[8] - m[7] * m[5]) -
        m[1] * (m[3] * m[8] - m[5] * m[6]) +
        m[2] * (m[3] * m[7] - m[4] * m[6]);
    return det;
};
exports.mat3_det = mat3_det;
const mat4_invert = (m) => {
    // 0  4  8  12
    // 1  5  9  13
    // 2  6  10 14
    // 3  7  11 15
    const inv = new Array(16);
    const invOut = new Array(16);
    inv[0] = m[5] * m[10] * m[15] -
        m[5] * m[11] * m[14] -
        m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] +
        m[13] * m[6] * m[11] -
        m[13] * m[7] * m[10];
    inv[4] = -m[4] * m[10] * m[15] +
        m[4] * m[11] * m[14] +
        m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] -
        m[12] * m[6] * m[11] +
        m[12] * m[7] * m[10];
    inv[8] = m[4] * m[9] * m[15] -
        m[4] * m[11] * m[13] -
        m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] +
        m[12] * m[5] * m[11] -
        m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] +
        m[4] * m[10] * m[13] +
        m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] -
        m[12] * m[5] * m[10] +
        m[12] * m[6] * m[9];
    inv[1] = -m[1] * m[10] * m[15] +
        m[1] * m[11] * m[14] +
        m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] -
        m[13] * m[2] * m[11] +
        m[13] * m[3] * m[10];
    inv[5] = m[0] * m[10] * m[15] -
        m[0] * m[11] * m[14] -
        m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] +
        m[12] * m[2] * m[11] -
        m[12] * m[3] * m[10];
    inv[9] = -m[0] * m[9] * m[15] +
        m[0] * m[11] * m[13] +
        m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] -
        m[12] * m[1] * m[11] +
        m[12] * m[3] * m[9];
    inv[13] = m[0] * m[9] * m[14] -
        m[0] * m[10] * m[13] -
        m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] +
        m[12] * m[1] * m[10] -
        m[12] * m[2] * m[9];
    inv[2] = m[1] * m[6] * m[15] -
        m[1] * m[7] * m[14] -
        m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] +
        m[13] * m[2] * m[7] -
        m[13] * m[3] * m[6];
    inv[6] = -m[0] * m[6] * m[15] +
        m[0] * m[7] * m[14] +
        m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] -
        m[12] * m[2] * m[7] +
        m[12] * m[3] * m[6];
    inv[10] = m[0] * m[5] * m[15] -
        m[0] * m[7] * m[13] -
        m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] +
        m[12] * m[1] * m[7] -
        m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] +
        m[0] * m[6] * m[13] +
        m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] -
        m[12] * m[1] * m[6] +
        m[12] * m[2] * m[5];
    inv[3] = -m[1] * m[6] * m[11] +
        m[1] * m[7] * m[10] +
        m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] -
        m[9] * m[2] * m[7] +
        m[9] * m[3] * m[6];
    inv[7] = m[0] * m[6] * m[11] -
        m[0] * m[7] * m[10] -
        m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] +
        m[8] * m[2] * m[7] -
        m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] +
        m[0] * m[7] * m[9] +
        m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] -
        m[8] * m[1] * m[7] +
        m[8] * m[3] * m[5];
    inv[15] = m[0] * m[5] * m[10] -
        m[0] * m[6] * m[9] -
        m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] +
        m[8] * m[1] * m[6] -
        m[8] * m[2] * m[5];
    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det == 0)
        console.error("non-invertible matrix encountered");
    det = 1.0 / det;
    for (let i = 0; i < 16; i++)
        invOut[i] = inv[i] * det;
    return invOut;
};
exports.mat4_invert = mat4_invert;
const mat4_det = (m) => {
    const inv_0 = m[5] * m[10] * m[15] -
        m[5] * m[11] * m[14] -
        m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] +
        m[13] * m[6] * m[11] -
        m[13] * m[7] * m[10];
    const inv_4 = -m[4] * m[10] * m[15] +
        m[4] * m[11] * m[14] +
        m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] -
        m[12] * m[6] * m[11] +
        m[12] * m[7] * m[10];
    const inv_8 = m[4] * m[9] * m[15] -
        m[4] * m[11] * m[13] -
        m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] +
        m[12] * m[5] * m[11] -
        m[12] * m[7] * m[9];
    const inv_12 = -m[4] * m[9] * m[14] +
        m[4] * m[10] * m[13] +
        m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] -
        m[12] * m[5] * m[10] +
        m[12] * m[6] * m[9];
    let det = m[0] * inv_0 + m[1] * inv_4 + m[2] * inv_8 + m[3] * inv_12;
    return det;
};
exports.mat4_det = mat4_det;
const mat4_invert_with_check = (m) => {
    // 0  4  8  12
    // 1  5  9  13
    // 2  6  10 14
    // 3  7  11 15
    const inv = new Array(16);
    const invOut = new Array(16);
    inv[0] = m[5] * m[10] * m[15] -
        m[5] * m[11] * m[14] -
        m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] +
        m[13] * m[6] * m[11] -
        m[13] * m[7] * m[10];
    inv[4] = -m[4] * m[10] * m[15] +
        m[4] * m[11] * m[14] +
        m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] -
        m[12] * m[6] * m[11] +
        m[12] * m[7] * m[10];
    inv[8] = m[4] * m[9] * m[15] -
        m[4] * m[11] * m[13] -
        m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] +
        m[12] * m[5] * m[11] -
        m[12] * m[7] * m[9];
    inv[12] = -m[4] * m[9] * m[14] +
        m[4] * m[10] * m[13] +
        m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] -
        m[12] * m[5] * m[10] +
        m[12] * m[6] * m[9];
    inv[1] = -m[1] * m[10] * m[15] +
        m[1] * m[11] * m[14] +
        m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] -
        m[13] * m[2] * m[11] +
        m[13] * m[3] * m[10];
    inv[5] = m[0] * m[10] * m[15] -
        m[0] * m[11] * m[14] -
        m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] +
        m[12] * m[2] * m[11] -
        m[12] * m[3] * m[10];
    inv[9] = -m[0] * m[9] * m[15] +
        m[0] * m[11] * m[13] +
        m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] -
        m[12] * m[1] * m[11] +
        m[12] * m[3] * m[9];
    inv[13] = m[0] * m[9] * m[14] -
        m[0] * m[10] * m[13] -
        m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] +
        m[12] * m[1] * m[10] -
        m[12] * m[2] * m[9];
    inv[2] = m[1] * m[6] * m[15] -
        m[1] * m[7] * m[14] -
        m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] +
        m[13] * m[2] * m[7] -
        m[13] * m[3] * m[6];
    inv[6] = -m[0] * m[6] * m[15] +
        m[0] * m[7] * m[14] +
        m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] -
        m[12] * m[2] * m[7] +
        m[12] * m[3] * m[6];
    inv[10] = m[0] * m[5] * m[15] -
        m[0] * m[7] * m[13] -
        m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] +
        m[12] * m[1] * m[7] -
        m[12] * m[3] * m[5];
    inv[14] = -m[0] * m[5] * m[14] +
        m[0] * m[6] * m[13] +
        m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] -
        m[12] * m[1] * m[6] +
        m[12] * m[2] * m[5];
    inv[3] = -m[1] * m[6] * m[11] +
        m[1] * m[7] * m[10] +
        m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] -
        m[9] * m[2] * m[7] +
        m[9] * m[3] * m[6];
    inv[7] = m[0] * m[6] * m[11] -
        m[0] * m[7] * m[10] -
        m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] +
        m[8] * m[2] * m[7] -
        m[8] * m[3] * m[6];
    inv[11] = -m[0] * m[5] * m[11] +
        m[0] * m[7] * m[9] +
        m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] -
        m[8] * m[1] * m[7] +
        m[8] * m[3] * m[5];
    inv[15] = m[0] * m[5] * m[10] -
        m[0] * m[6] * m[9] -
        m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] +
        m[8] * m[1] * m[6] -
        m[8] * m[2] * m[5];
    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det == 0) {
        return {
            invertible: false,
            result: (0, exports.mat4_zeroes)()
        };
    }
    det = 1.0 / det;
    for (let i = 0; i < 16; i++)
        invOut[i] = inv[i] * det;
    return {
        invertible: true,
        result: invOut
    };
    ;
};
exports.mat4_invert_with_check = mat4_invert_with_check;
const mat3_tranpose = (m) => {
    return [
        m[0], m[3], m[6],
        m[1], m[4], m[7],
        m[2], m[5], m[8]
    ];
};
exports.mat3_tranpose = mat3_tranpose;
const mat4_tranpose = (m) => {
    return [
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15],
    ];
};
exports.mat4_tranpose = mat4_tranpose;
const mat3_translate = (x, y) => {
    return [
        1, 0, 0,
        0, 1, 0,
        x, y, 1
    ];
};
exports.mat3_translate = mat3_translate;
const mat4_translate = (x, y, z) => {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ];
};
exports.mat4_translate = mat4_translate;
const mat3_scale = (sx, sy, sz) => {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, sz
    ];
};
exports.mat3_scale = mat3_scale;
const mat4_scale = (sx, sy, sz) => {
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    ];
};
exports.mat4_scale = mat4_scale;
// misc utilities
const mat4_to_mat3 = (m) => {
    return [
        m[0], m[1], m[2],
        m[4], m[5], m[6],
        m[8], m[9], m[10]
    ];
};
exports.mat4_to_mat3 = mat4_to_mat3;
const mat3_to_mat4 = (m, w_one = true) => {
    return [
        m[0], m[1], m[2], 0,
        m[4], m[5], m[6], 0,
        m[8], m[9], m[10], 0,
        0, 0, 0, w_one ? 1 : 0,
    ];
};
exports.mat3_to_mat4 = mat3_to_mat4;
const world_to_camera = (position, look, up) => {
    const w = (0, linalg_standard_1.smul_v)((0, linalg_standard_1.normalize_v)(look), -1);
    const v = (0, linalg_standard_1.normalize_v)((0, linalg_standard_1.sub_v)(up, (0, linalg_standard_1.smul_v)(w, (0, linalg_standard_1.dot_v)(up, w))));
    const u = (0, linalg_standard_1.cross_v)(v, w);
    const mat_t = (0, exports.mat4_translate)(-position.x, -position.y, -position.z);
    const mat_r = [
        u.x, v.x, w.x, 0,
        u.y, v.y, w.y, 0,
        u.z, v.z, w.z, 0,
        0, 0, 0, 1
    ];
    const mat_v = (0, exports.mat4_matmul)(mat_r, mat_t);
    return mat_v;
};
exports.world_to_camera = world_to_camera;
