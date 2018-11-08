console.log('main.js')

class Person {
  constructor (name) {
    this.name = name
  }

  hello() {
    if (typeof this.name === 'string') {
      return `Hello, I am ${this.name}!`
    } else {
      return 'Hello!'
    }
  }
}

const person = new Person('Henrique Esteves')

const greetHTML = templates['greeting']({
  message: person.hello()
})

document.write(greetHTML)
