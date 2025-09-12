
## 📂 **Project structure**

The base structure used in this project is inspired by the repository [bulletproof-react](https://github.com/alan2207/bulletproof-react/):

```
├── docs                  # Project documentation, technical or functional guides.
├── public                # Publicly accessible static files (favicon, images, etc.).
├── src                   # Main source folder containing all application code.
│   ├── app               # Everything related to features: components, hooks, logic, types, etc.
│   │   ├── ...          
│   ├── assets            # Static files used in the code (images, icons, fonts...).
│   ├── components        # Reusable UI components organized by abstraction level (Atomic Design).
│   ├── config            # Configuration files from our .env.
│   ├── hooks             # Shared/global custom React Hooks across the application.
│   ├── utils             # Utility functions, global helpers, internal libraries.
│   ├── pages             # Router pages, organized by feature (route-level components).
│   │   └──  ...           
│   ├── routes            # Route definitions (private/public), paths, navigation, and data.
│   ├── services          # Integration with external or internal APIs.
│   │   ├── api           # Centralized API services.
│   │   ├── session       # User session management (auth state, token refresh...).
│   │   └── ...
│   ├── main.tsx          # Main React entry point: hydrates the app into the DOM.
│   ├── index.css         # Main CSS file (base styles, Tailwind, resets...).
│   ├── App.tsx           # Root component of the app with route/layout structure.
│   ├── bootstrap.ts      # Global initialization (services, contexts, listeners...).
│   └── vite-env.d.ts     # Type declarations for Vite (env vars, assets...).
├── tsconfig.app.json     # TypeScript configuration specific to the application (frontend).
├── tsconfig.json         # Root TypeScript config file (extends other tsconfig files).
├── tsconfig.node.json    # TS configuration for the Node.js environment (scripts, tooling).
├── eslint.config.js      # ESLint configuration for linting TypeScript/JS code.
├── index.html            # Base HTML file injected by Vite with the entry point.
├── package.json          # Project dependencies, scripts, and package metadata.
├── package-lock.json     # Dependency lock file for reproducible installations.
├── components.json       # Path definitions for shadcn-based components.
└── vite.config.ts        # Vite configuration (build, alias, plugins, env vars...).
```

### 1. Structure principles:

- **Separation of Concerns**: Components are separated based on their role. **Reusable components** are located in `src/components/`, while **screens** are grouped in `/src/pages/`.
- **Feature-based Grouping**: The `/src/app` folder groups components related to a specific feature `/src/app/[feature]/components`, necessary data `/src/app/[feature]/data.ts`, utilities `/src/app/[feature]/helpers`, types `/src/app/[feature]/types`, and API requests `/src/app/[feature]/api`. This centralizes everything relevant to a specific feature, making it easier to understand and maintain.
- **Reusability**: Components are designed to be reusable across the application, reducing code duplication and promoting consistency.
- **Modularity**: Business logic is isolated in specific files: `hooks` or feature-specific `helpers` to avoid mixing logic and presentation.
- **Extensibility**: The structure allows for easy addition of new features without disrupting the existing architecture. New modules can be added in `/src/app/[feature]`.

### 2. Structure of the `src/components` Folder

The `src/components` folder follows the [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/#templates) architecture:

```
├── atoms         # Basic components (buttons, inputs, icons...).
├── molecules     # Simple combinations of atoms (e.g., form field with label).
├── organisms     # Complex combinations of components (e.g., user card, header).
├── templates     # Page layouts or structures with placeholders for content.
└── ui            # Shared UI components based on shadcn without business logic (e.g., modals, tooltips).  
```

#### Atoms
**Atoms** are the simplest and most basic components. They are the fundamental elements that cannot be broken down further.

#### Molecules
**Molecules** are combinations of atoms that work together to accomplish a simple function. They encapsulate interactions between multiple atomic elements.

Example: A search field (combining a text field and a button).

#### Organisms
**Organisms** are combinations of molecules (and sometimes atoms) that form distinct sections of the user interface. These are more complex components that may include advanced interactions and functionalities.

Example: A user profile card with a photo, name, and additional information.

#### Templates
**Templates** are page-level objects that organize components into a specific layout and articulate the underlying content structure of the design. They serve as models for complete application screens or pages.

### 3. Structure of the `src/app/[feature]` Folder

The `src/app` folder groups modules by feature, allowing logic and components associated with a specific feature to be maintained in one place. Here's a typical structure:
```
├── app               # Everything related to features
│   ├── [feature_name]/
│   │   ├── helpers/        # Utility functions or logic specific to the feature
│   │   ├── hooks/          # Custom React hooks for this feature
│   │   ├── components/     # Components specific to this feature
│   │   ├── api/            # API requests specific to this feature
│   │   ├── data.ts         # Data required for the feature
│   │   ├── types.ts        # TypeScript types specific to the feature
│   │   └── index.ts        # Entry point to export the feature's resources
└── ...
```

#### `helpers/` Folder
The `helpers` folder contains utility functions or logic specific to the feature that are not directly related to the user interface. These functions may include data manipulation, transformations, or reusable calculations.

#### `hooks/` Folder
This folder groups custom React hooks created specifically for this feature. These hooks encapsulate reusable logic related to state, effects, or asynchronous actions, such as API calls.

#### `components/` Folder
The `components` folder contains components specific to the feature. These components are isolated to meet the needs of this particular feature.

#### `api/` Folder
The `api` folder groups files containing API requests specific to the feature. Each file can correspond to a set of related API calls.

#### `data.ts` File
The `data.ts` file centralizes data required for the feature, such as configuration objects or static data.

#### `types.ts` File
The `types.ts` file contains TypeScript types specific to the feature, such as interfaces, types, or enums. This ensures better type checking and easier maintenance.

#### `index.ts` File
The `index.ts` file serves as the entry point to export all resources of the feature, such as components, hooks, helpers, or types. This simplifies imports and improves code organization.

