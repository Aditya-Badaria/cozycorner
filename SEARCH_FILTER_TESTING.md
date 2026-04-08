# Search & Filter Feature Testing Guide

## Overview
The search and filter functionality has been successfully implemented across both frontend and backend. This document provides comprehensive testing steps to verify all features.

## Features Implemented

### ✅ Backend Enhancements (MongoDB Queries)
- **Location-based $or queries** for name/location search fallback
- **Price range filtering** using $gte/$lte MongoDB operators
- **Case-insensitive RegExp** for location matching
- **.lean() optimization** for faster read-only queries
- **Database indexes** on frequently queried fields (location, pricing, rating, experience, createdAt, specializations)

### ✅ Frontend Components
- **Debounced Search** (500ms delay) to prevent excessive API calls
- **Advanced Filters Section** with 5-column responsive grid:
  - Location (text input)
  - Specialization (dropdown)
  - Min Price (number input)
  - Max Price (number input)
  - Sort By (dropdown with 4 options)
- **Active Filter Counter** showing "Clear all (N)" when filters are active
- **Real-time Results** updating as filters change
- **Result Count** with proper grammar ("1 architect" vs "2 architects")
- **Empty State Message** when no results found
- **Loading Spinner** during API calls

### ✅ Performance Optimizations
- Debounced search prevents API spam (500ms delay)
- MongoDB .lean() for faster queries
- useCallback hook for stable function references
- Conditional parameter building to avoid undefined values
- Database indexes on filter fields

---

## Testing Checklist

### 1. Basic Search Functionality ✓

#### Test 1.1: Search by Architect Name
1. Navigate to http://localhost:5173/architects
2. Type an architect's name in the search bar
3. Wait 500ms for debounce
4. **Expected**: Results should filter to show only matching architects
5. **Verify**: Result count updates, matching architects displayed

#### Test 1.2: Search by Location
1. Type a city name (e.g., "New York", "Los Angeles")
2. Wait 500ms for debounce
3. **Expected**: Results filtered by location
4. **Verify**: All displayed architects are in that location

#### Test 1.3: Debounce Verification
1. Type rapidly in search bar: "j", "jo", "joh", "john", "john d", etc.
2. **Expected**: API should only be called ONCE after 500ms of no input
3. **Verify**: Browser Network tab shows single request after typing stops
4. **Benefit**: Prevents API spam and reduces server load

#### Test 1.4: Clear Search
1. Type in search bar, wait for results
2. Delete all text or click to select all and delete
3. **Expected**: Results reset to all architects

---

### 2. Price Range Filtering ✓

#### Test 2.1: Minimum Price Filter
1. Enter "100" in Min Price field
2. **Expected**: Only architects with hourly rate ≥ $100 displayed
3. **Verify**: Architect cards show pricing ≥ $100/hr

#### Test 2.2: Maximum Price Filter
1. Clear Min Price if set
2. Enter "150" in Max Price field
3. **Expected**: Only architects with hourly rate ≤ $150 displayed
4. **Verify**: Architect cards show pricing ≤ $150/hr

#### Test 2.3: Price Range (Both Min & Max)
1. Enter Min Price: "100", Max Price: "200"
2. **Expected**: Only architects with $100 ≤ pricing ≤ $200 shown
3. **Verify**: All displayed architects fall within range

#### Test 2.4: Price Format on Cards
1. Look at architect cards in results
2. **Expected**: Price displayed as "$X/hr" format
3. **Verify**: Correct currency symbol and "hr" suffix

---

### 3. Location & Specialization Filtering ✓

#### Test 3.1: Location Filter
1. Select location from dropdown or type "New York"
2. **Expected**: Only architects in that location displayed
3. **Verify**: Location matches on cards

#### Test 3.2: Specialization Filter
1. Select "Residential" from Specialization dropdown
2. **Expected**: Only residential architects displayed
3. **Verify**: Cards show specializations including "residential"

#### Test 3.3: Multiple Filter Combo
1. Set: Location="New York" + Specialization="Commercial" + MinPrice=100
2. **Expected**: Results match ALL three criteria
3. **Verify**: Architects are in NY, specialize in commercial, and cost ≥$100/hr

