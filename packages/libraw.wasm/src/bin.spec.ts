import { expect, it } from "vitest";
import { StructBuilder, typ } from "./bin.js";

it("single field", () => {
	/**
	 * ```c
	 * struct {
	 *   uint8_t a;
	 * }
	 * ```
	 */
	const buf = new Uint8Array([0x01]);
	const schem = StructBuilder().field("a", typ.u8).build({ buf });
	expect(schem.a).toBe(1);
});
it("multiple fields", () => {
	/**
	 * ```c
	 * struct {
	 *   uint8_t a;
	 *   uint8_t b;
	 * }
	 * ```
	 */
	const buf = new Uint8Array([0x01, 0x02]);
	const struct = StructBuilder()
		.field("a", typ.u8)
		.field("b", typ.u8)
		.build({ buf });
	expect(struct.a).toBe(1);
	expect(struct.b).toBe(2);
});
it("offset", () => {
	/**
	 * ```c
	 * struct {
	 *   uint8_t a;
	 *   uint8_t b;
	 * }
	 * ```
	 */
	const buf = new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x02]);
	const struct = StructBuilder()
		.field("a", typ.u8)
		.field("b", typ.u8)
		.build({ buf, offset: 3 });
	expect(struct.a).toBe(1);
	expect(struct.b).toBe(2);
});
it("little endian", () => {
	/**
	 * ```c
	 * struct {
	 *   uint16_t a;
	 * }
	 * ```
	 */
	const buf = new Uint8Array([0x01, 0x00]);
	const struct = StructBuilder()
		.field("a", typ.u16)
		.build({ buf, endian: "little" });
	expect(struct.a).toBe(1);
});
it("big endian", () => {
	/**
	 * ```c
	 * struct {
	 *   uint16_t a;
	 * }
	 * ```
	 */
	const buf = new Uint8Array([0x01, 0x00]);
	const struct = StructBuilder()
		.field("a", typ.u16)
		.build({ buf, endian: "big" });
	expect(struct.a).toBe(256);
});
it("char*", () => {
	/**
	 * ```c
	 * typedef struct {
	 *   char* str;
	 *   size_t len;
	 * } String;
	 * ```
	 */
	// biome-ignore format: binary readability
	const buf = new Uint8Array([
		0x08, 0x00, 0x00, 0x00, // *str
    0x05, 0x00, 0x00, 0x00, // len
    0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, // "Hello"
	]);
	const struct = StructBuilder()
		.field("str", typ.string)
		.field("len", typ.u32)
		.build({ buf });
	expect(struct.str).toBe("Hello");
	expect(struct.len).toBe(5);
});
it("sized array", () => {
	/**
	 * ```c
	 * struct {
	 *   uint8_t arr[3];
	 *   uint8_t length;
	 * }
	 * ```
	 */
	// biome-ignore format: binary readability
	const buf = new Uint8Array([
		0x01, 0x02, 0x03, // arr
		0x03, // length
	]);
	const struct = StructBuilder()
		.field("arr", typ.array(typ.u8, 3))
		.field("length", typ.u8)
		.build({ buf });
	expect(struct.arr).toEqual([1, 2, 3]);
	expect(struct.length).toBe(3);
});
it("nested struct", () => {
	/**
	 * ```c
	 * struct {
	 *   struct {
	 *     uint8_t a;
	 *   } inner;
	 *   uint8_t b;
	 * }
	 * ```
	 */
	const buf = new Uint8Array([0x01, 0xff]);
	const struct = StructBuilder()
		.field("inner", StructBuilder().field("a", typ.u8))
		.field("b", typ.u8)
		.build({ buf });
	expect(struct.inner.a).toBe(1);
	expect(struct.b).toBe(255);
});
