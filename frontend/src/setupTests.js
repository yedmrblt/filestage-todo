import "@testing-library/jest-dom";
import MockDate from "mockdate";

beforeAll(() => {
  // Mock today to 1st June 2022
  MockDate.set("2022-06-01");
});
