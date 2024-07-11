class Person {
    constructor(name) {
        this.name = name;
    }

    introduce() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

const otto = new Person("Otto");

otto.introduce(); // Hello, my name is Otto

class userClass {
    constructor() {
        this.users = [];
    }

    create(name, age) {
        this.users.push({ name: name, age: age });
    }

    get() {
        return this.users;
    }
}

var User = new userClass();

console.log(User.get());
