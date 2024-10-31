type Num = "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "f32" | "f64";
type BigIntNum = "u64" | "i64";
type Typ = Num | BigIntNum | "bool" | "char";
type Field<T extends ValueBuilder = ValueBuilder> = {
	name: string;
	builder: T;
};

type BlankObject = NonNullable<unknown>;
type ObjFromFields<Fields extends Field[]> = Fields extends [
	{ name: infer Name; builder: infer Builder },
	...infer Rest,
]
	? Name extends string
		? Builder extends ValueBuilder<infer T>
			? Rest extends Field[]
				? { [K in Name]: T } & ObjFromFields<Rest>
				: { [K in Name]: T }
			: BlankObject
		: BlankObject
	: BlankObject;

type ValueBuilderOptions = {
	buf: Uint8Array;
	offset?: number;
	endian?: "little" | "big";
};
interface ValueBuilder<
	T = unknown,
	Ctx extends Record<string, unknown> = Record<string, unknown>,
> {
	size(opts: ValueBuilderOptions): number;
	build(opts: ValueBuilderOptions, ctx: Ctx): T;
}

export function StructBuilder(): Struct {
	return new Struct();
}
class Struct<Fields extends Field[] = []> implements ValueBuilder {
	private fields: Field[] = [];
	size(opts: ValueBuilderOptions) {
		return this.fields.reduce((acc, f) => acc + f.builder.size(opts), 0);
	}

	field<Name extends string, T>(
		name: Name,
		builder: ValueBuilder<T, ObjFromFields<Fields>>,
	): Struct<
		[...Fields, { name: Name; builder: ValueBuilder<T, ObjFromFields<Fields>> }]
	> {
		this.fields.push({ name, builder });
		// @ts-expect-error
		return this;
	}

	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		const self = this;
		const ret = new Proxy(
			{},
			{
				get(_, prop) {
					if (typeof prop !== "string") return undefined;
					const fieldIndex = self.fields.findIndex((f) => f.name === prop);
					if (fieldIndex === -1) return undefined;
					const fieldOffset = self.fields
						.slice(0, fieldIndex)
						.reduce((acc, f) => acc + f.builder.size(opts), 0);
					const field = self.fields[fieldIndex];
					return field.builder.build(
						{ buf, offset: offset + fieldOffset, endian },
						ret,
					);
				},
			},
		) as ObjFromFields<Fields>;
		return ret;
	}
}
export const U8 = {
	size: () => 1,
	build(opts: { buf: Uint8Array; offset?: number }) {
		const { buf, offset = 0 } = opts;
		return readU8(buf, offset);
	},
} as const satisfies ValueBuilder<number>;
export const I8 = {
	size: () => 1,
	build(opts: { buf: Uint8Array; offset?: number }) {
		const { buf, offset = 0 } = opts;
		return readI8(buf, offset);
	},
} as const satisfies ValueBuilder<number>;
export const U16 = {
	size: () => 2,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readU16(buf, offset, endian);
	},
} as const satisfies ValueBuilder<number>;
export const I16 = {
	size: () => 2,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readI16(buf, offset, endian);
	},
} as const satisfies ValueBuilder<number>;
export const U32 = {
	size: () => 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readU32(buf, offset, endian);
	},
} as const satisfies ValueBuilder<number>;
export const I32 = {
	size: () => 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readI32(buf, offset, endian);
	},
} as const satisfies ValueBuilder<number>;
export const U64 = {
	size: () => 8,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readU64(buf, offset, endian);
	},
} as const satisfies ValueBuilder<bigint>;
export const I64 = {
	size: () => 8,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readI64(buf, offset, endian);
	},
} as const satisfies ValueBuilder<bigint>;
export const F32 = {
	size: () => 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readF32(buf, offset, endian);
	},
} as const satisfies ValueBuilder<number>;
export const F64 = {
	size: () => 8,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return readF64(buf, offset, endian);
	},
} as const satisfies ValueBuilder<number>;
export const Bool = {
	size: () => 1,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0 } = opts;
		return readBool(buf, offset);
	},
} as const satisfies ValueBuilder<boolean>;
export const Char = {
	size: () => 1,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0 } = opts;
		return readChar(buf, offset);
	},
} as const satisfies ValueBuilder<string>;
export const CharPointerAsString = {
	size: () => 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		const ptr = view(buf).getUint32(offset, endian === "little");
		const zeorIndex = buf.indexOf(0, ptr);
		return new TextDecoder().decode(buf.slice(ptr, zeorIndex));
	},
} as const satisfies ValueBuilder<string>;
export const SizedArray = <T>(
	builder: ValueBuilder<T>,
	size: number,
): ValueBuilder<T[]> => {
	return {
		size: (opts: ValueBuilderOptions) => size * builder.size(opts),
		build(opts: ValueBuilderOptions) {
			const { buf, offset = 0 } = opts;
			return Array.from({ length: size }, (_, i) =>
				builder.build({ buf, offset: offset + i * builder.size(opts) }, {}),
			);
		},
	};
};

export const typ = {
	u8: U8,
	u16: U16,
	u32: U32,
	u64: U64,
	i8: I8,
	i16: I16,
	i32: I32,
	i64: I64,
	f32: F32,
	f64: F64,
	bool: Bool,
	char: Char,
	string: CharPointerAsString,
	array: SizedArray,
} as const satisfies { [K in Typ]: ValueBuilder } & Record<string, unknown>;

export function view(buf: Uint8Array) {
	return new DataView(buf.buffer);
}
export function readU8(buf: Uint8Array, offset = 0) {
	return view(buf).getUint8(offset);
}
export function readI8(buf: Uint8Array, offset = 0) {
	return view(buf).getInt8(offset);
}
export function readU16(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getUint16(offset, endian === "little");
}
export function readI16(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getInt16(offset, endian === "little");
}
export function readU32(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getUint32(offset, endian === "little");
}
export function readI32(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getInt32(offset, endian === "little");
}
export function readU64(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getBigUint64(offset, endian === "little");
}
export function readI64(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getBigInt64(offset, endian === "little");
}
export function readF32(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getFloat32(offset, endian === "little");
}
export function readF64(
	buf: Uint8Array,
	offset = 0,
	endian: "little" | "big" = "little",
) {
	return view(buf).getFloat64(offset, endian === "little");
}
export function readBool(buf: Uint8Array, offset = 0) {
	return !!view(buf).getUint8(offset);
}
export function readChar(buf: Uint8Array, offset = 0) {
	return String.fromCharCode(view(buf).getUint8(offset));
}
