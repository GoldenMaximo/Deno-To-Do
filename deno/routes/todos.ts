import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

interface Todo {
    id: string,
    text: string,
}

let todos: Array<Todo> = [];

router.get('/todos', (ctx) => {
    ctx.response.body = { todos }
});

router.post('/todo', async (ctx) => {
    const data = await ctx.request.body().value;
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: data.text
    }

    todos.push(newTodo);

    ctx.response.body = { message: 'Todo created', todo: newTodo };
});

router.put('/todo/:id', async (ctx) => {
    const tid = ctx.params.id;
    const data = await ctx.request.body().value;
    const text = data.text;

    const todoIndex = todos.findIndex(e => e.id === tid);

    todos[todoIndex] = { id: todos[todoIndex].id, text };

    ctx.response.body = { messsage: 'Updated todo' };
});

router.delete('/todo/:id', async (ctx) => {
    const tid = ctx.params.id;

    todos = todos.filter(e => e.id !== tid);

    ctx.response.body = { messsage: 'Updated todo', todos };
});

export default router;