import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon, Paper, Box, TextField } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import format from "date-fns/format";

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  addTodoDatePicker: { marginLeft: 10 },
  todosContainer: { marginTop: 10, padding: 10 },
});

function TodoFactory({ onAddTodo }) {
  const classes = useStyles();
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState(null);

  function addTodo() {
    onAddTodo({
      text,
      ...(dueDate && { dueDate: format(dueDate, "yyyy-MM-dd") }),
    });
    setText("");
    setDueDate(null);
  }

  return (
    <Paper className={classes.addTodoContainer}>
      <Box display="flex" flexDirection="row">
        <Box flexGrow={1}>
          <TextField
            fullWidth
            label="Task"
            placeholder="Eg: go to shopping..."
            value={text}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                addTodo();
              }
            }}
            onChange={(event) => setText(event.target.value)}
          />
        </Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className={classes.addTodoDatePicker}
            disableToolbar
            disablePast
            variant="dialog"
            format="dd/MM/yyyy"
            margin="none"
            id="date-picker-inline"
            label="Due date"
            value={dueDate}
            onChange={(date) => setDueDate(date)}
            KeyboardButtonProps={{
              "aria-label": "set due date",
            }}
          />
        </MuiPickersUtilsProvider>
        <Button
          className={classes.addTodoButton}
          startIcon={<Icon>add</Icon>}
          onClick={() => addTodo()}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
}

export default TodoFactory;
