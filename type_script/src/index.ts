let id: number = 6;
let company: string = "OTB AFRICA";
let isPublished: boolean = true;
let x: any = "Hello";

let age: number = 30;

let ids: number[] = [5, 7, 6, 35];

let arr: any[] = ["Daniel", "Mutwiri"];

// Tuple - you can define  multiple types
let person: [number, string, boolean] = [1, "Daniel", true];

// tuple array

let employee: [number, string][];

employee = [
  [1, "Brad"],
  [2, "John"],
  [3, "Jill"],
];

// union - a variable can hold multiple types

let pid: string | number;

// Enum - enumerated types
enum Direction1 {
  Up,
  Down,
  Left,
  Right,
}

// Objects
type User = {
  id: Number;
  name: String;
};

const user: User = {
  id: 1,
  name: "James",
};

console.log(Direction1.Up, Direction1.Down);
console.log(person);

// Type Assertion - telling a compiler we are treating an entity as a different type
let cid: any = 1
let customerId = <number>cid;
let customerTrue = <boolean>true;

