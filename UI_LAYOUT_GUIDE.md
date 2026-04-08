# Search & Filter UI Layout Guide

## Visual Architecture

### Full Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  🏠 Cozy Corner                                      Home    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Discover Architects                                        │
│  Find the perfect professional for your project            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Search by architect name or location...         🔍    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Advanced Filters              Clear all (N) [Show] │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ Location │ Specialization │ Min $ │ Max $ │ Sort  │   │
│  │ ┌──────┐ │ ┌────────────┐ │┌────┐ │┌────┐ │┌────┐ │   │
│  │ │ Text │ │ │ Dropdown  │ ││Num │ ││Num │ ││Drop│ │   │
│  │ └──────┘ │ └────────────┘ │└────┘ │└────┘ │└────┘ │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  12 architects found                                       │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │  [Architect] │ │  [Architect] │ │  [Architect] │      │
│  │  Card 1      │ │  Card 2      │ │  Card 3      │      │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │  [Architect] │ │  [Architect] │ │  [Architect] │      │
│  │  Card 4      │ │  Card 5      │ │  Card 6      │      │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Search Bar Details

### Desktop View
```
┌──────────────────────────────────────────────────────────┐
│ Search by architect name or location...          🔍      │
└──────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────┐
│ Search by           │
│ architect name...   │
│                  🔍 │
└──────────────────────┘
```

---

## Advanced Filters Section

### Desktop Layout (5-column grid)
```
┌──────────────────────────────────────────────────────────────────┐
│ Advanced Filters                        [Clear all (3)]          │
├──────────────────────────────────────────────────────────────────┤
│ Location           │ Specialization    │ Min $         │ Max $   │
│ ┌────────────────┐ │ ┌──────────────┐ │ ┌──────────┐  │ ┌─────┐ │
│ │ New York   ✓   │ │ │ Residential▼ │ │ │ 100    ✓ │  │ │ 200 │ │
│ └────────────────┘ │ └──────────────┘ │ └──────────┘  │ └─────┘ │
│ City or region...  │                   │                │         │
│                    │                   │ Min hourly..  │ Max hr.│
│
│ Sort By            │
│ ┌──────────────┐   │
│ │ Highest↓     │   │
│ └──────────────┘   │
│ Rated               │
│
└──────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (2-column grid)
```
┌────────────────────────────────────────────┐
│ Advanced Filters  [Clear all (3)]          │
├────────────────────────────────────────────┤
│ Location           │ Specialization        │
│ ┌──────────────┐   │ ┌────────────────┐   │
│ │ New York   ✓ │   │ │ Residential  ▼ │   │
│ └──────────────┘   │ └────────────────┘   │
│                    │                       │
│ Min Price ($)      │ Max Price ($)         │
│ ┌──────────────┐   │ ┌────────────────┐   │
│ │ 100        ✓ │   │ │ 200          ✓ │   │
│ └──────────────┘   │ └────────────────┘   │
│                    │                       │
│ Sort By            │                       │
│ ┌──────────────┐   │                       │
│ │ Highest Rat▼ │   │                       │
│ └──────────────┘   │                       │
└────────────────────────────────────────────┘
```

### Mobile Layout (1-column grid)
```
┌──────────────────────────┐
│ Advanced Filters [Clear] │
├──────────────────────────┤
│ Location                 │
│ ┌────────────────────┐   │
│ │ New York        ✓  │   │
│ └────────────────────┘   │
│                          │
│ Specialization           │
│ ┌────────────────────┐   │
│ │ Residential      ▼ │   │
│ └────────────────────┘   │
│                          │
│ Min Price ($)            │
│ ┌────────────────────┐   │
│ │ 100              ✓ │   │
│ └────────────────────┘   │
│                          │
│ Max Price ($)            │
│ ┌────────────────────┐   │
│ │ 200              ✓ │   │
│ └────────────────────┘   │
│                          │
│ Sort By                  │
│ ┌────────────────────┐   │
│ │ Highest Rated    ▼ │   │
│ └────────────────────┘   │
└──────────────────────────┘
```

---

## Filter Input Types

### 1. Location Filter
```
Location
┌──────────────────────┐
│ New York          ✓  │
└──────────────────────┘
City or region...
```
- **Type**: Text input
- **Placeholder**: "City or region..."
- **Behavior**: Case-insensitive matching
- **Value**: Stored in filters.location

### 2. Specialization Filter
```
Specialization
┌──────────────────────┐
│ Residential        ▼ │
└──────────────────────┘
```
- **Type**: Dropdown select
- **Options**:
  - All types (default, empty string)
  - residential
  - commercial
  - hospitality
  - retail
  - mixed
- **Behavior**: One selection at a time
- **Value**: Stored in filters.specialization

### 3. Min Price Filter
```
Min Price ($)
┌──────────────────────┐
│ 100               ✓  │
└──────────────────────┘
Min hourly rate
```
- **Type**: Number input
- **Placeholder**: "Min hourly rate"
- **Min**: 0
- **Behavior**: Greater than or equal
- **Value**: Stored in filters.minPrice

### 4. Max Price Filter
```
Max Price ($)
┌──────────────────────┐
│ 200               ✓  │
└──────────────────────┘
Max hourly rate
```
- **Type**: Number input
- **Placeholder**: "Max hourly rate"
- **Min**: 0
- **Behavior**: Less than or equal
- **Value**: Stored in filters.maxPrice

### 5. Sort By Filter
```
Sort By
┌──────────────────────┐
│ Highest Rated      ▼ │
└──────────────────────┘
```
- **Type**: Dropdown select
- **Options**:
  - Newest (createdAt, default)
  - Highest Rated (rating)
  - Most Experienced (experience)
  - Lowest Price (pricing)
- **Behavior**: One sort at a time
- **Value**: Stored in filters.sortBy

---

## Results Section

### Result Count Display
```
12 architects found
```
- **Grammar**: Singular "1 architect" vs Plural "2+ architects"
- **Color**: Gray text (#6B7280)
- **Visibility**: Only shown when results exist

### Architect Card Layout
```
┌──────────────────────────────────┐
│  [Portfolio Image]               │
│  ┌────────────────────────────┐  │
│  │ John Smith        ⭐ 4.8    │  │
│  │ New York          (42 reviews)
│  │                              │
│  │ 🏢 15 years • $150/hr      │  │
│  │                              │
│  │ Specializations:            │
│  │ 🏠 Residential 🏪 Retail   │  │
│  │                              │
│  │ "I specialize in creating   │  │
│  │  beautiful, functional       │  │
│  │ spaces..."                   │  │
│  │                              │
│  │ [View Full Profile →]        │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Card Details**:
- **Image**: Portfolio image with rounded corners
- **Name**: Architect name (bold, large)
- **Rating**: Star icon + number (e.g., ⭐ 4.8) + review count in parentheses
- **Location**: City/region name
- **Experience**: Years badge "X years"
- **Price Badge**: "$X/hr" in lavender color
- **Specializations**: Tags for each specialization
- **Bio**: 2-3 lines of bio preview with ellipsis
- **CTA**: "View Full Profile →" link button

