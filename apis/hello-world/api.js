  var hello = {};
  hello.randomGreetings = ['Hello there!', 'Howdy!', 'Greetings!'];

  hello.getRandomGreeting = function() {
    return this.randomGreetings[Math.floor(Math.random() * this.randomGreetings.length)];
  }

module.exports = hello;
