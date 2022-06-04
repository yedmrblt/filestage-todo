import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Icon, Box, Checkbox } from "@material-ui/core";
import format from "date-fns/format";

const useStyles = makeStyles({
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
    marginLeft: 5,
    padding: 5,
  },
});

function TodoItem({ text, completed, dueDate, onToggleCompleted, onDelete }) {
  const classes = useStyles();

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
          <Typography variant="body2">
            Due to {format(new Date(dueDate), "dd MMM, yyyy")}
          </Typography>
        )}
      </Box>

      <Button
        className={classes.deleteTodo}
        startIcon={<Icon>delete</Icon>}
        onClick={onDelete}
      >
        Delete
      </Button>
    </Box>
  );
}

export default TodoItem;
