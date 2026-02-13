# Previsit Dashboard

A medical visit dashboard application built with React, TypeScript, and Tailwind CSS.

## Features

- **Patient List View**: Browse and select patients with visit status indicators
- **Patient Details**: View comprehensive patient information including medical history, lab results, and medications
- **Visit Management**: Start new visits or instant visits with patients
- **Care Nudges**: Get AI-powered recommendations for orders, treatments, and follow-ups
- **Data Sources**: Track all patient data sources in one place
- **Responsive Design**: Clean, modern UI built with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── ButtonGroup.tsx
│   ├── Card.tsx
│   ├── Icon.tsx
│   ├── IconGallery.tsx
│   ├── Input.tsx
│   ├── PatientListItem.tsx
│   ├── Sidebar.tsx
│   ├── Tabs.tsx
│   └── index.ts
├── data/               # Mock data
│   └── mockData.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Components

### Core Components

- **Button** - Primary, secondary, and tertiary button variants
- **IconButton** - Icon-only buttons for actions
- **ButtonGroup** - Single-select or multi-select button groups with horizontal/vertical orientation
- **Badge** - Status indicators and labels
- **Avatar** - User avatar with initials
- **Input** - Text input with multiple sizes (default, dense, XS), validation states (success, error), character counter, and prefix/suffix support
- **TextArea** - Multi-line text input with validation states, character counter, and auto-expanding height
- **ChatInput** - Specialized chat input that expands on hover/focus, with integrated mic and send buttons
- **Icon** - Comprehensive icon library with filled icons from the design system

### Layout Components

- **Sidebar** - Vertical navigation sidebar
- **Tabs** - Horizontal tab navigation with primary (underlined) and secondary (pill) variants
- **VerticalTabs** - Vertical tab navigation
- **Card** - Content container with optional collapse
- **PatientListItem** - Patient list item with status

### Icon Component Library

The Icon component provides access to both standard and custom icons from the Figma design system:

**Standard Icons (20 icons)**
- Both filled and outlined variants
- Icons: mic, send, search, filter_list, stethoscope, settings, analytics, person, contact_support, check, close_small, hexagon, keyboard_arrow_left, keyboard_arrow_right, keyboard_arrow_up, calendar_today, arrow_drop_down, open_in_new, magic_button, add

**Custom Icons (9 icons)**
- Unique designs for specific use cases
- Icons: magic_edit, magic_document, menu, learn, prepend, clone, append, blend, loading
- Auto-sized (20px default, except 'learn' at 24px)

**Features:**
- **Dual variants** - Both filled and outlined styles for standard icons
- **Flexible sizing** - Pass number (pixels) or string value
- **Auto-sizing** - Custom icons automatically use appropriate default sizes
- **Custom styling** - Full Tailwind CSS support
- **Click handlers** - Built-in support for interactive icons
- **Convenience components** - Named exports for all icons

#### Usage Examples

```tsx
// Standard icons (defaults to filled variant)
<Icon name="search" size={24} />
<Icon name="search" variant="outlined" size={24} />
<Icon name="mic" variant="filled" size={24} />

// Custom icons (auto-sized)
<Icon name="magic_edit" /> // 20px
<Icon name="learn" /> // 24px
<Icon name="menu" size={16} /> // Override size

// With custom size
<Icon name="mic" size={32} />
<Icon name="send" size="2rem" />

// With custom styling
<Icon name="check" size={24} className="text-green-600" />

// With click handler
<Icon name="settings" size={24} onClick={() => handleSettings()} />

// Using convenience components
<SearchIcon size={24} />
<MicIcon variant="outlined" size={20} />
<SendIcon size={24} />
<MagicEditIcon /> // Custom icon
<LearnIcon /> // Custom icon
```

#### Icon Gallery

View all available icons using the `IconGallery` component:
- Toggle between filled and outlined variants for standard icons
- Browse all custom icons
- Interactive examples and usage patterns

## Component Examples

### Input Component

The Input component matches your Figma design system exactly with three sizes and validation states:

