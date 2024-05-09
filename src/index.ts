import * as fs from 'fs';
import nearley from 'nearley';
import * as grammar from './grammar';
import { mat3_identity, mat4_identity, mat4_matmul, mat4_rot_axis, mat4_scale, mat4_tranpose, mat4_translate, vec3_smul, vec3_sub } from './geo/linalg_matrix';
import { magnitude_vec3 } from './geo/linalg_standard';
import { Matrix, EigenvalueDecomposition } from 'ml-matrix';
import { MDL_Params, params_to_mdl } from './params_to_mdl';
import { vattrib_to_obj } from './vattrib_to_obj';

// const root_dir = '../../graphics/pbrt-v4-scenes/bmw-m6';
// const start_file = 'bmw-m6.pbrt';

// const root_dir = '../../graphics/pbrt-v4-scenes/bistro';
// const start_file = 'bistro_cafe.pbrt';

// const root_dir = '../../graphics/pbrt-v4-scenes/zero-day';
// const start_file = 'frame25.pbrt';

// const root_dir = '../../graphics/pbrt-v4-scenes/sanmiguel';
// const start_file = 'sanmiguel-entry.pbrt';

const root_dir = '../../graphics/pbrt-v4-scenes/watercolor';
const start_file = 'camera-1.pbrt';

let output_directory = './out_scene';
const mdl_folder_name = 'mdl_custom';
if(!fs.existsSync(`${output_directory}/geometry/`)){
    fs.mkdirSync(`${output_directory}/geometry/`);
}
if(!fs.existsSync(`${output_directory}/geometry_custom/`)){
    fs.mkdirSync(`${output_directory}/geometry_custom/`);
}
if(!fs.existsSync(`${output_directory}/${mdl_folder_name}/`)){
    fs.mkdirSync(`${output_directory}/${mdl_folder_name}/`);
}
if(!fs.existsSync(`${output_directory}/${mdl_folder_name}/textures/`)){
    fs.mkdirSync(`${output_directory}/${mdl_folder_name}/textures/`);
}
console.log(fs.readdirSync(root_dir));

type Attribute = {
    type: string,
    name: string,
    values: (number | string)[]
}

type Statement = {
    type: string,
    kind: string,
    params: (number | string)[],
    attributes: Attribute[]
}

const statement_names = [
    "Film",
    "LookAt",
    "Camera",
    "Sampler",
    "Integrator",
    "WorldBegin",

    
    "AttributeBegin",
    "AttributeEnd",
    "ObjectBegin",
    "ObjectEnd",
    "ObjectInstance",
    "Include",

    "Rotate",
    "Translate",
    "Identity",
    "Scale",
    "Transform",
    "ConcatTransform",

    "NamedMaterial",
    "Shape",
    "AreaLightSource",
    "LightSource",
    "Texture",
    "MakeNamedMaterial",
    "MakeNamedMedium",
    "Material",
    "MediumInterface"
];

