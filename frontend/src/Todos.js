import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Paper,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import format from "date-fns/format";
import TodoItem from "./TodoItem";
import TodoFactory from "./TodoFactory";

const useStyles = makeStyles({
  todosContainer: { marginTop: 10, padding: 10 },
  filterContainer: { marginTop: 10, marginLeft: 5 },
});

function Todos() {
  const baseURL = "http://localhost:3001/";
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [showTasksDueToday, setShowTasksDueToday] = useState(false);

  useEffect(() => {
    const queryParamsObj = {};

    if (showTasksDueToday) {
      queryParamsObj.dueDate = format(new Date(), "yyyy-MM-dd");
    }
    const queryParams = new URLSearchParams(queryParamsObj).toString();

    fetch(`${baseURL}?${queryParams}`)
      .then((response) => response.json())
      .then((todos) => setTodos(todos));
  }, [setTodos, showTasksDueToday]);

  function addTodo(text, dueDate) {
    fetch(baseURL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text,
        ...(dueDate && { dueDate }),
      }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
  }

  function toggleTodoCompleted(id) {
    fetch(`${baseURL}${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function setTodoDueDate(id, dueDate) {
    fetch(`${baseURL}${id}/due-date`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        dueDate,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        dueDate,
      };
      setTodos(newTodos);
    });
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <TodoFactory onAddTodo={({ text, dueDate }) => addTodo(text, dueDate)} />
      <Box
        className={classes.filterContainer}
        display="flex"
        flexDirection="row"
        gutterBottom
      >
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={showTasksDueToday}
                onChange={(event) => {
                  setShowTasksDueToday(event.target.checked);
                }}
              />
            }
            label="Tasks due today"
            labelPlacement="end"
          />
        </FormControl>
      </Box>

      {/* TODO LIST */}
      {todos.length > 0 && (
        <Paper className={classes.todosContainer}>
          <Box display="flex" flexDirection="column" alignItems="stretch">
            {todos.map(({ id, text, completed, dueDate }) => (
              <TodoItem
                key={id}
                text={text}
                completed={completed}
                dueDate={dueDate}
                onDelete={() => deleteTodo(id)}
                onToggleCompleted={() => toggleTodoCompleted(id)}
                onSetDueDate={(date) => setTodoDueDate(id, date)}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default Todos;
