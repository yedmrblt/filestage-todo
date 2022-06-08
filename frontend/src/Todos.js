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
  Snackbar,
} from "@material-ui/core";
import format from "date-fns/format";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const [page, setPage] = useState(1);
  const [countTotal, setCountTotal] = useState(0);
  const [showTasksDueToday, setShowTasksDueToday] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [showTasksDueToday]);

  function fetchTodos() {
    setPage(page + 1);
    const queryParamsObj = { page };

    if (showTasksDueToday) {
      queryParamsObj.dueDate = format(new Date(), "yyyy-MM-dd");
    }
    const queryParams = new URLSearchParams(queryParamsObj).toString();
    fetch(`${baseURL}?${queryParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ countTotal, items }) => {
        setTodos([...todos, ...items]);
        setCountTotal(countTotal);
      })
      .catch(() => setHasError(true));
  }

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
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((todo) => {
        const newTodos = [...todos];
        newTodos.unshift(todo);
        setTodos(newTodos);
      })
      .catch(() => setHasError(true));
  }

  function toggleTodoCompleted(id) {
    fetch(`${baseURL}${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        toggleTodoCompleted: !todos.find((todo) => todo.id === id).completed,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      })
      .then(() => {
        const newTodos = [...todos];
        const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
        newTodos[modifiedTodoIndex] = {
          ...newTodos[modifiedTodoIndex],
          completed: !newTodos[modifiedTodoIndex].completed,
        };
        setTodos(newTodos);
      })
      .catch(() => setHasError(true));
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
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      })
      .then(() => {
        const newTodos = [...todos];
        const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
        newTodos[modifiedTodoIndex] = {
          ...newTodos[modifiedTodoIndex],
          dueDate,
        };
        setTodos(newTodos);
      })
      .catch(() => setHasError(true));
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch(() => setHasError(true));
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
      >
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={showTasksDueToday}
                onChange={(event) => {
                  setPage(1);
                  setTodos([]);
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
      <Paper className={classes.todosContainer}>
        <Box display="flex" flexDirection="column" alignItems="stretch">
          <InfiniteScroll
            dataLength={todos.length}
            next={fetchTodos}
            hasMore={todos.length < countTotal}
            height={500}
            endMessage={
              <Typography
                align="center"
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Yay! You have seen it all
              </Typography>
            }
            loader={
              <Typography
                align="center"
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Loading...
              </Typography>
            }
          >
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
          </InfiniteScroll>
        </Box>
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={hasError}
        onClose={() => {
          setHasError(false);
        }}
        autoHideDuration={6000}
        message="Oops!, something went wrong."
      />
    </Container>
  );
}

export default Todos;