let temp_counter = 0;
const parse_pbrt_file = (path: string) => {
    console.log('handling parse pbrt with ', path);

    const txt = fs.readFileSync(`${root_dir}/${path}`).toString();
    // preprocess
    const lines = txt
        .replace(/\r/g, '').split('\n')
        .filter(line => line.trimStart()[0] !== '#')
        .map(line => {
            const comment_index = line.indexOf('#');
            if(comment_index == -1) return line;
            else return line.slice(0, comment_index);
        })
        .map(line => line.trimEnd())
        .filter(line => line.length > 0)
        .map(line => {
            const contains_statement = statement_names.some(name => line.includes(name));
            if(contains_statement) return line;
            return ' ' + line;
        });

    const new_lines: string[] = [];
    let depth = 0;
    let buffer: string[] = [];
    let met_trianglemesh = false;
    let met_bilinearmesh = false;

    let file_name_counter = 0;

    // remove triangle meshes for now... they can be parsed later!
    for(let line of lines){
        if(line.includes('AttributeBegin')){
            depth += 1;
            if(buffer.length > 0){
                new_lines.push(...buffer);
                buffer = [line];
                met_trianglemesh = false;
            } else {
                buffer.push(line);
            }

        } else if(line.includes('"trianglemesh"')){
            met_trianglemesh = true;
            buffer.push(line);
        } else if(line.includes('"bilinearmesh"')){
            met_bilinearmesh = true;
            buffer.push(line);
        } else if(line.includes('AttributeEnd')){
            depth -= 1;
            buffer.push(line);
            if(!met_trianglemesh && !met_bilinearmesh) {
                new_lines.push(...buffer);
            }
            else if(!met_bilinearmesh){
                const mesh_lines = buffer.slice(0);
                const shape_index_line = mesh_lines.findIndex(line => line.includes("Shape") && line.includes("trianglemesh"));
                
                const final_lines = [
                    ...buffer.slice(0, shape_index_line),
                    `Shape "objmesh" "mesh_custom_${file_name_counter}" "geometry_custom/mesh_custom_${file_name_counter}.obj"`,
                    '   AttributeEnd'
                ];
                const mesh_data_lines = buffer.slice(shape_index_line);

                const index_uv  = mesh_data_lines.findIndex(line => line.includes('point2 uv'));
                const index_N   = mesh_data_lines.findIndex(line => line.includes('normal N'));
                const index_P   = mesh_data_lines.findIndex(line => line.includes('point3 P'));
                const index_ind = mesh_data_lines.findIndex(line => line.includes('integer indices'));

                // must contain all four types!
                if(index_uv != -1 && index_N != -1 && index_P != -1 && index_ind != -1){
                    const list: [number, string][] = [[index_uv, 'uv'], [index_N, 'N'], [index_P, 'P'], [index_ind, 'ind'], [Infinity, 'end']];
                    list.sort((a, b) => a[0] - b[0]);

                    const index_range_to_array = (start: number, end: number) => {
                        const lines = mesh_data_lines
                            .slice(start, end)
                            .join('')
                            .replace(/\s\s+/g, ' ');
                        const index_lbracket = lines.indexOf('[');
                        const index_rbracket = lines.indexOf(']');
                        const line_data = lines
                            .slice(index_lbracket + 1, index_rbracket)
                            .trim()
                            .split(' ')
                            .map(parseFloat);
                        return line_data;
                    }

                    const index_uv_start = index_uv;
                    const index_uv_end = list[list.findIndex(pair => pair[1] === 'uv') + 1][0];
                    const data_uv = index_range_to_array(index_uv_start, index_uv_end);

                    const index_N_start = index_N;
                    const index_N_end = list[list.findIndex(pair => pair[1] === 'N') + 1][0];
                    const data_N = index_range_to_array(index_N_start, index_N_end);

                    const index_P_start = index_P;
                    const index_P_end = list[list.findIndex(pair => pair[1] === 'P') + 1][0];
                    const data_P = index_range_to_array(index_P_start, index_P_end);

                    const index_ind_start = index_ind;
                    const index_ind_end = list[list.findIndex(pair => pair[1] === 'ind') + 1][0];
                    const data_ind = index_range_to_array(index_ind_start, index_ind_end).map(n => n + 1);

                    // if(file_name_counter === 0){
                    //     console.log(data_uv);
                    //     console.log(data_N);
                    //     console.log(data_P);
                    //     console.log(data_ind);
                    //     console.log(data_uv.length, data_N.length, data_P.length, data_ind.length);                
                    // }
                    vattrib_to_obj(
                        `${output_directory}/geometry_custom/mesh_custom_${file_name_counter}.obj`,
                        data_uv,
                        data_N,
                        data_P, 
                        data_ind
                    );
                    console.log(final_lines);

                    new_lines.push(...final_lines);
                    file_name_counter += 1;
                } else {
                    console.log("MISSING A VERTEX ATTRIBUTE", index_uv, index_N, index_P, index_ind);
                }
            } 
            else {
                console.log("ignore bilinear mesh", buffer)
            }
            met_trianglemesh = false;
            met_bilinearmesh = false;
            buffer = [];
        } else {
            buffer.push(line);
        }
    }
    if(buffer.length > 0){
        new_lines.push(...buffer);
    }
    console.log(`    finished removing triangle meshes...`);

    const preprocessed_txt = [...new_lines, ''].join('\n');
    fs.writeFileSync(`./temp${temp_counter++}.txt`, preprocessed_txt);

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(preprocessed_txt);
    console.log('Results', parser.results.length);

    if(parser.results.length != 1) {
        // console.log(parser.results)
        // fs.writeFileSync('ambiguity.txt', JSON.stringify(parser.results, null, 4));
        throw Error("parsing ambiguity " + parser.results.length);
        // console.error("parsing ambiguity " + parser.results.length);
    }
    const result = parser.results[0];
    
    console.log((result as Statement[]).map(r => r.kind))

    return result as Statement[];
}

