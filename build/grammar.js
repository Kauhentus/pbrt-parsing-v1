"use strict";
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
    function id(x) { return x[0]; }
    const moo = require("moo");
    const lexer = moo.compile({
        ws: /[ \t]+/,
        number: /[0-9.\-e]+/,
        string: /"(?:\\["\\]|[^\n"\\])*"/,
        // string: /"[^"]"/,
        lbracket: "[",
        rbracket: "]",
        word: { match: /[a-zA-Z]+/, type: moo.keywords({ times: "x" }) },
        newline: { match: /\n/, lineBreaks: true },
    });
    var grammar = {
        Lexer: lexer,
        ParserRules: [
            { "name": "pbrt_program$ebnf$1", "symbols": [] },
            { "name": "pbrt_program$ebnf$1$subexpression$1$ebnf$1", "symbols": [] },
            { "name": "pbrt_program$ebnf$1$subexpression$1$ebnf$1", "symbols": ["pbrt_program$ebnf$1$subexpression$1$ebnf$1", "attributes"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "pbrt_program$ebnf$1$subexpression$1", "symbols": ["ws", "statement", "pbrt_program$ebnf$1$subexpression$1$ebnf$1"] },
            { "name": "pbrt_program$ebnf$1", "symbols": ["pbrt_program$ebnf$1", "pbrt_program$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "pbrt_program", "symbols": ["pbrt_program$ebnf$1"], "postprocess": (...args) => {
                    return args[0][0].map(args2 => {
                        return {
                            'type': 'statement',
                            'kind': args2[1].kind,
                            'params': args2[1].params,
                            'attributes': args2[2]
                        };
                    });
                }
            },
            { "name": "statement", "symbols": ["film_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["scale_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["lookat_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["camera_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["sampler_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["integrator_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["worldbegin_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["attributebegin_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["attributeend_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["objectbegin_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["objectend_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["objectinstance_statment"], "postprocess": id },
            { "name": "statement", "symbols": ["include_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["rotate_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["translate_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["identity_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["transform_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["concattransform_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["texture_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["makenamedmaterial_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["makenamedmedium_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["namedmaterial_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["shape_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["material_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["mediuminterface_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["arealightsource_statement"], "postprocess": id },
            { "name": "statement", "symbols": ["lightsource_statement"], "postprocess": id },
            { "name": "attributes$ebnf$1", "symbols": [] },
            { "name": "attributes$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"] },
            { "name": "attributes$ebnf$1$subexpression$1$subexpression$1", "symbols": ["string"] },
            { "name": "attributes$ebnf$1$subexpression$1$subexpression$1", "symbols": [{ "literal": "true" }] },
            { "name": "attributes$ebnf$1$subexpression$1", "symbols": ["attributes$ebnf$1$subexpression$1$subexpression$1", "ws"] },
            { "name": "attributes$ebnf$1", "symbols": ["attributes$ebnf$1", "attributes$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "attributes", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "string", (lexer.has("ws") ? { type: "ws" } : ws), { "literal": "[" }, "ws", "attributes$ebnf$1", { "literal": "]" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'attribute',
                        'name': args[0][0 + 1],
                        'values': args[0][4 + 1].map(arg => {
                            return arg[0][0];
                        })
                    };
                }
            },
            { "name": "attributes$subexpression$1", "symbols": ["number"] },
            { "name": "attributes$subexpression$1", "symbols": ["string"] },
            { "name": "attributes$subexpression$1", "symbols": [{ "literal": "true" }] },
            { "name": "attributes", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "string", (lexer.has("ws") ? { type: "ws" } : ws), "attributes$subexpression$1", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'attribute',
                        'name': args[0][0 + 1],
                        'values': [args[0][2 + 1][0]]
                    };
                }
            },
            { "name": "film_statement", "symbols": [{ "literal": "Film" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Film',
                        'params': []
                    };
                }
            },
            { "name": "lookat_statement$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "lookat_statement$ebnf$1", "symbols": ["lookat_statement$ebnf$1$subexpression$1"] },
            { "name": "lookat_statement$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "lookat_statement$ebnf$1", "symbols": ["lookat_statement$ebnf$1", "lookat_statement$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "lookat_statement", "symbols": [{ "literal": "LookAt" }, "lookat_statement$ebnf$1", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'LookAt',
                        'params': args[0][1].map(args2 => {
                            return args2[1];
                        })
                    };
                }
            },
            { "name": "camera_statement", "symbols": [{ "literal": "Camera" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Camera',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "sampler_statement", "symbols": [{ "literal": "Sampler" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Sampler',
                        'params': []
                    };
                }
            },
            { "name": "integrator_statement", "symbols": [{ "literal": "Integrator" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Integrator',
                        'params': []
                    };
                }
            },
            { "name": "worldbegin_statement", "symbols": [{ "literal": "WorldBegin" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'WorldBegin',
                        'params': []
                    };
                }
            },
            { "name": "attributebegin_statement", "symbols": [{ "literal": "AttributeBegin" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'AttributeBegin',
                        'params': []
                    };
                }
            },
            { "name": "attributeend_statement", "symbols": [{ "literal": "AttributeEnd" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'AttributeEnd',
                        'params': []
                    };
                }
            },
            { "name": "objectbegin_statement", "symbols": [{ "literal": "ObjectBegin" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'ObjectBegin',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "objectend_statement", "symbols": [{ "literal": "ObjectEnd" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'ObjectEnd',
                        'params': []
                    };
                }
            },
            { "name": "objectinstance_statment", "symbols": [{ "literal": "ObjectInstance" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'ObjectInstance',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "include_statement", "symbols": [{ "literal": "Include" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Include',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "rotate_statement$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "rotate_statement$ebnf$1", "symbols": ["rotate_statement$ebnf$1$subexpression$1"] },
            { "name": "rotate_statement$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "rotate_statement$ebnf$1", "symbols": ["rotate_statement$ebnf$1", "rotate_statement$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "rotate_statement", "symbols": [{ "literal": "Rotate" }, "rotate_statement$ebnf$1", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Rotate',
                        'params': args[0][1].map(args2 => {
                            return args2[1];
                        })
                    };
                }
            },
            { "name": "translate_statement$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "translate_statement$ebnf$1", "symbols": ["translate_statement$ebnf$1$subexpression$1"] },
            { "name": "translate_statement$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "translate_statement$ebnf$1", "symbols": ["translate_statement$ebnf$1", "translate_statement$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "translate_statement", "symbols": [{ "literal": "Translate" }, "translate_statement$ebnf$1", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Translate',
                        'params': args[0][1].map(args2 => {
                            return args2[1];
                        })
                    };
                }
            },
            { "name": "identity_statement", "symbols": [{ "literal": "Identity" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Identity',
                        'params': []
                    };
                }
            },
            { "name": "scale_statement$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "scale_statement$ebnf$1", "symbols": ["scale_statement$ebnf$1$subexpression$1"] },
            { "name": "scale_statement$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws), "number"] },
            { "name": "scale_statement$ebnf$1", "symbols": ["scale_statement$ebnf$1", "scale_statement$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "scale_statement", "symbols": [{ "literal": "Scale" }, "scale_statement$ebnf$1", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Scale',
                        'params': args[0][1].map(args2 => {
                            return args2[1];
                        })
                    };
                }
            },
            { "name": "transform_statement$ebnf$1", "symbols": [] },
            { "name": "transform_statement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"] },
            { "name": "transform_statement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["string"] },
            { "name": "transform_statement$ebnf$1$subexpression$1", "symbols": ["transform_statement$ebnf$1$subexpression$1$subexpression$1", (lexer.has("ws") ? { type: "ws" } : ws)] },
            { "name": "transform_statement$ebnf$1", "symbols": ["transform_statement$ebnf$1", "transform_statement$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "transform_statement", "symbols": [{ "literal": "Transform" }, (lexer.has("ws") ? { type: "ws" } : ws), { "literal": "[" }, (lexer.has("ws") ? { type: "ws" } : ws), "transform_statement$ebnf$1", { "literal": "]" }, "ws", "o_nl"], "postprocess": (...args) => {
                    // console.log(args[0][4]);
                    return {
                        'type': 'statement',
                        'kind': 'Transform',
                        'params': args[0][4].map(args2 => {
                            return args2[0][0];
                        })
                    };
                }
            },
            { "name": "concattransform_statement$ebnf$1", "symbols": [] },
            { "name": "concattransform_statement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"] },
            { "name": "concattransform_statement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["string"] },
            { "name": "concattransform_statement$ebnf$1$subexpression$1", "symbols": ["concattransform_statement$ebnf$1$subexpression$1$subexpression$1", (lexer.has("ws") ? { type: "ws" } : ws)] },
            { "name": "concattransform_statement$ebnf$1", "symbols": ["concattransform_statement$ebnf$1", "concattransform_statement$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "concattransform_statement", "symbols": [{ "literal": "ConcatTransform" }, (lexer.has("ws") ? { type: "ws" } : ws), { "literal": "[" }, (lexer.has("ws") ? { type: "ws" } : ws), "concattransform_statement$ebnf$1", { "literal": "]" }, "ws", "o_nl"], "postprocess": (...args) => {
                    // console.log(args[0][4]);
                    return {
                        'type': 'statement',
                        'kind': 'ConcatTransform',
                        'params': args[0][4].map(args2 => {
                            return args2[0][0];
                        })
                    };
                }
            },
            { "name": "namedmaterial_statement", "symbols": [{ "literal": "NamedMaterial" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'NamedMaterial',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "shape_statement", "symbols": [{ "literal": "Shape" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Shape',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "arealightsource_statement", "symbols": [{ "literal": "AreaLightSource" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'AreaLightSource',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "lightsource_statement", "symbols": [{ "literal": "LightSource" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'LightSource',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "texture_statement", "symbols": [{ "literal": "Texture" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Texture',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "makenamedmaterial_statement", "symbols": [{ "literal": "MakeNamedMaterial" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'MakeNamedMaterial',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "material_statement", "symbols": [{ "literal": "Material" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'Material',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "mediuminterface_statement", "symbols": [{ "literal": "MediumInterface" }, "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'MediumInterface',
                        'params': []
                    };
                }
            },
            { "name": "makenamedmedium_statement", "symbols": [{ "literal": "MakeNamedMedium" }, (lexer.has("ws") ? { type: "ws" } : ws), "string", "ws", "o_nl"], "postprocess": (...args) => {
                    return {
                        'type': 'statement',
                        'kind': 'MakeNamedMedium',
                        'params': [args[0][2]]
                    };
                }
            },
            { "name": "ws$ebnf$1", "symbols": [] },
            { "name": "ws$ebnf$1", "symbols": ["ws$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "ws", "symbols": ["ws$ebnf$1"] },
            { "name": "ws_r$ebnf$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
            { "name": "ws_r$ebnf$1", "symbols": ["ws_r$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "ws_r", "symbols": ["ws_r$ebnf$1"] },
            { "name": "o_nl$ebnf$1", "symbols": [] },
            { "name": "o_nl$ebnf$1", "symbols": ["o_nl$ebnf$1", { "literal": "\n" }], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "o_nl", "symbols": ["o_nl$ebnf$1"] },
            { "name": "string", "symbols": [(lexer.has("string") ? { type: "string" } : string)], "postprocess": (...args) => {
                    return args[0][0].value.slice(1, -1);
                } },
            { "name": "number", "symbols": [(lexer.has("number") ? { type: "number" } : number)], "postprocess": (...args) => {
                    return parseFloat(args[0][0].value);
                } }
        ],
        ParserStart: "pbrt_program"
    };
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = grammar;
    }
    else {
        window.grammar = grammar;
    }
})();
