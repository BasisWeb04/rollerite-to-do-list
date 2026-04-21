# CURRENT TASK — To-Do List App (Part 2: Archive + Timestamps)

## Context
Part 1 is done and deployed. It has a working frontend with add, edit, delete, and toggle-complete, all using `useState`. No persistence — state resets on refresh, that's intentional and stays that way.

This session adds two features on top: an Archive view and timestamps on every item.

## Stack additions
- `date-fns` (for relative timestamps like "2 minutes ago")
- shadcn `tabs` component (for Active/Archive switcher)

## Existing files (from Part 1 — do not rewrite from scratch, extend them)
- `types/todo.ts`
- `components/add-todo.tsx`
- `components/todo-item.tsx`
- `components/todo-app.tsx`
- `app/page.tsx`

## Data model changes

Extend the existing `Todo` type in `types/todo.ts`:

```ts
type Todo = {
  id: string;
  text: string;
  completed: boolean;
  archived: boolean;      // NEW
  createdAt: string;      // NEW — ISO string
  updatedAt: string;      // NEW — ISO string, same as createdAt on create
};
```

Every existing `setTodos(...)` call in `todo-app.tsx` needs to set these fields appropriately.

## New files to create
- `lib/format-date.ts` — two helpers:
  - `formatRelative(iso: string): string` — uses `formatDistanceToNow` from date-fns, suffix true, e.g. "2 minutes ago"
  - `formatAbsolute(iso: string): string` — uses `format` from date-fns, e.g. "Apr 20, 2026 3:42 PM"
- `components/view-tabs.tsx` — wraps shadcn `Tabs`, two triggers: `Active ({activeCount})` and `Archive ({archivedCount})`. Takes `view`, `onViewChange`, `activeCount`, `archivedCount` as props.

## Files to modify

### `types/todo.ts`
Add the three new fields per above.

### `components/add-todo.tsx`
When creating a new todo, set `archived: false` and both timestamps to `new Date().toISOString()`. Pass those into `onAdd`, OR change the signature so `onAdd(text: string)` and the parent fills in the rest. Prefer the second — keeps AddTodo dumb.

### `components/todo-item.tsx`
- Add a small muted timestamp line below the text:
  - If `createdAt === updatedAt`: `Added {relative}` with `title={absolute}` for tooltip
  - Else: `Edited {relative}` with `title={absolute}` for tooltip
  - Wrap in `<time dateTime={iso}>` for semantic HTML
- Replace the current action buttons conditionally based on `todo.archived`:
  - Active (not archived): Archive button (`Archive` icon) + Edit (pencil) + Delete (trash)
  - Archived: Restore button (`ArchiveRestore` icon) + Delete (trash). No edit, no checkbox toggle.
- Add `onArchive(id)` and `onRestore(id)` props alongside the existing ones.
- Hide the checkbox on archived items (toggle-complete doesn't apply to archive view).

### `components/todo-app.tsx`
- Add `view` state: `const [view, setView] = useState<'active' | 'archive'>('active')`
- Update every mutation handler:
  - `addTodo`: sets `archived: false`, both timestamps to now
  - `toggleTodo`: updates `updatedAt`
  - `editTodo`: only updates `updatedAt` if text actually changed
  - `deleteTodo`: unchanged, removes from the array entirely
- Add two new handlers:
  - `archiveTodo(id)`: sets `archived: true`, updates `updatedAt`, also cancels edit mode if that row is being edited (handled inside TodoItem via useEffect on `todo.archived`)
  - `restoreTodo(id)`: sets `archived: false`, updates `updatedAt`
- Compute filtered lists:
  - `activeTodos = todos.filter(t => !t.archived)`
  - `archivedTodos = todos.filter(t => t.archived)`
- Header subtitle changes to: `{activeOpen} open · {activeDone} done · {archivedCount} archived`
- Render `<ViewTabs />` below AddTodo
- Render the correct list based on `view`:
  - `view === 'active'`: show AddTodo + `activeTodos`
  - `view === 'archive'`: hide AddTodo, show `archivedTodos`
- Empty states:
  - Active empty: "No tasks yet. Add one above."
  - Archive empty: "Nothing archived."

### `app/page.tsx`
No changes needed.

## Behavior spec

### Timestamps
- Source of truth is the `createdAt`/`updatedAt` fields on each todo
- Relative display updates only on re-render — don't add a ticker or interval, it's fine if "2 minutes ago" is a few seconds stale
- `updatedAt` changes on: toggle, edit (only if text changed), archive, restore
- `updatedAt` does NOT change on: delete (item is gone)

### Archive
- Archive button moves item to archive view, does not delete
- Restore moves it back to active with its `completed` state intact
- Delete works in both views and is permanent
- Can't edit archived items — simpler, avoids weird UX questions

### Tabs
- Clicking a tab just changes the `view` state, no routing
- Counts in tab labels update live

## Out of scope (do NOT add)
- Persistence of any kind — localStorage, sessionStorage, API routes, Supabase, Prisma, nothing
- Auth, multiple lists, categories, due dates, priorities, tags, drag-and-drop, search, filters
- Confirm dialogs, undo toasts, keyboard shortcuts beyond Enter/Escape on edit
- Realtime "time ago" ticker that updates every second
- Editing archived items

## Done criteria
- Adding a task shows "Added just now" under it
- Editing the text changes it to "Edited just now" and the tooltip shows the full timestamp
- Toggling complete updates the timestamp line
- Archive button moves item to Archive tab; it no longer appears in Active
- Restore moves it back; it keeps its completed state
- Delete works in both tabs and is permanent
- Tab counts are accurate at all times
- Header subtitle shows all three counts correctly
- `npm run build` passes with zero errors and zero warnings
- No console errors on load or interaction