"use client";

import { useEffect, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Check,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatAbsolute, formatRelative } from "@/lib/format-date";
import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, text: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({
  todo,
  isEditing,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onArchive,
  onRestore,
  onDelete,
}: TodoItemProps) {
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(todo.text);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing, todo.text]);

  useEffect(() => {
    if (isEditing && todo.archived) onCancelEdit();
  }, [isEditing, todo.archived, onCancelEdit]);

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSaveEdit(todo.id, trimmed);
  };

  const wasEdited = todo.updatedAt !== todo.createdAt;
  const stampIso = wasEdited ? todo.updatedAt : todo.createdAt;
  const stampLabel = `${wasEdited ? "Edited" : "Added"} ${formatRelative(stampIso)}`;

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      {!todo.archived && (
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked) => {
            if (todo.completed !== Boolean(checked)) onToggle(todo.id);
          }}
          className="mt-1"
          aria-label={todo.completed ? "Mark as open" : "Mark as done"}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              } else if (e.key === "Escape") {
                e.preventDefault();
                onCancelEdit();
              }
            }}
            aria-label="Edit task"
          />
        ) : (
          <span
            className={cn(
              "text-sm break-words",
              todo.completed && "line-through text-muted-foreground",
            )}
          >
            {todo.text}
          </span>
        )}
        <time
          dateTime={stampIso}
          title={formatAbsolute(stampIso)}
          className="text-xs text-muted-foreground"
        >
          {stampLabel}
        </time>
      </div>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={save}
              disabled={!draft.trim()}
              aria-label="Save"
            >
              <Check />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onCancelEdit}
              aria-label="Cancel edit"
            >
              <X />
            </Button>
          </>
        ) : todo.archived ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRestore(todo.id)}
            aria-label="Restore"
          >
            <ArchiveRestore />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onArchive(todo.id)}
              aria-label="Archive"
            >
              <Archive />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onStartEdit(todo.id)}
              aria-label="Edit"
            >
              <Pencil />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
        >
          <Trash2 />
        </Button>
      </div>
    </li>
  );
}