const include_handling = (path: string) : Statement[] => {
    console.log("handling include with ", path)
    const results = parse_pbrt_file(path);

    const indices_to_replace: number[] = [];
    for(let i = 0; i < results.length; i++){
        const statement = results[i];
        if(statement.kind === 'Include'){
            indices_to_replace.push(i);
        }
    }

    indices_to_replace.reverse();
    for(let i of indices_to_replace){
        const statement = results[i];
        const new_path = statement.params[0] as string;
        const sub_statements = include_handling(new_path);

        results.splice(i, 1, ...sub_statements);
    }

    return results;
}

const use_cached_results = false;
const copy_model_files = true;
const copy_texture_files = true;
const copy_normal_maps = true;
const write_mdl_files = true;

let intermediate_statements: Statement[];
if(!fs.existsSync('./cached_statements.json') || !use_cached_results){
    intermediate_statements = include_handling(start_file);
    fs.writeFileSync('./cached_statements.json', JSON.stringify(intermediate_statements, null, 4));
} else {
    intermediate_statements = JSON.parse(fs.readFileSync('./cached_statements.json').toString()) as Statement[];
}

console.log(`Number of statements: ${intermediate_statements.length}`);

let camera = {
    center: [0, 0, 0],
    camera: [0, 0, 0, 0]
};

let final_file_header = `
`;

let final_file_content = `
# tonemapper setup
gamma 2.2
colorBalance 1 1 1
whitePoint 1
burnHighlights 0.8
crushBlacks 0.2
saturation 1.2
brightness 1

# materials

push
# mdl default edf_diffuse "mdl/edf_diffuse.mdl" 
mdl bsdf_diffuse_reflection bsdf_diffuse_reflection "mdl/bsdf_diffuse_reflection.mdl"
mdl edf_diffuse edf_diffuse_cornell "mdl/edf_diffuse_cornell.mdl" 
pop

push
mdl default bsdf_diffuse_reflection "mdl/bsdf_diffuse_reflection.mdl"
mdl default_light edf_diffuse_cornell "mdl/edf_diffuse_cornell.mdl" 
pop

# lights

push
emission 1 1 1
emissionMultiplier 10
emissionTexture "NV_Default_HDR_3000x1500.hdr"
rotate 0 1 0 180
light env
pop 
`;

let ctm_stack: number[][] = [];
let ctm = mat4_identity();
let translation = [0, 0, 0];
let scale = [1, 1, 1];
let rotation = [1, 0, 0, 0];

let shape_counter = 0;

// let bad_files = [
//     'mesh_00042',
//     'mesh_00206',
//     'mesh_00230',
//     'mesh_00418',
//     'mesh_00451',
//     'mesh_00628',
//     'mesh_00725',
//     'mesh_00775',
//     'mesh_00796',
//     'mesh_00798'
// ];

let bad_files = [
    'new-mesh_00001',
]

let texture_dictionary = new Map<string, string>();

let is_light_stack: boolean[] = [];
let is_light = false;

let current_material_stack: string[] = [];
let current_material = 'default';

