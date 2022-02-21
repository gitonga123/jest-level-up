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
let cid: any = 1;
let customerId = <number>cid;
let customerTrue = <boolean>true;

// functions

function addNum(x: number, y: number): number {
  return x + y;
}

//
function addNumVoid(x: number, y: number): void {
  console.log(x + y);
}

console.log(addNum(5, 4));

// Interfaces

interface UserInterface {
  id: number;
  name: string;
  age?: number;
  readonly dob: number;
}

const user1: UserInterface = {
  id: 1,
  name: "Daniel",
  dob: 1992,
};

user1.id = 5;
user1.name = "Mutwiri";

interface MathFunc {
  (x: number, y: number): number;
}

const add: MathFunc = (x: number, y: number): number => x + y;

const sub: MathFunc = (x: number, y: number): number => x - y;

console.log(add(19, 18));
console.log(sub(15, 15));

// classes
class People {
  population: number;
  nationality: string;
  protected countryCode: number;

  constructor(population: number, nationality: string, countryCode: number) {
    this.population = population;
    this.nationality = nationality;
    this.countryCode = countryCode;
  }

  print() {
    return `Code: ${this.countryCode} ${this.nationality} with ${this.population} million people`;
  }
}

const kenyan = new People(50000000, "Kenyan", 254);
const rwandan = new People(11000000, "Rwandese", 260);

console.log(kenyan.print());
console.log(rwandan.print());

interface PeopleInterface {
  population: number;
  nationality: string;
  countryCode: number;
  print(): string;
}

// classes

class PeopleP implements PeopleInterface {
  population: number;
  nationality: string;
  countryCode: number;

  constructor(population: number, nationality: string, countryCode: number) {
    this.population = population;
    this.nationality = nationality;
    this.countryCode = countryCode;
  }

  print() {
    return `Code: ${this.countryCode} ${this.nationality} with ${this.population} million people`;
  }
}

const kenya = new PeopleP(50000000, "Kenyan", 254);
const rwanda = new PeopleP(11000000, "Rwandese", 260);

console.log(kenya.print());
console.log(rwanda.print());

// subclass
class National extends PeopleP implements PeopleInterface {
	private id: number;


  constructor(population: number, nationality: string, countryCode: number, id: number) {
	super(population, nationality, countryCode);
	this.id = id;
  }

  print() {
    return `id: ${this.id} Code: ${this.countryCode} ${this.nationality} with ${this.population} million people`;
  }
}

const kenyanUser = new National(50000000, "Kenyan", 254, 525);
const rwandeseUser = new National(11000000, "Rwandese", 260, 123);

console.log(kenyanUser.print());
console.log(rwandeseUser.print());

// Generics
//  adding generics to ensure type of elements are strict
// same technic can be used on objects, and classes
function getArray<T>(items: T[]): T[] {
	return new Array().concat(items);
}

let numArray = getArray<number>([1,2,3,4,5]);
let strArray = getArray<string>(['Daniel', 'Ann', 'Stephanie']);

numArray.push(150);
strArray.push('Mutwiri');

