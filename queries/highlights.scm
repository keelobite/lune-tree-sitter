
; Primitive types
(primitive_type) @type

; Booleans
(boolean_literal) @boolean

; Todo
(todo) @comment.todo

; Comments
(comment) @comment

; Intrinsics
(intrinsic) @keyword.directive

; Specializations
(specialization) @type.parameter

; Numbers
(float) @number.float
(number) @number
(hex) @number

; Strings
(string) @string
(char) @string

; Declaration names
(routine_declaration name: (identifier) @function)
(literal_declaration name: (identifier) @constant)
(storage_declaration name: (identifier) @variable)
(layout_declaration name: (identifier) @variable)
(bitmask_declaration name: (identifier) @variable)

(routine_declaration) @keyword
(literal_declaration) @keyword
(storage_declaration) @keyword
(layout_declaration) @keyword
(bitmask_declaration) @keyword

; Identifiers (fallback)
(identifier) @variable

; Keywords
(keyword) @keyword