---

### 4. Sorting Functionality ✓

#### Test 4.1: Sort by Newest
1. Select "Newest" from Sort By dropdown
2. **Expected**: Recently added architects appear first
3. **Verify**: Compare createdAt dates in browser dev tools

#### Test 4.2: Sort by Highest Rated
1. Select "Highest Rated"
2. **Expected**: Architects with highest ratings appear first
3. **Verify**: Rating stars visible on cards, highest to lowest

#### Test 4.3: Sort by Most Experienced
1. Select "Most Experienced"
2. **Expected**: Architects with most years of experience first
3. **Verify**: Experience years visible on cards, descending order

#### Test 4.4: Sort by Lowest Price
1. Select "Lowest Price"
2. **Expected**: Lowest pricing architects appear first
3. **Verify**: Check $X/hr on cards, ascending order

---

### 5. Clear All Filters ✓

#### Test 5.1: Clear All Button Visibility
1. Set multiple filters (search, location, price)
2. **Expected**: "Clear all (3)" button appears in filters section
3. **Verify**: Number matches active filter count

#### Test 5.2: Clear All Functionality
1. With filters active, click "Clear all (N)"
2. **Expected**: All filters reset to defaults
   - Search: "" (empty)
   - Location: "" (empty)
   - Specialization: "" (empty)
   - Min Price: "" (empty)
   - Max Price: "" (empty)
   - Sort By: "createdAt" (newest)
3. **Verify**: All input fields empty, results show all architects, button disappears

---

### 6. UI/UX Features ✓

#### Test 6.1: Active Filter Count
1. Set different numbers of filters
2. **Expected**: Counter shows correct number
   - 1 filter: "Clear all (1)"
   - 3 filters: "Clear all (3)"
   - 0 filters: Button hidden

#### Test 6.2: Result Count Grammar
1. Search for results that return 1 architect
2. **Expected**: "1 architect found"
3. Clear search, should show multiple
4. **Expected**: "5 architects found" (plural "architects")

#### Test 6.3: Empty State
1. Set filters that return no results
2. **Expected**: Message: "No architects found matching your criteria. Try adjusting your filters or search terms"
3. **Verify**: No architect cards displayed

#### Test 6.4: Loading State
1. Trigger a search (watch network tab)
2. **Expected**: Loading spinner visible during fetch
3. **Verify**: Spinner shows briefly, replaced by results

#### Test 6.5: Responsive Design
1. Test on different screen sizes:
   - Mobile (< 768px): 1 column filters, full-width search
   - Tablet (768px+): 2 column filters
   - Desktop (1024px+): 5 column filters
2. **Expected**: Grid layout adjusts appropriately

---

### 7. Combined Filter Scenarios ✓

#### Test 7.1: Search + Price Range
1. Search "john" + MinPrice=75 + MaxPrice=150
2. **Expected**: Architects named John with $75-150/hr shown
3. **Verify**: All criteria apply

#### Test 7.2: Search + Location + Specialization
1. Search "architects" + Location="New York" + Specialization="Commercial"
2. **Expected**: Commercial architects in NY found
3. **Verify**: Results match all filters

#### Test 7.3: All Filters Active
1. Set: Search="smith" + Location="Boston" + Specialization="Residential" + MinPrice=100 + MaxPrice=200
2. **Expected**: Architects named Smith in Boston, residential, $100-200/hr
3. **Verify**: activeFiltersCount = 5, "Clear all (5)" shows

---

### 8. Performance Testing ✓

#### Test 8.1: Debounce Performance
1. Type fast in search: "johnjohnjohnjohn..."
2. Open DevTools Network tab
3. **Expected**: 1-2 API requests max (not per character)
4. **Verify**: Debounce working, no request spam

#### Test 8.2: Large Result Sets
1. Clear all filters to show all architects
2. **Expected**: Page loads smoothly, no lag
3. **Verify**: No timeout errors, results render quickly

#### Test 8.3: Sort Performance
1. Change sort while results displayed
2. **Expected**: Results re-sort instantly
3. **Verify**: No loading delay

