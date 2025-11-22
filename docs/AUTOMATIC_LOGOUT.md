# Automatic Logout Functionality

Smart Formify includes automatic logout functionality that enhances security by automatically logging out users in specific scenarios.

## Features

### 1. Tab Close Logout
- **Trigger**: When a user closes the browser tab/window
- **Action**: User is automatically logged out and session is cleared
- **Implementation**: Uses `beforeunload` event listener

### 2. Tab Visibility Logout
- **Trigger**: When a user switches to another tab or minimizes the browser
- **Action**: User is automatically logged out
- **Implementation**: Uses `visibilitychange` event listener

### 3. Inactivity Timeout Logout
- **Trigger**: After 2 minutes of user inactivity
- **Action**: User is automatically logged out
- **Implementation**: Timer-based with activity detection

## How It Works

### Activity Detection
The system monitors the following user activities:
- Mouse movements (`mousemove`)
- Mouse clicks (`click`, `mousedown`)
- Keyboard input (`keypress`)
- Scrolling (`scroll`)
- Touch events (`touchstart`)
- Page focus (`focus`)

### Timer Management
- **Inactivity Timer**: 2 minutes (120,000 ms)
- **Reset**: Timer resets on any user activity
- **Logout**: Automatic logout when timer expires

### Event Listeners
- Automatically added when user logs in
- Properly cleaned up when user logs out
- Passive listeners for performance optimization

## Usage

### Basic Implementation
The automatic logout is already implemented in the `AuthProvider` and works out of the box.

### Manual Timer Reset
If you need to manually reset the inactivity timer from a component:

```tsx
import { useInactivityReset } from "@/hooks/use-inactivity-reset";

function MyComponent() {
  const { resetTimer } = useInactivityReset();
  
  const handleImportantAction = () => {
    // Do something important
    performAction();
    
    // Reset the inactivity timer
    resetTimer();
  };
  
  return (
    <button onClick={handleImportantAction}>
      Perform Action
    </button>
  );
}
```

### Custom Timeout (Optional)
To modify the inactivity timeout, update the `INACTIVITY_TIMEOUT` constant in `components/auth/auth-context.tsx`:

```tsx
// Change from 2 minutes to 5 minutes
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
```

## Security Benefits

1. **Session Protection**: Prevents unauthorized access to user accounts
2. **Data Security**: Automatically clears sensitive data when users are inactive
3. **Tab Security**: Protects against leaving accounts open on shared computers
4. **Compliance**: Helps meet security requirements for sensitive applications

## Browser Compatibility

- **Modern Browsers**: Full support for all features
- **Mobile Browsers**: Touch events and visibility changes supported
- **Legacy Browsers**: Graceful degradation with basic timeout functionality

## Troubleshooting

### Timer Not Resetting
- Ensure the component is wrapped in `AuthProvider`
- Check that user is properly authenticated
- Verify event listeners are properly attached

### Premature Logouts
- Check for conflicting event listeners
- Verify timer duration settings
- Ensure proper cleanup on component unmount

### Performance Issues
- Event listeners use passive mode for better performance
- Timers are properly cleaned up to prevent memory leaks
- Minimal impact on user experience

## Configuration

The automatic logout system is designed to work with minimal configuration:

- **Default Timeout**: 2 minutes
- **Events Monitored**: Standard user interaction events
- **Cleanup**: Automatic cleanup on logout/unmount
- **Performance**: Optimized for minimal impact

## Future Enhancements

Potential improvements for future versions:
- Configurable timeout per user role
- Warning notifications before logout
- Session extension requests
- Activity analytics and reporting
