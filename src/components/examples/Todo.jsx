import React, { useEffect, useState } from 'react';

// Simple shape for each todo item
// { id: number, text: string, completed: boolean }

const LOCAL_STORAGE_KEY = 'todoapp_todos';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Load initial todos from localStorage (Bonus: persistence)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage', error);
    }
  }, []);

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage', error);
    }
  }, [todos]);

  // Controlled input for new todo (Tests: controlled inputs, useState)
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add todo (ignore empty / whitespace-only)
  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
      },
    ]);

    setInputValue('');
  };

  // Delete todo
  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Toggle completed
  const handleToggleCompleted = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start editing a todo (Bonus: edit)
  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.text);
  };

  const handleChangeEdit = (event) => {
    setEditingValue(event.target.value);
  };

  const handleSaveEdit = (id) => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      // If edit becomes empty, do not save
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const isAddDisabled = inputValue.trim().length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Todo List</h2>
        <p className="text-sm text-gray-500">
          Add tasks, mark them complete, edit or remove them. Data persists in localStorage.
        </p>
      </div>

      {/* Add todo form */}
      <form
        onSubmit={handleAddTodo}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={isAddDisabled}
          className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 ${
            isAddDisabled
              ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
          }`}
        >
          Add
        </button>
      </form>

      {/* Todo list */}
      <div className="mt-2">
        {todos.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No todos yet. Add your first task!</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => {
              const isEditing = editingId === todo.id;

              return (
                <li
                  key={todo.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      id={`todo-${todo.id}`}
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleCompleted(todo.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    {isEditing ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={handleChangeEdit}
                        className="flex-1 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    ) : (
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`flex-1 text-sm ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </label>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(todo.id)}
                          className="px-3 py-1 rounded-md text-xs font-semibold bg-green-500 text-white hover:bg-green-600 active:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 active:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(todo)}
                          className="px-3 py-1 rounded-md text-xs font-semibold bg-yellow-400 text-yellow-900 hover:bg-yellow-500 active:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Todo;