@{%
const moo = require("moo");

const lexer = moo.compile({
    ws:     /[ \t]+/,
    number: /[0-9.\-e]+/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    // string: /"[^"]"/,
    lbracket: "[",
    rbracket: "]",
    word: { match: /[a-zA-Z]+/, type: moo.keywords({ times: "x" }) },
    newline: { match: /\n/, lineBreaks: true },
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

pbrt_program -> 
      (ws statement attributes:*):* {%
        (...args) => {
            return args[0][0].map(args2 => {

                return {
                    'type': 'statement',
                    'kind': args2[1].kind,
                    'params': args2[1].params,
                    'attributes': args2[2]
                };
            })
        }
    %}

statement -> 
      film_statement {% id %}
    | scale_statement {% id %}
    | lookat_statement {% id %}
    | camera_statement {% id %}
    | sampler_statement {% id %}
    | integrator_statement {% id %}
    | worldbegin_statement {% id %}

    | attributebegin_statement {% id %}
    | attributeend_statement {% id %}
    | objectbegin_statement {% id %}
    | objectend_statement {% id %}
    | objectinstance_statment {% id %}
    | include_statement {% id %}

    | rotate_statement {% id %}
    | translate_statement {% id %}
    | identity_statement {% id %}
    | transform_statement {% id %}
    | concattransform_statement {% id %}

    | texture_statement {% id %}
    | makenamedmaterial_statement {% id %}
    | makenamedmedium_statement {% id %}
    | namedmaterial_statement {% id %}
    | shape_statement {% id %}
    | material_statement {% id %}
    | mediuminterface_statement  {% id %}

    | arealightsource_statement {% id %}
    | lightsource_statement {% id %}

attributes ->
      %ws string %ws "[" ws ((number | string | "true") ws):* "]" ws o_nl {%
        (...args) => {
            return {
                'type': 'attribute',
                'name': args[0][0 + 1],
                'values': args[0][4 + 1].map(arg => {
                    return arg[0][0];
                })
            }
        }
      %}
    | %ws string %ws (number | string | "true") ws o_nl {%
        (...args) => {
            return {
                'type': 'attribute',
                'name': args[0][0 + 1],
                'values': [args[0][2 + 1][0]]
            }
        }
      %}


film_statement -> "Film" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Film',
            'params': []
        }
    }
%}

lookat_statement -> "LookAt" (%ws number):+ ws o_nl {% 
    (...args) => {

        return {
            'type': 'statement',
            'kind': 'LookAt',
            'params': args[0][1].map(args2 => {
                return args2[1]
            })
        }
    }
%}

camera_statement -> "Camera" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Camera',
            'params': [args[0][2]]
        }
    }
%}

sampler_statement -> "Sampler" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Sampler',
            'params': []
        }
    }
%}

integrator_statement -> "Integrator" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Integrator',
            'params': []
        }
    }
%}

worldbegin_statement -> "WorldBegin" ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'WorldBegin',
            'params': []
        }
    }
%}



attributebegin_statement -> "AttributeBegin" ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'AttributeBegin',
            'params': []
        }
    }
%}

attributeend_statement -> "AttributeEnd" ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'AttributeEnd',
            'params': []
        }
    }
%}

objectbegin_statement -> "ObjectBegin" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'ObjectBegin',
            'params': [args[0][2]]
        }
    }
%}

objectend_statement -> "ObjectEnd" ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'ObjectEnd',
            'params': []
        }
    }
%}

objectinstance_statment -> "ObjectInstance" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'ObjectInstance',
            'params': [args[0][2]]
        }
    }
%}

include_statement -> "Include" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Include',
            'params': [args[0][2]]
        }
    }
%}

rotate_statement -> "Rotate" (%ws number):+ ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Rotate',
            'params': args[0][1].map(args2 => {
                return args2[1]
            })
        }
    }
%}

translate_statement -> "Translate" (%ws number):+ ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Translate',
            'params': args[0][1].map(args2 => {
                return args2[1]
            })
        }
    }
%}

identity_statement -> "Identity" ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Identity',
            'params': []
        }
    }
%}

scale_statement -> "Scale" (%ws number):+ ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Scale',
            'params': args[0][1].map(args2 => {
                return args2[1]
            })
        }
    }
%}

transform_statement -> "Transform" %ws "[" %ws ((number | string) %ws):* "]" ws o_nl {% 
    (...args) => {
        // console.log(args[0][4]);
        return {
            'type': 'statement',
            'kind': 'Transform',
            'params': args[0][4].map(args2 => {
                return args2[0][0]
            })
        }
    }
%}

concattransform_statement -> "ConcatTransform" %ws "[" %ws ((number | string) %ws):* "]" ws o_nl {% 
    (...args) => {
        // console.log(args[0][4]);
        return {
            'type': 'statement',
            'kind': 'ConcatTransform',
            'params': args[0][4].map(args2 => {
                return args2[0][0]
            })
        }
    }
%}

namedmaterial_statement -> "NamedMaterial" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'NamedMaterial',
            'params': [args[0][2]]
        }
    }
%}

shape_statement -> "Shape" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Shape',
            'params': [args[0][2]]
        }
    }
%}

arealightsource_statement -> "AreaLightSource" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'AreaLightSource',
            'params': [args[0][2]]
        }
    }
%}

lightsource_statement -> "LightSource" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'LightSource',
            'params': [args[0][2]]
        }
    }
%}

texture_statement -> "Texture" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Texture',
            'params': [args[0][2]]
        }
    }
%}

makenamedmaterial_statement -> "MakeNamedMaterial" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'MakeNamedMaterial',
            'params': [args[0][2]]
        }
    }
%}

material_statement -> "Material" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'Material',
            'params': [args[0][2]]
        }
    }
%}

mediuminterface_statement -> "MediumInterface" ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'MediumInterface',
            'params': []
        }
    }
%}

makenamedmedium_statement -> "MakeNamedMedium" %ws string ws o_nl {% 
    (...args) => {
        return {
            'type': 'statement',
            'kind': 'MakeNamedMedium',
            'params': [args[0][2]]
        }
    }
%}



ws -> %ws:* 

ws_r -> %ws:+

o_nl -> "\n":*

string -> %string {% (...args) => {
    return args[0][0].value.slice(1, -1);
} %}

number -> %number {% (...args) => {
    return parseFloat(args[0][0].value);
} %}