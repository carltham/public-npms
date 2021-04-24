const assert = require("assert");
const Able = require("./dist/Able");

const definition = { foo: ["bar"] };
const abilities = ["foo", "bam"];
console.log("Able = ", Able);
const result = Able.Able.flatten(definition, abilities).sort();
assert.deepStrictEqual(result, ["foo", "bar", "bam"].sort());

console.log("OK!");