---

### 9. Filter State Persistence ✓

#### Test 9.1: Navigation & Return
1. Set filters and results
2. Click on an architect card (navigate to detail page)
3. Navigate back to architects list
4. **Expected**: Filters reset to defaults (current behavior - no persistence)
5. **Note**: Can implement URL query params later for persistence

---

### 10. Error Handling ✓

#### Test 10.1: API Error Display
1. Simulate error by stopping backend
2. Try searching
3. **Expected**: Error message displays: "Failed to load architects"
4. Restart backend
5. **Expected**: Error clears, results load normally

#### Test 10.2: Invalid Input
1. Enter negative numbers in price fields
2. **Expected**: Values treated as 0 or rejected (graceful handling)
3. **Verify**: No console errors

---

## Database Indexes Added

The following indexes were created on ArchitectProfile for optimal query performance:

```javascript
architectProfileSchema.index({ location: "text" });        // Text search on location
architectProfileSchema.index({ pricing: 1 });              // Range queries
architectProfileSchema.index({ rating: -1 });              // Sort by rating
architectProfileSchema.index({ experience: -1 });          // Sort by experience
architectProfileSchema.index({ createdAt: -1 });           // Sort by newest
architectProfileSchema.index({ specializations: 1 });      // Array search
architectProfileSchema.index({ isAvailable: 1 });          // Filter active
```

---

## Backend Query Examples

### Example 1: Name Search + Price Range
```
GET /api/architects?search=john&minPrice=100&maxPrice=200
```
Backend builds:
```javascript
{
  isAvailable: true,
  $or: [{ location: /john/i }],
  pricing: { $gte: 100, $lte: 200 }
}
```

### Example 2: Location + Specialization + Sort
```
GET /api/architects?location=NYC&specialization=commercial&sortBy=rating
```
Backend builds:
```javascript
{
  isAvailable: true,
  location: /NYC/i,
  specializations: "commercial"
}
// Sorted by: rating -1
```

---

## Known Limitations & Future Enhancements

### Current Behavior
- ✅ Search results update in real-time with 500ms debounce
- ✅ Multiple filters work together
- ✅ Clear all filters with one button
- ✅ Database indexes for performance

### Future Enhancements (Optional)
- [ ] URL query params for filter persistence (e.g., `/architects?search=john&minPrice=100`)
- [ ] Search history dropdown
- [ ] Save favorite filter presets
- [ ] Pagination for large result sets (20+ results)
- [ ] Advanced search syntax (AND/OR/NOT)
- [ ] Autocomplete suggestions for names
- [ ] Map view with location filters
- [ ] Comparison mode (compare multiple architects)

---

## Quick Reference: Filter Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| search | string | "john" | Search by architect name or location |
| location | string | "New York" | Filter by location (case-insensitive) |
| specialization | string | "residential" | Filter by specialization (exact match) |
| minPrice | number | "100" | Minimum hourly rate in USD |
| maxPrice | number | "200" | Maximum hourly rate in USD |
| minRating | number | "4" | Minimum rating (0-5) |
| sortBy | string | "rating" | Sort by: createdAt, rating, experience, pricing |

---

## Testing Summary

### Checklist Progress
- [ ] Basic Search (1 test scenario)
- [ ] Price Range Filtering (4 test scenarios)
- [ ] Location & Specialization (3 test scenarios)
- [ ] Sorting (4 test scenarios)
- [ ] Clear All Filters (2 test scenarios)
- [ ] UI/UX Features (5 test scenarios)
- [ ] Combined Filters (3 test scenarios)
- [ ] Performance (3 test scenarios)
- [ ] State Persistence (1 test scenario)
- [ ] Error Handling (2 test scenarios)

**Total Test Scenarios: 28**

---

## Bug Report Template

If you find an issue, report it with:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots/network logs**
5. **Browser console errors**

---

## Contact for Issues

For issues or questions about the search and filter implementation, check:
- Browser DevTools Console (Ctrl/Cmd + Shift + J) for errors
- Network tab to verify API calls and debounce behavior
- Backend logs for query construction and results
