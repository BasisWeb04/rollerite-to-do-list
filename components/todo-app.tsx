"use client";

import { useState } from "react";
import { AddTodo } from "@/components/add-todo";
import { TodoItem } from "@/components/todo-item";
import { ViewTabs, type View } from "@/components/view-tabs";
import type { Todo } from "@/types/todo";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<View>("active");

  const activeTodos = todos.filter((t) => !t.archived);
  const archivedTodos = todos.filter((t) => t.archived);
  const activeOpen = activeTodos.filter((t) => !t.completed).length;
  const activeDone = activeTodos.length - activeOpen;
  const archivedCount = archivedTodos.length;

  const handleAdd = (text: string) => {
    const now = new Date().toISOString();
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  };

  const handleToggle = (id: string) => {
    const now = new Date().toISOString();
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t,
      ),
    );
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.text === text) return t;
        return { ...t, text, updatedAt: new Date().toISOString() };
      }),
    );
    setEditingId(null);
  };

  const handleArchive = (id: string) => {
    const now = new Date().toISOString();
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, archived: true, updatedAt: now } : t,
      ),
    );
  };

  const handleRestore = (id: string) => {
    const now = new Date().toISOString();
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, archived: false, updatedAt: now } : t,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const visible = view === "active" ? activeTodos : archivedTodos;
  const emptyMessage =
    view === "active"
      ? "No tasks yet. Add one above."
      : "Nothing archived.";

  return (
    <div className="w-full max-w-xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">To-Do List</h1>
        <p className="text-sm text-muted-foreground">
          {activeOpen} open · {activeDone} done · {archivedCount} archived
        </p>
      </header>

      {view === "active" && <AddTodo onAdd={handleAdd} />}

      <ViewTabs
        view={view}
        onViewChange={setView}
        activeCount={activeTodos.length}
        archivedCount={archivedCount}
      />

      <div className="rounded-lg border bg-card">
        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-y">
            {visible.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                onToggle={handleToggle}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Complete To-Do List
      </p>
    </div>
  );
}
