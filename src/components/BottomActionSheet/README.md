# Bottom Action Sheet Component

A reusable bottom action sheet component built with Ant Design's Drawer component. This component provides a mobile-friendly interface for displaying content that slides up from the bottom of the screen.

## Features

- Customizable height and z-index
- Optional title
- Optional footer with action buttons
- Rounded corners at the top
- Handle indicator for better UX
- Fully customizable content

## Usage

```tsx
import { BottomActionSheet } from '../BottomActionSheet';
import { useState } from 'react';
import { Button } from 'antd';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Optional footer content
  const footerContent = (
    <>
      <Button onClick={handleClose}>Cancel</Button>
      <Button type="primary" onClick={handleClose}>Confirm</Button>
    </>
  );

  return (
    <>
      <Button onClick={handleOpen}>Open Action Sheet</Button>
      
      <BottomActionSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Select an Option"
        height={300}
        footerContent={footerContent}
      >
        {/* Your content here */}
        <div>
          <p>This is the content of the bottom action sheet.</p>
          <p>You can put any React components here.</p>
        </div>
      </BottomActionSheet>
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Controls the visibility of the action sheet |
| onClose | () => void | required | Callback function when the action sheet is closed |
| title | React.ReactNode | undefined | Title of the action sheet |
| children | React.ReactNode | required | Content to be displayed in the action sheet |
| height | number \| string | 300 | Height of the action sheet |
| zIndex | number | 1050 | z-index of the action sheet |
| className | string | "" | Additional CSS class for the action sheet |
| showClose | boolean | true | Whether to show the close icon |
| footerContent | React.ReactNode | undefined | Content to be displayed in the footer |

## Example

See the `example.tsx` file for a complete example of how to use the BottomActionSheet component.