### Grid Layouts
```
Desktop (3 columns):
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Card 1  │ │ Card 2  │ │ Card 3  │
└─────────┘ └─────────┘ └─────────┘
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Card 4  │ │ Card 5  │ │ Card 6  │
└─────────┘ └─────────┘ └─────────┘

Tablet (2 columns):
┌──────────────┐ ┌──────────────┐
│ Card 1       │ │ Card 2       │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ Card 3       │ │ Card 4       │
└──────────────┘ └──────────────┘

Mobile (1 column):
┌──────────────────────┐
│ Card 1               │
└──────────────────────┘
┌──────────────────────┐
│ Card 2               │
└──────────────────────┘
```

---

## Loading State

```
┌──────────────────────────────────────┐
│                                      │
│              ⟳                       │
│        (spinning circle)             │
│                                      │
│    Searching architects...           │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

- **Icon**: Animated spinning circle (SVG or CSS)
- **Color**: Lavender (#CDB4DB)
- **Text**: "Searching architects..." below spinner
- **Duration**: Shows during API call
- **Position**: Centered, min-height 24rem

---

## Empty State

```
┌──────────────────────────────────────┐
│                                      │
│  No architects found matching your   │
│  criteria. Try adjusting your        │
│  filters or search terms             │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

- **Icon**: No visual icon
- **Primary Message**: "No architects found matching your criteria."
- **Secondary Message**: "Try adjusting your filters or search terms"
- **Color**: Primary gray (#4B5563), secondary gray (#6B7280)
- **Position**: Centered, with vertical padding

---

## Error State

```
┌──────────────────────────────────────┐
│ ⚠ Failed to load architects           │
│                                      │
│ (Error message in red background)    │
└──────────────────────────────────────┘
```

- **Background**: Light red (#FEE2E2)
- **Border**: Red (#FCA5A5)
- **Text**: Red (#B91C1C)
- **Icon**: Warning symbol or error text
- **Message**: Error details from catch block

---

## Clear All Button

### Visible State (With Active Filters)
```
Advanced Filters                Clear all (3)
                               [Clickable]
```
- **Position**: Top right of filters section
- **Color**: Lavender text (#CDB4DB)
- **Hover**: Changes to black
- **Text**: "Clear all (N)" where N = number of active filters
- **Onclick**: Resets all filters to defaults

### Hidden State (No Active Filters)
```
Advanced Filters
(No button)
```
- **Display**: `hidden` or `display: none`
- **Visibility**: Only shows when activeFiltersCount > 0

---

## Color Palette Reference

```
Color Name         Hex Code   Usage
─────────────────────────────────────────────
White              #FFFFFF    Background
Black              #000000    Text, borders
Lavender (Accent)  #CDB4DB    Hover states, accents
Gray (Light)       #F3F4F6    Filter section bg
Gray (Border)      #E5E7EB    Input borders, card borders
Gray (Text)        #6B7280    Secondary text
Gray (Dark)        #4B5563    Headings
Red (Error)        #B91C1C    Error states
Red (Light)        #FCA5A5    Error borders
Red (BG)           #FEE2E2    Error background
```

---

## Interactive States

### Input Focus
```
┌──────────────────────────────┐
│ New York                      │ ← Ring: 2px lavender
└──────────────────────────────┘
```
- **Border**: Transparent (not visible)
- **Ring**: 2px lavender (#CDB4DB)
- **Transition**: Smooth
- **Class**: `focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent`

### Button Hover
```
┌──────────────────────┐
│ Clear all (3)        │ ← Changes to black
└──────────────────────┘
```
- **Color**: Lavender → Black
- **Transition**: Smooth
- **Cursor**: Pointer
- **Class**: `hover:text-black`

### Card Hover
```
┌──────────────────────────────┐
│  Architect Card              │ ← Shadow appears
│                              │   Slight lift effect
└──────────────────────────────┘
```
- **Shadow**: sm → xl on hover
- **Transition**: All properties
- **Duration**: 300ms
- **Scale**: Subtle (not scaled, just shadow)

---

## Responsive Breakpoints

```
Mobile:     < 768px   (md)
Tablet:     768px+    (md)
Desktop:    1024px+   (lg)
```

### Grid Adjustments
```
Mobile (default):
- Filters: 1 column
- Results: 1 column
- Search: Full width

Tablet (md:grid-cols-2):
- Filters: 2 columns
- Results: 2 columns
- Search: Full width

Desktop (lg:grid-cols-5 for filters, lg:grid-cols-3 for results):
- Filters: 5 columns
- Results: 3 columns
- Search: Full width
```

---

## Animation/Transitions

```
Search Bar:
- Border color: smooth transition
- Ring color: smooth transition
- Background: instant

Filter Inputs:
- Border: smooth transition
- Ring: smooth transition

Architect Cards:
- Shadow: 300ms transition
- Opacity: on hover

Loading Spinner:
- Animation: continuous spin
- Duration: 1 second per rotation
- Color: Lavender

Clear Button:
- Text color: instant transition
- Hover: instant response
```

---

## Accessibility Features

```
Labels:
- Every input has <label> with htmlFor
- Example: <label htmlFor="location">Location</label>

Semantic HTML:
- <form> or form-like structure
- <input>, <select> elements
- Proper heading hierarchy

Focus States:
- Clear ring on focus
- Visible without color-only cues
- Tab navigation works

ARIA:
- Implied from semantic HTML
- Button roles understood
- Input purposes clear from labels

Keyboard Navigation:
- Tab: Move through inputs
- Shift+Tab: Move backwards
- Enter: Submit (if form)
- Arrow keys: Select options
```

---

## CSS Classes Used

```
Layout:
- max-w-7xl: Max width container
- mx-auto: Center container
- px-8, py-12: Padding
- mb-8, mt-12: Margins
- flex, grid: Layout modes

Grid:
- md:grid-cols-2: 2 columns on tablet
- lg:grid-cols-5: 5 columns on desktop
- lg:grid-cols-3: 3 columns results
- gap-4, gap-8: Spacing

Colors:
- bg-white: White background
- bg-gray-50: Light gray background
- border-gray-200: Light gray border
- text-black: Black text
- text-gray-600: Gray text

States:
- hover:shadow-xl: Shadow on hover
- focus:ring-2: Ring on focus
- focus:ring-[#CDB4DB]: Lavender ring
- transition: Smooth transitions

Sizing:
- w-full: Full width
- min-h-96: Min height (responsive)
- rounded-2xl: Large border radius
- rounded-xl: Medium border radius
```

---

## Future UI Enhancements

Potential additions:
- [ ] Search suggestions dropdown
- [ ] Filter presets/favorites
- [ ] Comparison view toggle
- [ ] Map view toggle
- [ ] List/grid view toggle
- [ ] Pagination controls
- [ ] Results per page selector
- [ ] Save search feature
- [ ] Share search link

---

**Status**: ✅ UI Complete and Production Ready
**Last Updated**: 2024