let counter = 0;
for(let statement of intermediate_statements){
    console.log(counter++, intermediate_statements.length);
    
    if(statement.kind === 'Camera'){
        camera.camera[2] = statement.attributes[0].values[0] as number;
    } else if(statement.kind === 'LookAt'){
        console.log(JSON.stringify(statement, null, 4));
        const p = statement.params;

        const eye = [p[0], p[1], p[2]] as number[];
        const target = [p[3], p[4], p[5]] as number[];
        const up_vector = [p[6], p[7], p[8]] as number[];

        camera.center = eye;
        
        const look_vector = vec3_sub(target, eye);
        const r = magnitude_vec3(look_vector);
        const phi = Math.atan2(look_vector[2], look_vector[0]); // y is up
        const theta = Math.acos(look_vector[1] / r);
        camera.camera[0] = phi;
        camera.camera[1] = theta;
        camera.camera[3] = r;
    }

    if(statement.kind === 'AttributeStart'){
        is_light_stack.push(is_light);

        current_material_stack.push(current_material);

        ctm_stack.push(ctm);

    } else if(statement.kind === 'AttributeEnd'){
        is_light = is_light_stack.pop() as boolean;
        if(is_light === undefined) is_light = false;

        current_material = current_material_stack.pop() as string;
        if(current_material === undefined) current_material = 'default';

        ctm = ctm_stack.pop() as number[];
        if(ctm === undefined) ctm = mat4_identity();
        translation = [ctm[12], ctm[13], ctm[14]];
        scale = [
            magnitude_vec3([ctm[0], ctm[1], ctm[2]]),
            magnitude_vec3([ctm[4], ctm[5], ctm[6]]),
            magnitude_vec3([ctm[8], ctm[9], ctm[10]]),
        ];

        const R = new Matrix([
            [ctm[0] / scale[0], ctm[4] / scale[1], ctm[8] / scale[2]],
            [ctm[1] / scale[0], ctm[5] / scale[1], ctm[9] / scale[2]],
            [ctm[2] / scale[0], ctm[6] / scale[1], ctm[10] / scale[2]]
        ]);
        const e = new EigenvalueDecomposition(R);
        const axis = e.eigenvectorMatrix.getColumn(0);
        const angle = Math.acos(((ctm[0] / scale[0] + ctm[5] / scale[1] + ctm[10] / scale[2]) - 1) * 0.5)
        rotation = [...axis, angle];
    } 

    if(statement.kind === "AreaLightSource"){
        is_light = true;
    }

    else if(statement.kind === 'NamedMaterial'){
        let material_name = statement.params[0] as string;
        material_name = material_name
            .replace(/\./g, '_')
            .replace(/-/g, '_')
            .replace(/ /g, '_');
        
        current_material = material_name;
    }
    else if(statement.kind === 'MakeNamedMaterial'){
        let material_name = statement.params[0] as string;
        material_name = material_name
            .replace(/\./g, '_')
            .replace(/-/g, '_')
            .replace(/ /g, '_');

        if(material_name === 'Canvas_02'){
            console.log(JSON.stringify(statement, null, 4))
        };

        const roughness_index = statement.attributes.findIndex(a => a.name === 'float roughness');
        const type_index = statement.attributes.findIndex(a => a.name === 'string type');
        const mix_materials_index = statement.attributes.findIndex(a => a.name === 'string materials');
        const color_texture_index = statement.attributes.findIndex(a => a.name === 'texture reflectance');
        const normal_map_index = statement.attributes.findIndex(a => a.name === 'string normalmap');
        const rgb_reflectance_index = statement.attributes.findIndex(a => a.name === 'rgb reflectance');

        let roughness = 0.5;
        if(roughness_index != -1) roughness = statement.attributes[roughness_index].values[0] as number;

        let type = 'coateddiffuse';
        if(type_index != -1) type = statement.attributes[type_index].values[0] as string;

        let color_texture_name = '';
        if(color_texture_index != -1) color_texture_name = statement.attributes[color_texture_index].values[0] as string;

        let normal_map_path = '';
        if(normal_map_index != -1) normal_map_path = statement.attributes[normal_map_index].values[0] as string;
        if(copy_normal_maps && normal_map_path.length > 0){
            fs.copyFileSync(
                `${root_dir}/${normal_map_path}`,
                `${output_directory}/${mdl_folder_name}/${normal_map_path}`
            );
        }

        let rgb_reflectance = [0, 0, 0];
        if(rgb_reflectance_index != -1) rgb_reflectance = statement.attributes[rgb_reflectance_index].values as number[];

        let mix_materials: string[] = [];
        if(mix_materials_index != -1) mix_materials = statement.attributes[mix_materials_index].values as string[];

        let params: MDL_Params = {
            material_name: material_name,
        
            has_roughness: roughness_index != -1,
            has_type: type_index != -1,
            has_color_texture: color_texture_index != -1,
            has_normal_map: normal_map_index != -1,
            has_rgb_reflectance: rgb_reflectance_index != -1,
            has_mix_materials: mix_materials_index != -1,
        
            roughness: roughness,
            type: type,
            color_texture: color_texture_name,
            normal_map_path: normal_map_path,
            rgb_reflectance: rgb_reflectance,
            mix_materials: mix_materials
        };


        if(write_mdl_files) params_to_mdl(params, texture_dictionary, output_directory, mdl_folder_name, material_name == 'Canvas_02');

        final_file_content += `
mdl ${material_name} ${material_name} "${mdl_folder_name}/${material_name}.mdl"
`;
    }
    else if(statement.kind === 'Texture'){
        const texture_name = statement.params[0] as string;

        const path_index = statement.attributes.findIndex(a => a.name === 'string filename');
        let texture_path: string;

        if(path_index != -1){
            texture_path = statement.attributes[path_index].values[0] as string;
        } else {
            // is mix material
            const index1 = statement.attributes.findIndex(a => a.name === 'texture tex1');
            const index2 = statement.attributes.findIndex(a => a.name === 'texture tex');
            let index = index1 != -1 ? index1 : index2;
            texture_path = texture_dictionary.get(statement.attributes[index].values[0] as string) as string;
        }

        if(copy_texture_files){
            fs.copyFileSync(
                `${root_dir}/${texture_path}`,
                `${output_directory}/${mdl_folder_name}/${texture_path}`
            );
        }

        texture_dictionary.set(texture_name, texture_path);
    }

    else if(statement.kind === 'Transform'){
        ctm = statement.params as number[];

        translation = [ctm[12], ctm[13], ctm[14]];
        scale = [
            magnitude_vec3([ctm[0], ctm[1], ctm[2]]),
            magnitude_vec3([ctm[4], ctm[5], ctm[6]]),
            magnitude_vec3([ctm[8], ctm[9], ctm[10]]),
        ];

        const R = new Matrix([
            [ctm[0] / scale[0], ctm[4] / scale[1], ctm[8] / scale[2]],
            [ctm[1] / scale[0], ctm[5] / scale[1], ctm[9] / scale[2]],
            [ctm[2] / scale[0], ctm[6] / scale[1], ctm[10] / scale[2]]
        ]);
        const e = new EigenvalueDecomposition(R);
        const axis = e.eigenvectorMatrix.getColumn(0);
        const angle = Math.acos(((ctm[0] / scale[0] + ctm[5] / scale[1] + ctm[10] / scale[2]) - 1) * 0.5)
        rotation = [...axis, angle];

        //  0  4  8 12
        //  1  5  9 13
        //  2  6 10 14
        //  3  7 11 15
    } 
    else if(statement.kind === 'Translate'){
        const p = statement.params as number[];
        const new_mat = mat4_translate(p[0], p[1], p[2]);
        translation = [p[0], p[1], p[2]];
        ctm = mat4_matmul(new_mat, ctm);
    }
    else if(statement.kind === 'Rotate'){
        const p = statement.params as number[];
        const new_mat = mat4_rot_axis([p[1], p[2], p[3]], p[0]);
        rotation = [p[1], p[2], p[3], p[0]];
        ctm = mat4_matmul(new_mat, ctm);
    }
    else if(statement.kind === 'Scale'){
        const p = statement.params as number[];
        const new_mat = mat4_scale(p[0], p[1], p[2]);
        ctm = mat4_matmul(new_mat, ctm);
        scale = [p[0], p[1], p[2]];
    }
    else if(statement.kind === 'Identity'){
        ctm = mat4_identity();
        translation = [0, 0, 0];
        rotation = [1, 0, 0, 0];
        scale = [1, 1, 1];
    }


    else if(statement.kind === 'Shape'){
        // if(shape_counter++ > 100) continue;
        const model_path = statement.attributes[0].values[0] as string;
        if(bad_files.some(file => model_path.includes(file))){
            continue;
        }
    
        if(copy_model_files && !model_path.includes("mesh_custom")){
            fs.copyFileSync(
                `${root_dir}/${model_path}`,
                `${output_directory}/${model_path}`
            );
        }

        final_file_content += `
push 
scale ${scale[0]} ${scale[1]} ${scale[2]}
# rotate 1 0 0 -90
rotate ${rotation[0]} ${rotation[1]} ${rotation[2]} ${rotation[3]}
translate ${translation[0]} ${translation[1]} ${translation[2]} 
model assimp "${model_path}" ${is_light ? "default_light" : current_material }
pop
`;
    }
}

// final_file_content += `
// push
// scale 0.6 0.6 0.6
// rotate 0 1 0 -120
// translate 0 -10 0 
// model assimp "random_lights_many.obj" edf_diffuse
// pop


// push
// scale 0.6 0.6 0.6
// rotate 0 1 0 -120
// translate 0 0 0 
// model assimp "random_lights_many.obj" edf_diffuse
// pop

// push
// scale 0.6 0.6 0.6
// rotate 0 1 0 -120
// translate 0 10 0 
// model assimp "random_lights_many.obj" edf_diffuse
// pop

// push
// scale 0.6 0.6 0.6
// rotate 0 1 0 -120
// translate 0 20 0 
// model assimp "random_lights_many.obj" edf_diffuse
// pop

// `;

final_file_header += 
`# camera setup
center ${camera.center[0]} ${camera.center[1]} ${camera.center[2]}
# camera ${camera.camera[0]} ${camera.camera[1]} ${120} ${camera.camera[3]}
camera -3.05623465766960554 0.5 55 1.0004462426837646
`;

fs.writeFileSync(`${output_directory}/scene.txt`, final_file_header + final_file_content);