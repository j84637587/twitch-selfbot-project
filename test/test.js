const assert = require("chai").assert;
const expect = require("chai").expect;
const app = require("../app");

describe("regex test", function () {
    context('alice_regex_follow test 1', function () {
        it("should equal to a", function () {
            var result = app.getUsername(app.alice_regex_follow, '謝謝 b (a) 因為想愛愛所以追隨了！');
            var expected = "a";
            expect(result).to.be.equal(expected);
        });
    });
    
    context('alice_regex_follow test 2', function () {
        it("should equal to a", function () {
            var result = app.getUsername(app.alice_regex_follow, '謝謝 b 因為想愛愛所以追隨了！');
            var expected = "b";
            expect(result).to.be.equal(expected);
        });
    });
});