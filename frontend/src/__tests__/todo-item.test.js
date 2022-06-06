import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import addDays from "date-fns/addDays";
import TodoItem from "../TodoItem";

describe("TodoItem", () => {
  const props = {
    text: "Go to gym",
    completed: false,
    onDelete: jest.fn(),
    onToggleCompleted: jest.fn(),
    onSetDueDate: jest.fn(),
  };

  it("renders", () => {
    render(<TodoItem {...props} />);

    expect(screen.getByText(props.text)).toBeInTheDocument();
  });

  describe("when due date is today", () => {
    it("displays `Due today`", () => {
      const today = new Date();
      render(<TodoItem {...props} dueDate={today} />);

      expect(screen.getByText(props.text)).toBeInTheDocument();
      expect(screen.getByText("Due today")).toBeInTheDocument();
    });
  });

  describe("when due date is tomorrow", () => {
    it("displays `Due tomorrow`", () => {
      const tomorrow = addDays(new Date(), 1);
      render(<TodoItem {...props} dueDate={tomorrow} />);

      expect(screen.getByText(props.text)).toBeInTheDocument();
      expect(screen.getByText("Due tomorrow")).toBeInTheDocument();
    });
  });

  describe("when due date is later than tomorrow", () => {
    it("displays due date in `dd MMM, yyyy` format", () => {
      render(<TodoItem {...props} dueDate="2022-06-05" />);

      expect(screen.getByText(props.text)).toBeInTheDocument();
      expect(screen.getByText("Due 05 Jun, 2022")).toBeInTheDocument();
    });
  });

  describe("when user complete task", () => {
    it("fires onToggleCompleted event", () => {
      render(<TodoItem {...props} />);

      expect(screen.getByText(props.text)).toBeInTheDocument();

      const checkbox = screen.getByRole("checkbox");
      userEvent.click(checkbox);

      expect(props.onToggleCompleted).toHaveBeenCalled();
    });
  });

  describe("when user click on Delete", () => {
    it("fires onDelete event", () => {
      render(<TodoItem {...props} />);

      expect(screen.getByText(props.text)).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", { name: "Delete" });
      userEvent.click(deleteButton);

      expect(props.onDelete).toHaveBeenCalled();
    });
  });

  describe("when user add due date", () => {
    it("fires onSetDueDate event", async () => {
      render(<TodoItem {...props} />);

      expect(screen.getByText(props.text)).toBeInTheDocument();

      const changeDueDateButton = screen.getByRole("button", {
        name: "Add Due Date",
      });
      userEvent.click(changeDueDateButton);

      const datePicker = await screen.getAllByRole("dialog")[0];
      const fifthOfJune = within(datePicker).getByText("5");
      userEvent.click(fifthOfJune);

      const saveButton = within(datePicker).getByRole("button", {
        name: "Save",
      });
      userEvent.click(saveButton);

      expect(props.onSetDueDate).toHaveBeenCalledWith("2022-06-05");
    });
  });
});
