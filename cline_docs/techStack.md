# Tech Stack

## Frontend Framework
- **React**: Core UI library for building component-based interfaces
- **TypeScript**: For type-safe code and better developer experience
- **Vite**: Fast build tool and development server

## UI Components and Styling
- **Ant Design**: UI component library providing pre-built components
- **SCSS**: For custom styling with variables, nesting, and mixins
- **CSS Variables**: For theme switching (light/dark mode)

## State Management
- **React Context API**: For global state management
- **Custom hooks**: For reusable logic and component state

## API Communication
- **Fetch API / Axios**: For HTTP requests to backend services
- **Server-Sent Events (SSE)**: For real-time updates
- **WebSockets**: For bidirectional communication

## Routing
- **React Router**: For client-side routing (if implemented)

## Build and Deployment
- **ESLint**: For code quality and consistency
- **Vercel**: For deployment (based on vercel.json in the project)

## Architecture Decisions
- **Mobile-first approach**: All components designed for mobile devices first, then adapted for larger screens
- **Component-based architecture**: Reusable components organized by feature
- **Context-based state management**: Using React Context for global state instead of Redux for simplicity
- **SCSS modules**: For component-scoped styling to prevent style conflicts
- **Theme switching**: Using CSS variables for easy theme switching between light and dark modes
