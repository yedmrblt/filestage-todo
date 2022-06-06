import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoFactory from "../TodoFactory";

describe("TodoFactory", () => {
  const props = {
    onAddTodo: jest.fn(),
  };

  it("renders", () => {
    render(<TodoFactory {...props} />);

    expect(screen.getByText("Task")).toBeInTheDocument();
  });

  describe("when user add task without due date", () => {
    it("fires onAddTodo event", () => {
      render(<TodoFactory {...props} />);

      const textInput = screen.getByPlaceholderText("Eg: go to shopping...");
      userEvent.type(textInput, "Go to gym");

      const addButton = screen.getByRole("button", { name: "Add" });
      userEvent.click(addButton);

      expect(props.onAddTodo).toHaveBeenCalledWith({ text: "Go to gym" });
    });
  });

  describe("when user add task with due date", () => {
    it("fires onAddTodo event", async () => {
      render(<TodoFactory {...props} />);

      const textInput = screen.getByPlaceholderText("Eg: go to shopping...");
      userEvent.type(textInput, "Go to gym");

      const dueDateInput = screen.getByLabelText("Due date");
      userEvent.type(dueDateInput, "05/06/2022");

      const addButton = screen.getByRole("button", { name: "Add" });
      userEvent.click(addButton);

      expect(props.onAddTodo).toHaveBeenCalledWith({
        text: "Go to gym",
        dueDate: "2022-06-05",
      });
    });
  });
});
