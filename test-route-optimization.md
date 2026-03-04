# Route Optimization Page Diagnostic

## Quick Checks

### 1. Is the frontend running?
- Open browser to: http://localhost:5173
- Status: ✓ Frontend is running on port 5173

### 2. Is the backend running?
- Backend URL: http://localhost:8081
- Status: ✓ Backend is running on port 8081

### 3. Access the Route Optimization page
- Direct URL: http://localhost:5173/route-optimization
- From Dashboard: Click "Route Optimization" in sidebar

## Common Issues & Solutions

### Issue: Blank/White Page
**Solution**: Check browser console (F12) for errors
- If you see "MapContainer is not defined" → Restart frontend dev server
- If you see CSS errors → Clear browser cache

### Issue: "Unauthorized" or redirect to login
**Solution**: You need to be logged in
1. Go to http://localhost:5173/login
2. Login with: navaroj0923@gmail.com / test123 / Fleet Manager
3. Then navigate to Route Optimization

### Issue: Map not displaying 
**Solution**: Leaflet CSS might not be loaded
```bash
cd frontend
npm install leaflet react-leaflet --force
npm run dev
```

### Issue: 403 Forbidden
**Solution**: Backend authentication issue (already fixed)

## Test the Page

1. **Login first**: http://localhost:5173/login
2. **Navigate to**: http://localhost:5173/route-optimization
3. **Expected**: You should see:
   - A large map of India (National Fleet Route View)
   - "Quick Actions" card with "Traffic Analytics" button
   - "Traffic Alert" amber card
   - "Module Navigation" with Visualize/Compare/History buttons

## If still broken, check:
- Browser console (F12 → Console tab) for error messages
- Network tab (F12 → Network) for failed requests
- Try accessing from: Dashboard → Click "Route Optimization" in left sidebar
