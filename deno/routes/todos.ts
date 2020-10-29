import { Router } from "https://deno.land/x/oak/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";

import { getDb } from '../helpers/db_clients.ts';

const router = new Router();

interface Todo {
    id?: string,
    text: string,
}

interface TodoSchema {
    _id: {
        $oid: string
    };
    text: string;
}

let todos: Array<Todo> = [];

router.get('/todos', async ctx => {
    const todos = await getDb().collection<TodoSchema>('todos').find();
    const formattedTodos = todos.map((todo: { _id: ObjectId, text: string }) => {
        return {
            id: todo._id.$oid,
            text: todo.text
        }
    });
    ctx.response.body = { todos: formattedTodos };
});

router.post('/todo', async (ctx) => {
    const data = await ctx.request.body().value;
    const newTodo: Todo = {
        text: data.text
    }

    let id: {
        $oid: string
    };

    try {
        id = await getDb().collection<TodoSchema>('todos').insertOne(newTodo);
        newTodo.id = id.$oid;
    } catch (err) {
        console.log(err);
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