"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V3 = void 0;
let c = 0;
class V3 {
    x;
    y;
    z;
    id;
    constructor(x, y, z) {
        if (x !== undefined)
            this.x = x;
        if (y !== undefined)
            this.y = y;
        if (z !== undefined)
            this.z = z;
        this.id = Symbol(c++);
    }
    static zero() {
        return new V3(0, 0, 0);
    }
    clone() {
        return new V3(this.x, this.y, this.z);
    }
    set_pos(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    to_THREE() {
        return [this.x, this.y, this.z];
    }
    to_homogeneous() {
        return [this.x, this.y, this.z, 1];
    }
    add_xyz(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }
    add_v(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    sub_xyz(x, y, z) {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }
    sub_v(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    set_xyz(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    set_v(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    zero_out() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
exports.V3 = V3;
