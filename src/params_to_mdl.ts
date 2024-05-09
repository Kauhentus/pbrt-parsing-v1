import * as fs from 'fs';

export type MDL_Params = {
    material_name: string;

    has_roughness: boolean;
    has_type: boolean;
    has_color_texture: boolean;
    has_normal_map: boolean;
    has_rgb_reflectance: boolean;
    has_mix_materials: boolean;

    roughness: number;
    type: string;
    color_texture: string;
    normal_map_path: string;
    rgb_reflectance: number[];
    mix_materials: string[];
}

export const params_to_mdl = (
    params: MDL_Params,
    texture_dictionary: Map<string, string>,
    output_directory: string,
    mdl_folder_name: string,
    log: boolean
) => {
    const material_name = params.material_name;

    if(log) console.log(params)

    let mdl_program: string;

    if(params.type === 'coateddiffuse' && params.has_color_texture){
        mdl_program = 
`mdl 1.7;
import ::df::*;
import ::tex::*;
import ::base::*;

export material ${material_name}(
    uniform color parDiffuseTint  = color(1.0, 1.0, 1.0),
    uniform texture_2d parTexture = texture_2d("./${texture_dictionary.get(params.color_texture)}", tex::gamma_srgb),
    uniform float3 parRotation    = float3(0.0), 
    uniform float3 parTranslation = float3(0.0, 0.0, 0.0), 
    uniform float3 parScaling     = float3(1.0)
)
= let {
    base::texture_return tint_mono = base::file_texture(
        texture: parTexture,
        color_scale:  color(1.0),
        color_offset: color(0.0),
        uvw:     base::transform_coordinate(
                transform:  base::rotation_translation_scale(rotation: parRotation, translation: parTranslation, scaling: parScaling),
                coordinate: base::coordinate_source(coordinate_system: base::texture_coordinate_uvw, texture_space: 0)
                ),
        mono_source: base::mono_average
    );
} in material(
    surface: material_surface(
        scattering: df::diffuse_reflection_bsdf(
            tint:      parDiffuseTint * tint_mono.tint
        )
    )
);
`;
    } 

    else if(params.type === 'coateddiffuse' && params.has_rgb_reflectance){
        mdl_program = 
    `mdl 1.7;
    import ::df::*;

    export material ${material_name}(
    uniform color parDiffuseTint = color(${params.rgb_reflectance[0]}, ${params.rgb_reflectance[1]}, ${params.rgb_reflectance[2]}),
    uniform float parDiffuseRoughness = ${params.roughness}
    )
    = 
    material(
    surface: material_surface(
        scattering: df::diffuse_reflection_bsdf(
        tint:      parDiffuseTint,
        roughness: parDiffuseRoughness
        )
    )
    );

// `;
// `mdl 1.4;
// import ::df::*;
// import ::anno::*;

// export material ${material_name}(
//   uniform float parLayerIorR        = 1.5 [[anno::hard_range(0.0, 5.0)]],
//   uniform float parLayerIorG        = 1.5 [[anno::hard_range(0.0, 5.0)]],
//   uniform float parLayerIorB        = 1.5 [[anno::hard_range(0.0, 5.0)]],
//   uniform color parLayerWeight      = color(1.0),
//   uniform color parSpecularTint     = color(1.0),
//   uniform color parDiffuseTint      = color(${params.rgb_reflectance[0]}, ${params.rgb_reflectance[1]}, ${params.rgb_reflectance[2]})
//   , uniform float parDiffuseRoughness = ${params.roughness}
// )
// = 
// material(
//   surface: material_surface(
//     scattering: df::color_fresnel_layer(
//       ior:    color(parLayerIorR, parLayerIorG, parLayerIorB),
//       weight: parLayerWeight,
//       layer: df::specular_bsdf(
//         tint: parSpecularTint,
//         mode: df::scatter_reflect
//       ),
//       base: df::diffuse_reflection_bsdf(
//         tint:      parDiffuseTint
//         , roughness: parDiffuseRoughness
//       )
//     )
//   )
// );

// `;
    }
    
    else if(params.type === 'diffuse' && params.has_color_texture){
        mdl_program = 
`mdl 1.7;
import ::df::*;
import ::tex::*;
import ::base::*;

export material ${material_name}(
    uniform color parDiffuseTint  = color(1.0, 1.0, 1.0),
    uniform texture_2d parTexture = texture_2d("./${texture_dictionary.get(params.color_texture)}", tex::gamma_srgb),
    uniform float3 parRotation    = float3(0.0), 
    uniform float3 parTranslation = float3(0.0, 0.0, 0.0), 
    uniform float3 parScaling     = float3(1.0)
)
= let {
    base::texture_return tint_mono = base::file_texture(
        texture: parTexture,
        color_scale:  color(1.0),
        color_offset: color(0.0),
        uvw:     base::transform_coordinate(
                transform:  base::rotation_translation_scale(rotation: parRotation, translation: parTranslation, scaling: parScaling),
                coordinate: base::coordinate_source(coordinate_system: base::texture_coordinate_uvw, texture_space: 0)
                ),
        mono_source: base::mono_average
    );
} in material(
    surface: material_surface(
        scattering: df::diffuse_reflection_bsdf(
            tint:      parDiffuseTint * tint_mono.tint
        )
    )
);
`;
    }

    else if(params.type === 'diffuse' && params.has_rgb_reflectance){
        mdl_program = 
`mdl 1.7;
import ::df::*;

export material ${material_name}(
  uniform color parDiffuseTint = color(${params.rgb_reflectance[0]}, ${params.rgb_reflectance[1]}, ${params.rgb_reflectance[2]})
)
= 
material(
  surface: material_surface(
    scattering: df::diffuse_reflection_bsdf(
      tint:      parDiffuseTint
    )
  )
);
`;
    }

    else if(params.type === 'dielectric'){
        mdl_program = 
`mdl 1.7;
import ::df::*;
import ::math::*;
import ::base::*;
import ::state::*;

export material ${material_name}(
    color transmission_color = color(1.0),
    uniform color glass_color = color(.95),
    float roughness = 0.0,
    uniform float ior = 1.4,
    uniform float base_thickness = .1,
    float3 normal = state::normal(),
    uniform float abbe_number = 0.0
)
 = let{
    bsdf glossy_bsdf = df::microfacet_ggx_smith_bsdf(
        mode: df::scatter_reflect,
        tint: color(1.),
        roughness_u: roughness*roughness
    );
    bsdf glossy_bsdf_transmission = df::microfacet_ggx_smith_bsdf(
        mode: df::scatter_transmit,
        tint: transmission_color,
        roughness_u: roughness*roughness
    );
} in material(
    thin_walled: false,
    surface: material_surface(
        df::weighted_layer(
            normal: normal,
            weight: 1.,
            layer: df::fresnel_layer(
                layer: glossy_bsdf,
                base: glossy_bsdf_transmission,
                ior: ior,
                normal: normal
            )
        )
    ),
    volume: material_volume(
        absorption_coefficient: (base_thickness <= 0)? color(0): math::log(glass_color) / -base_thickness
    ),
    ior: abbe_number == 0.0?color(ior):base::abbe_number_ior(ior, abbe_number)
);`; 
    }

    else if(params.type === 'conductor' || params.type === 'coatedconductor'){
        mdl_program = 
`mdl 1.7;
import ::df::*;
import ::math::*;
import ::base::*;
import ::state::*;

export material ${material_name}(
    color metal_color = color(.9),
    float roughness = 0.2,
    float glossy_weight = .9,
    float anisotropy = 0.0,
    float anisotropy_rotation = 0.0,
    float3 normal = state::normal()
) = let {
    base::anisotropy_return anisotropy_values = base::anisotropy_conversion(
        roughness: roughness*roughness,
        anisotropy: anisotropy,
        anisotropy_rotation: anisotropy_rotation
    );
    bsdf glossy_bsdf = df::microfacet_ggx_smith_bsdf(
        mode: df::scatter_reflect,
        tint: metal_color,
        roughness_u: anisotropy_values.roughness_u,
        roughness_v: anisotropy_values.roughness_v,
        tangent_u: anisotropy_values.tangent_u
    );
} in material(
    thin_walled: true,
    surface: material_surface(
        scattering: df::weighted_layer(
            weight: 1.,
            normal: normal,
            layer: df::weighted_layer(
                weight: glossy_weight,
                layer: glossy_bsdf,
                base: df::diffuse_reflection_bsdf(
                    roughness: 0.0,
                    tint: metal_color
                ),
                normal: normal
            )
        )
    )
);
`;
    }

    // else if(params.type === 'mix') {
    //     const new_params = JSON.parse(JSON.stringify(params));
    //     new_params.material_name = params.mix_materials[0];
    //     params_to_mdl(new_params, texture_dictionary, output_directory, mdl_folder_name);
    //     return;
    // }

    else {
        mdl_program = 
`mdl 1.7;
import ::df::*;

export material ${material_name}(
  uniform color parDiffuseTint = color(1.0) // color(0.980392, 0.729412, 0.470588)
  // , uniform float parDiffuseRoughness = 0.0
)
= 
material(
  surface: material_surface(
    scattering: df::diffuse_reflection_bsdf(
      tint:      parDiffuseTint
      // , roughness: parDiffuseRoughness
    )
  )
);
`;
    }

    fs.writeFileSync(`${output_directory}/${mdl_folder_name}/${material_name}.mdl`, mdl_program);    
}