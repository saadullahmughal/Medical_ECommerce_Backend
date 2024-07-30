var myTestObj = {
    userName: "Saad",
    age: 20
};
var x = {};
for (var _i = 0, _a = Object.entries(myTestObj); _i < _a.length; _i++) {
    var _b = _a[_i], key = _b[0], value = _b[1];
    x[key] = value;
}
console.log(x);
console.log(typeof myTestObj, "   ", typeof x);
