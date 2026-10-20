// Todo list ke chhote-chhote functions (inka unit test hoga)

// Naya todo list mein jodta hai
function addTodo(todos, title) {
  const text = String(title || '').trim();          // aage-peeche ke space hatao
  if (!text) throw new Error('Todo title cannot be empty'); // khaali naam allowed nahi
  return [...todos, { title: text, completed: false }];     // purani list + naya todo
}

// Todo ko complete / incomplete karta hai
function toggleTodo(todos, title) {
  return todos.map((t) => (t.title === title ? { ...t, completed: !t.completed } : t));
}

// Sirf adhoore (active) todos deta hai
function activeTodos(todos) {
  return todos.filter((t) => !t.completed);
}

// Teeno functions bahar (test file ke liye) available karo
module.exports = { addTodo, toggleTodo, activeTodos };