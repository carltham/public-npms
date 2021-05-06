import { Initiator } from "./initiator";
// const Initiator = require("./initiator");
console.log("Initiator = ", Initiator);

(function (window) {
  const initiator = new Initiator();
  initiator.init(window);
})(window);
