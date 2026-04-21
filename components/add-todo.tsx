"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTodoProps = {
  onAdd: (text: string) => void;
};

export function AddTodo({ onAdd }: AddTodoProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="What needs to be done?"
        aria-label="New task"
      />
      <Button onClick={submit} disabled={!value.trim()}>
        <Plus />
        Add
      </Button>
    </div>
  );
}
