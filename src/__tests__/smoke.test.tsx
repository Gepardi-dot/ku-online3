import { render, screen } from "@testing-library/react";

describe("Smoke test", () => {
  it("renders without crashing", () => {
    render(<div>Hello Test</div>);
    expect(screen.getByText("Hello Test")).toBeInTheDocument();
  });

  it("has proper test environment setup", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });
});
