import * as fs from 'fs';

export const vattrib_to_obj = (
    path: string,
    data_uv: number[],
    data_N: number[],
    data_P: number[],
    data_ind: number[]
) => {
    const vertex_positions: string[] = [];
    const vertex_normals: string[] = [];
    const vertex_texcoords: string[] = [];
    const indices: string[] = [];

    const triple = (s: number) => `${s}/${s}/${s}`;
    for(let i = 0; i < data_P.length; i += 3){
        vertex_positions.push(`v ${data_P[i]} ${data_P[i + 1]} ${data_P[i + 2]}`);
        vertex_normals.push(`vn ${data_N[i]} ${data_N[i + 1]} ${data_N[i + 2]}`);
    }

    for(let i = 0; i < data_ind.length; i += 3){
        indices.push(`f ${triple(data_ind[i])} ${triple(data_ind[i + 1])} ${triple(data_ind[i + 2])}`);
    }

    for(let i = 0; i < data_uv.length; i += 2){
        vertex_texcoords.push(`vt ${data_uv[i]} ${data_uv[i + 1]}`);
    }

    const obj_file = 
`
# Generated in Brown CS 2240 
${vertex_positions.join('\n')}

${vertex_texcoords.join('\n')}

${vertex_normals.join('\n')}

${indices.join('\n')}
`;
    fs.writeFileSync(path, obj_file);
}