```tsx
import { Input } from './components';

// Basic input
<Input label="Email" placeholder="Enter your email" />

// With validation - Success
<Input 
  label="Username" 
  value="johndoe" 
  feedback="success" 
  helpText="Username is available!" 
/>

// With validation - Error
<Input 
  label="Password" 
  value="123" 
  feedback="error" 
  helpText="Password must be at least 8 characters" 
  type="password"
/>

// With character counter
<Input 
  label="Bio" 
  characterCounter 
  maxLength={100} 
  helpText="Tell us about yourself"
/>

// Dense size
<Input 
  label="Search" 
  size="dense" 
  placeholder="Search..." 
/>

// Extra small size
<Input 
  label="Code" 
  size="xs" 
  placeholder="Enter code" 
/>

// With prefix/suffix icons
<Input 
  label="Amount" 
  prefix={<span>$</span>}
  suffix={<Icon name="check" size={20} />}
/>
```

### TextArea Component

Multi-line text input matching your Figma design system:

```tsx
import { TextArea } from './components';

// Basic textarea
<TextArea label="Description" placeholder="Enter description" rows={5} />

// With success validation
<TextArea 
  label="Comment" 
  value={comment} 
  feedback="success" 
  helpText="Comment saved successfully!" 
/>

// With error validation
<TextArea 
  label="Message" 
  value={message} 
  feedback="error" 
  helpText="Message is too short" 
/>

// With character counter and max length
<TextArea 
  label="Bio" 
  characterCounter 
  maxLength={500} 
  rows={6}
  helpText="Tell us about yourself"
/>

// Disabled state
<TextArea label="Read Only" value="Cannot edit" disabled rows={4} />
```

### ButtonGroup Component

Single or multi-select button groups matching your Figma design system:

```tsx
import { ButtonGroup, Icon } from './components';

// Single-select button group (default)
<ButtonGroup
  options={[
    { id: 'manual', label: 'Manual', icon: <Icon name="person" size={20} /> },
    { id: 'ai-assisted', label: 'AI-assisted', icon: <Icon name="hexagon" size={20} /> },
    { id: 'ai-driven', label: 'AI-driven', icon: <Icon name="analytics" size={20} /> }
  ]}
  value={selected}
  onChange={setSelected}
/>

// Vertical orientation
<ButtonGroup
  options={options}
  value={selected}
  onChange={setSelected}
  orientation="vertical"
/>

// Multi-select mode
<ButtonGroup
  options={[
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
    { id: 'option3', label: 'Option 3' }
  ]}
  selectedValues={selectedIds}
  onMultiChange={setSelectedIds}
  multiSelect
  size="small"
/>

// Small size with icons (multi-select)
<ButtonGroup
  options={[
    { id: 'detailed', label: 'Detailed', icon: <Icon name="hexagon" size={16} /> },
    { id: 'standard', label: 'Standard', icon: <Icon name="hexagon" size={16} /> },
    { id: 'concise', label: 'Concise', icon: <Icon name="hexagon" size={16} /> }
  ]}
  selectedValues={['standard']}
  onMultiChange={handleChange}
  multiSelect
  size="small"
/>
```

### ChatInput Component

Specialized chat input with dynamic expansion and integrated action buttons:

```tsx
import { ChatInput } from './components';

// Basic chat input
<ChatInput 
  placeholder="Ask any medical questions"
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  onVoice={handleVoice}
/>

// Disabled state
<ChatInput 
  placeholder="Chat unavailable"
  disabled
/>
```

**Key Behaviors:**
- **Default state**: Compact (48px height), 1px purple border
- **Hover/Focus/Typing**: Expands to 81px, 2px border, shows mic & send buttons at bottom
- **Buttons**: Only visible when expanded
- **Border**: Purple (#8044ff) with blue focus outline
```

## Customization

The design system uses CSS variables for theming. Edit `src/index.css` to customize:

```css
:root {
  --surface-base: white;
  --text-default: black;
  --text-subheading: #666;
  --text-placeholder: #808080;
  --text-semantic-success: #479e4c;
}
```

## License

MIT
