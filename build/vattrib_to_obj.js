"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vattrib_to_obj = void 0;
const fs = __importStar(require("fs"));
const vattrib_to_obj = (path, data_uv, data_N, data_P, data_ind) => {
    const vertex_positions = [];
    const vertex_normals = [];
    const vertex_texcoords = [];
    const indices = [];
    const triple = (s) => `${s}/${s}/${s}`;
    for (let i = 0; i < data_P.length; i += 3) {
        vertex_positions.push(`v ${data_P[i]} ${data_P[i + 1]} ${data_P[i + 2]}`);
        vertex_normals.push(`vn ${data_N[i]} ${data_N[i + 1]} ${data_N[i + 2]}`);
    }
    for (let i = 0; i < data_ind.length; i += 3) {
        indices.push(`f ${triple(data_ind[i])} ${triple(data_ind[i + 1])} ${triple(data_ind[i + 2])}`);
    }
    for (let i = 0; i < data_uv.length; i += 2) {
        vertex_texcoords.push(`vt ${data_uv[i]} ${data_uv[i + 1]}`);
    }
    const obj_file = `
# Generated in Brown CS 2240 
${vertex_positions.join('\n')}

${vertex_texcoords.join('\n')}

${vertex_normals.join('\n')}

${indices.join('\n')}
`;
    fs.writeFileSync(path, obj_file);
};
exports.vattrib_to_obj = vattrib_to_obj;
