import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Icon, Box, Checkbox } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { isToday, isTomorrow, format } from "date-fns";

const useStyles = makeStyles({
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    paddingTop: 5,
    "&:first-child": {
      margin: 0,
      padding: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $todoCta": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  todoCta: {
    visibility: "hidden",
    marginLeft: 10,
    padding: 5,
  },
});

function TodoItem({
  text,
  completed,
  dueDate,
  onToggleCompleted,
  onDelete,
  onSetDueDate,
}) {
  const classes = useStyles();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  /**
   * Humanize todo item's due date
   * @returns today | tomorrow | dd MMM, yyyy
   */
  function humanizedDueDate() {
    const date = new Date(dueDate);
    if (isToday(date)) {
      return "today";
    }

    if (isTomorrow(date)) {
      return "tomorrow";
    }

    return format(date, "dd MMM, yyyy");
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      className={classes.todoContainer}
    >
      <Checkbox checked={completed} onChange={onToggleCompleted}></Checkbox>
      <Box flexGrow={1}>
        <Typography
          className={completed ? classes.todoTextCompleted : ""}
          variant="body1"
        >
          {text}
        </Typography>
        {dueDate && (
          <Typography variant="body2" color="textSecondary">
            Due {humanizedDueDate()}
          </Typography>
        )}
      </Box>
      {!completed && (
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              disablePast
              disableToolbar
              variant="dialog"
              okLabel="Save"
              open={isDatePickerOpen}
              value={dueDate}
              onOpen={() => setIsDatePickerOpen(true)}
              onClose={() => setIsDatePickerOpen(false)}
              TextFieldComponent={() => null}
              onChange={(date) => onSetDueDate(format(date, "yyyy-MM-dd"))}
            />
          </MuiPickersUtilsProvider>

          <Button
            className={classes.todoCta}
            startIcon={<Icon>event</Icon>}
            onClick={() => setIsDatePickerOpen(true)}
          >
            {dueDate ? "Change Due Date" : "Add Due Date"}
          </Button>
        </div>
      )}

      <Button
        className={classes.todoCta}
        startIcon={<Icon>delete</Icon>}
        onClick={onDelete}
      >
        Delete
      </Button>
    </Box>
  );
}

export default TodoItem;
