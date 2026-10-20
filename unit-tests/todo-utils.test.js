// Node.js ka built-in test runner aur assert (check karne wala tool)
const { test } = require('node:test');
const assert = require('node:assert');

// Jis code ko test karna hai use import karo
const { addTodo, toggleTodo, activeTodos } = require('../src/todo-utils');

// Test 1: naya todo judta hai ya nahi
test('addTodo adds a new todo', () => {
  const todos = addTodo([], 'go for walk');
  assert.strictEqual(todos.length, 1);              // list mein 1 item hona chahiye
  assert.strictEqual(todos[0].title, 'go for walk'); // naam sahi hona chahiye
});

// Test 2: khaali naam pe error aata hai ya nahi
test('addTodo rejects empty title', () => {
  assert.throws(() => addTodo([], '   '));          // error aana hi chahiye
});

// Test 3: complete kiya hua todo active list se hat-ta hai ya nahi
test('activeTodos returns only not-completed todos', () => {
  let todos = addTodo(addTodo([], 'buy grocery'), 'rest');
  todos = toggleTodo(todos, 'buy grocery');         // 'buy grocery' complete
  assert.deepStrictEqual(activeTodos(todos).map((t) => t.title), ['rest']);
});