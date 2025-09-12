
# Design system

## Base Components

All base components for the application are located in the `src/components` directory. This directory is organized to promote modularity and reusability:

-   `atoms/`: Contains the smallest, indivisible components (e.g., buttons, inputs, labels).
-   `molecules/`: Composed of one or more atoms, forming more complex UI elements (e.g., input fields with labels).
-   `organisms/`: Relatively complex components composed of molecules and/or atoms (e.g., a form, a section of a page).

> You can view the design system in the `/ui` page of the application.

## Styling with Tailwind CSS

The styling for the application is primarily managed using Tailwind CSS. This utility-first CSS framework allows for rapid UI development and consistent styling across the application. 

### Typography

Text styles are managed through the `Typography` component.

### Colors and Themes

Colors are defined using design tokens and integrated with Tailwind CSS. These colors align with the color palette defined in our Figma design. You can find the color definitions in `src/index.css`. This file includes custom CSS properties (variables) to manage the overall theme.



To apply these styles, use Tailwind CSS classes in your components:

```jsx
import { Button } from "@/components";

function MyComponent() {
  return (
  <Button className="text-white font-bold py-2 px-4 rounded">
    Click me
  </Button>
  );
}
```

