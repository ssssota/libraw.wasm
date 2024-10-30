type Num = "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "f32" | "f64";
type BigIntNum = "u64" | "i64";
type Typ = Num | BigIntNum | "bool" | "char";
type Field<T extends ValueBuilder = ValueBuilder> = {
	name: string;
	builder: T;
};

type BlankObject = NonNullable<unknown>;
type FieldUnion<Fields extends Field[]> = Fields extends [
	{ name: infer Name; builder: infer Builder },
	...infer Rest,
]
	? Name extends string
		? Builder extends ValueBuilder<infer T>
			? Rest extends Field[]
				? { [K in Name]: T } & FieldUnion<Rest>
				: { [K in Name]: T }
			: BlankObject
		: BlankObject
	: BlankObject;

const view = (buf: Uint8Array) => new DataView(buf.buffer);
type ValueBuilderOptions = {
	buf: Uint8Array;
	offset?: number;
	endian?: "little" | "big";
};
interface ValueBuilder<T = unknown> {
	readonly size: number;
	build(opts: ValueBuilderOptions): T;
}

export function StructBuilder(): Struct {
	return new Struct();
}
class Struct<Fields extends Field[] = []> implements ValueBuilder {
	private fields: Field[] = [];
	get size() {
		return this.fields.reduce((acc, f) => acc + f.builder.size, 0);
	}

	field<Name extends string, T>(
		name: Name,
		builder: ValueBuilder<T>,
	): Struct<[...Fields, { name: Name; builder: ValueBuilder<T> }]> {
		this.fields.push({ name, builder });
		return this as unknown as Struct<
			[...Fields, { name: Name; builder: ValueBuilder<T> }]
		>;
	}

	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		const self = this;
		return new Proxy(
			{},
			{
				get(_, prop) {
					if (typeof prop !== "string") return undefined;
					const fieldIndex = self.fields.findIndex((f) => f.name === prop);
					if (fieldIndex === -1) return undefined;
					const fieldOffset = self.fields
						.slice(0, fieldIndex)
						.reduce((acc, f) => acc + f.builder.size, 0);
					const field = self.fields[fieldIndex];
					return field.builder.build({
						buf,
						offset: offset + fieldOffset,
						endian,
					});
				},
			},
		) as FieldUnion<Fields>;
	}
}
export const U8 = {
	size: 1,
	build(opts: { buf: Uint8Array; offset?: number }) {
		const { buf, offset = 0 } = opts;
		return view(buf).getUint8(offset);
	},
} as const satisfies ValueBuilder<number>;
export const I8 = {
	size: 1,
	build(opts: { buf: Uint8Array; offset?: number }) {
		const { buf, offset = 0 } = opts;
		return view(buf).getInt8(offset);
	},
} as const satisfies ValueBuilder<number>;
export const U16 = {
	size: 2,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getUint16(offset, endian === "little");
	},
} as const satisfies ValueBuilder<number>;
export const I16 = {
	size: 2,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getInt16(offset, endian === "little");
	},
} as const satisfies ValueBuilder<number>;
export const U32 = {
	size: 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getUint32(offset, endian === "little");
	},
} as const satisfies ValueBuilder<number>;
export const I32 = {
	size: 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getInt32(offset, endian === "little");
	},
} as const satisfies ValueBuilder<number>;
export const U64 = {
	size: 8,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getBigUint64(offset, endian === "little");
	},
} as const satisfies ValueBuilder<bigint>;
export const I64 = {
	size: 8,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getBigInt64(offset, endian === "little");
	},
} as const satisfies ValueBuilder<bigint>;
export const F32 = {
	size: 4,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getFloat32(offset, endian === "little");
	},
} as const satisfies ValueBuilder<number>;
export const F64 = {
	size: 8,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0, endian = "little" } = opts;
		return view(buf).getFloat64(offset, endian === "little");
	},
} as const satisfies ValueBuilder<number>;
export const Bool = {
	size: 1,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0 } = opts;
		return !!view(buf).getUint8(offset);
	},
} as const satisfies ValueBuilder<boolean>;
export const Char = {
	size: 1,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0 } = opts;
		return String.fromCharCode(view(buf).getUint8(offset));
	},
} as const satisfies ValueBuilder<string>;
export const CharPointerAsString = {
	size: 4,
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
): ValueBuilder<T[]> => ({
	size: builder.size * size,
	build(opts: ValueBuilderOptions) {
		const { buf, offset = 0 } = opts;
		return Array.from({ length: size }, (_, i) =>
			builder.build({ buf, offset: offset + i * builder.size }),
		);
	},
});

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
