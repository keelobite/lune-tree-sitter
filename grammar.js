/**
 * @file Lune grammar for tree-sitter
 * @author ff <ff>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "lune",

  extras: ($) => [/[ \t\r\n]/, $.comment],  // newlines ignorable again

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) =>
      choice(
        $.routine_declaration,
        $.literal_declaration,
        $.storage_declaration,
        $.overlay_declaration,
        $.cluster_declaration,
        $.bitmask_declaration,
        $.variable_declaration,
        $.call,
        $.attribute,
        $.intrinsic,
        $.string,
        $.char,
        $.hex,
        $.float,
        $.number,
        $.boolean_literal,
        $.primitive_type,
        $.keyword,
        $.identifier,
        $.punctuation,
      ),

    punctuation: ($) => /[^a-zA-Z0-9_\s"'@#<;:=()\[\]]/,

    // -----------------------------------------------------------------------
    // Top-level declarations
    // -----------------------------------------------------------------------
    routine_declaration: ($) => seq("rtn", field("name", $.identifier)),
    literal_declaration: ($) => seq("lit", field("name", $.identifier)),
    storage_declaration: ($) => seq("str", field("name", $.identifier)),
    overlay_declaration: ($) => seq("ovl", field("name", $.identifier)),
    cluster_declaration: ($) => seq("clr", field("name", $.identifier)),
    bitmask_declaration: ($) => seq("msk", field("name", $.identifier)),

    // -----------------------------------------------------------------------
    // Variable declaration:  name : type = value
    //                        name : [type; size]
    // -----------------------------------------------------------------------
    variable_declaration: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $._type),
        optional(seq("=", field("value", $._rhs))),
      ),

    _type: ($) =>
      choice(
        $.primitive_type,
        $.identifier,
        $.array_type,
      ),

    array_type: ($) =>
      seq(
        "[",
        field("element", $._type),
        optional($.specialization_path),
        ";",
        field("size", $.number),
        "]",
      ),

    specialization_path: ($) => seq("::", $.specialization),

    _rhs: ($) =>
      choice(
        $.identifier,
        $.string,
        $.char,
        $.hex,
        $.float,
        $.number,
        $.boolean_literal,
        $.intrinsic,
      ),

    // -----------------------------------------------------------------------
    // Call:  foo(a, b)
    //        foo::<T>(a, b)
    //        foo::()            zero-arg
    //        foo::<T>()         zero-arg with specialization
    // -----------------------------------------------------------------------
    call: ($) =>
      seq(
        field("function", $.identifier),
        optional($.specialization_path),
        "(",
        optional(seq(
          field("argument", $._argument),
          repeat(seq(",", field("argument", $._argument))),
        )),
        ")",
      ),

    _argument: ($) =>
      choice(
        $.identifier,
        $.string,
        $.char,
        $.hex,
        $.float,
        $.number,
        $.boolean_literal,
      ),

    // -----------------------------------------------------------------------
    // Attribute: #[key] or #[key = "value"], optional trailing :
    // -----------------------------------------------------------------------
    attribute: ($) =>
      seq(
        "#[",
        field("key", $.identifier),
        optional(seq("=", field("value", choice($.string, $.identifier)))),
        "]",
        optional(":"),
      ),

    // -----------------------------------------------------------------------
    // Intrinsic: @identifier or @identifier.identifier
    // -----------------------------------------------------------------------
    intrinsic: ($) => /@[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*/,

    // -----------------------------------------------------------------------
    // Specialization: <foo> or <foo, bar>
    // -----------------------------------------------------------------------
    specialization: ($) =>
      /<[A-Za-z_][A-Za-z0-9_]*(,\s*[A-Za-z_][A-Za-z0-9_]*)*>/,

    // -----------------------------------------------------------------------
    // Types / literals
    // -----------------------------------------------------------------------
    primitive_type: ($) =>
      choice(
        "u8",  "u16", "u32", "u64",
        "s8",  "s16", "s32", "s64",
        "f16", "f32", "f64", "addr",
        "vu8x8",  "vu8x16",
        "vu16x4", "vu16x8",
        "vu32x2", "vu32x4",
        "vu64x1", "vu64x2",
        "vs8x8",  "vs8x16",
        "vs16x4", "vs16x8",
        "vs32x2", "vs32x4",
        "vs64x1", "vs64x2",
        "vf32x2", "vf32x4",
        "vf64x1", "vf64x2",
      ),

    boolean_literal: ($) => choice("tru", "fls", "nil"),

    keyword: ($) =>
      choice(
        "pre", "pst", "mut", "ret", "add",
        "map", "aln", "pad", "let", "evl",
        "jmp", "ivk", "mat", "lsl", "lsr"
      ),

    comment: ($) => /\/\/[^\n]*/,

    hex:    ($) => /0x[0-9A-Fa-f]+/,
    float:  ($) => /[0-9]+\.[0-9]+/,
    number: ($) => /[0-9]+/,

    string: ($) => seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"'),
    char:   ($) => /('\\.'|'[^'\\]')/,

    identifier: ($) => /[A-Za-z_][A-Za-z0-9_]*/,
  },
});
