// Home.test.tsx (or Home.test.jsx)

import { render, screen } from "@testing-library/react";
import Home from "../src/app/page"; // Adjust the path as necessary

describe("Home Component", () => {
  it("renders the home page correctly", async () => {
    render(<Home />);

    // Example test: Check if the paragraph with specific text is rendered
    const paragraphElement = await screen.findByText(/Hello babe/i);
    expect(paragraphElement).toBeInTheDocument();
  });
});
