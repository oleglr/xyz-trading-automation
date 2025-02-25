# Codebase Summary

## Key Components and Their Interactions

### Core Components
- **App.tsx**: Main application component that sets up routing and providers
- **Header**: Application header with authentication controls and theme toggle
- **Navigation**: Side/bottom navigation for different sections of the app
- **StrategyList**: Displays available trading strategies
- **StrategyForm**: Form for configuring selected strategies
- **Positions**: Displays active and past trading positions
- **Settings**: User settings and preferences

### Context Providers
- **AuthContext**: Manages authentication state and user information
- **NavigationContext**: Manages active navigation tab
- **ProcessingStackContext**: Manages processing queue for trade operations
- **SSEContext**: Manages Server-Sent Events for real-time updates
- **ThemeContext**: Manages theme switching (light/dark)
- **TradeContext**: Manages trade-related state and operations

## Data Flow
1. User authenticates via AuthContext
2. User navigates using Navigation component (state managed by NavigationContext)
3. User selects strategies from StrategyList
4. User configures strategy parameters via StrategyForm
5. Trade execution is managed via TradeContext
6. Real-time updates are received via SSEContext or WebSocket
7. Active positions are displayed in the Positions component

## External Dependencies
- **Ant Design**: UI component library for consistent design
- **Backend API**: RESTful API for trade operations and account management
- **WebSocket/SSE**: For real-time trade updates and notifications

## Recent Significant Changes
- Initial project setup with core components
- Integration with backend services
- Implementation of real-time updates via SSE
- Now transitioning from prototype to production-ready mobile UI

## User Feedback Integration
- No user feedback integrated yet as we're still in the development phase
- Will add user feedback collection mechanisms after initial UI implementation

## Project Structure
- **/src/components/**: UI components organized by feature
- **/src/contexts/**: React context providers for global state
- **/src/hooks/**: Custom React hooks for reusable logic
- **/src/services/**: Service modules for API communication
- **/src/styles/**: Global styles, variables, and themes
- **/src/types/**: TypeScript type definitions
