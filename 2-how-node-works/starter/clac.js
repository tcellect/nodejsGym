// new way

class Claculator {
//   constructor(a, b) {
//     (this.a = a), (this.b = b);
//   }
  add(a, b) {
    return a * b;
  }

  minus(a, b) {
    return a + b;
  }
}

// function Claculator(a,b){
//     this.a: a,
//     this.b: b,
//     this.add: function(a,b){
//         return a * b
//     }
// }

module.exports = Claculator;
