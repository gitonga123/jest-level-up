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
    name: 'Daniel',
    dob: 1992
};
user1.id = 5;
user1.name = 'Mutwiri';
var add = function (x, y) { return x + y; };
var sub = function (x, y) { return x - y; };
console.log(add(19, 18));
console.log(sub(15, 15));
