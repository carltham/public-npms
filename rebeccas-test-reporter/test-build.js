const assert = require("assert");
const Able = require("./dist/able");
const Startup = require("./dist/rebecca/index");

const definition = { foo: ["bar"] };
const abilities = ["foo", "bam"];
console.log("Able = ", Able);
const result = Able.flatten(definition, abilities).sort();
assert.deepStrictEqual(result, ["foo", "bar", "bam"].sort());

console.log("OK!");

console.log("Startup = ", Startup);

console.log("OK!");
