import { Config } from "./config";
import { expect } from "chai";

describe("Config", () => {
  it("adds 1 + 2 to equal 3", () => {
    expect(Config.suppressExcluded).to.be.equal(false);
  });

  // it(`should have as title 'Welcome to the Employee List app !'`, () => {
  //   const fixture = TestBed.createComponent(UserController);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual("Welcome to the Employee List app !");
  // });
});
