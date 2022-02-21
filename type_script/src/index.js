var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var id = 6;
var company = "OTB AFRICA";
var isPublished = true;
var x = "Hello";
var age = 30;
var ids = [5, 7, 6, 35];
var arr = ["Daniel", "Mutwiri"];
// Tuple - you can define  multiple types
var person = [1, "Daniel", true];
// tuple array
var employee;
employee = [
    [1, "Brad"],
    [2, "John"],
    [3, "Jill"],
];
// union - a variable can hold multiple types
var pid;
// Enum - enumerated types
var Direction1;
(function (Direction1) {
    Direction1[Direction1["Up"] = 0] = "Up";
    Direction1[Direction1["Down"] = 1] = "Down";
    Direction1[Direction1["Left"] = 2] = "Left";
    Direction1[Direction1["Right"] = 3] = "Right";
})(Direction1 || (Direction1 = {}));
var user = {
    id: 1,
    name: "James"
};
console.log(Direction1.Up, Direction1.Down);
console.log(person);
// Type Assertion - telling a compiler we are treating an entity as a different type
var cid = 1;
var customerId = cid;
var customerTrue = true;
// functions
function addNum(x, y) {
    return x + y;
}
//
function addNumVoid(x, y) {
    console.log(x + y);
}
console.log(addNum(5, 4));
var user1 = {
    id: 1,
    name: "Daniel",
    dob: 1992
};
user1.id = 5;
user1.name = "Mutwiri";
var add = function (x, y) { return x + y; };
var sub = function (x, y) { return x - y; };
console.log(add(19, 18));
console.log(sub(15, 15));
// classes
var People = /** @class */ (function () {
    function People(population, nationality, countryCode) {
        this.population = population;
        this.nationality = nationality;
        this.countryCode = countryCode;
    }
    People.prototype.print = function () {
        return "Code: ".concat(this.countryCode, " ").concat(this.nationality, " with ").concat(this.population, " million people");
    };
    return People;
}());
var kenyan = new People(50000000, "Kenyan", 254);
var rwandan = new People(11000000, "Rwandese", 260);
console.log(kenyan.print());
console.log(rwandan.print());
// classes
var PeopleP = /** @class */ (function () {
    function PeopleP(population, nationality, countryCode) {
        this.population = population;
        this.nationality = nationality;
        this.countryCode = countryCode;
    }
    PeopleP.prototype.print = function () {
        return "Code: ".concat(this.countryCode, " ").concat(this.nationality, " with ").concat(this.population, " million people");
    };
    return PeopleP;
}());
var kenya = new PeopleP(50000000, "Kenyan", 254);
var rwanda = new PeopleP(11000000, "Rwandese", 260);
console.log(kenya.print());
console.log(rwanda.print());
// subclass
var National = /** @class */ (function (_super) {
    __extends(National, _super);
    function National(population, nationality, countryCode, id) {
        var _this = _super.call(this, population, nationality, countryCode) || this;
        _this.id = id;
        return _this;
    }
    National.prototype.print = function () {
        return "id: ".concat(this.id, " Code: ").concat(this.countryCode, " ").concat(this.nationality, " with ").concat(this.population, " million people");
    };
    return National;
}(PeopleP));
var kenyanUser = new National(50000000, "Kenyan", 254, 525);
var rwandeseUser = new National(11000000, "Rwandese", 260, 123);
console.log(kenyanUser.print());
console.log(rwandeseUser.print());
// Generics
//  adding generics to ensure type of elements are strict
// same technic can be used on objects, and classes
function getArray(items) {
    return new Array().concat(items);
}
var numArray = getArray([1, 2, 3, 4, 5]);
var strArray = getArray(['Daniel', 'Ann', 'Stephanie']);
numArray.push(150);
strArray.push('Mutwiri');
