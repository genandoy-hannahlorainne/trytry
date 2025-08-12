# Photobooth API Contracts & Implementation Plan

## API Endpoints

### Photo Management
```
POST /api/photos/capture
- Body: { layout_id, session_id, photo_index, image_data (base64) }
- Response: { id, session_id, layout_id, photo_index, url, timestamp }

GET /api/photos/session/{session_id}
- Response: { session_id, layout, photos: [], created_at }

POST /api/photos/generate-strip
- Body: { session_id, layout_id }
- Response: { strip_url, download_url }

GET /api/photos/download/{session_id}
- Response: File download of completed photo strip
```

### Session Management
```
POST /api/sessions/create
- Body: { layout_id }
- Response: { session_id, layout, created_at }
```

## Data Models

### Photo Session
```python
class PhotoSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    layout_id: str
    layout_name: str
    photo_count: int
    photos: List[Photo] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False
```

### Photo
```python
class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    photo_index: int
    image_data: str  # base64 encoded
    timestamp: datetime = Field(default_factory=datetime.utcnow)
```

## Frontend Changes Required

### Mock Data Replacement
- Remove mockData.js usage
- Replace mock photo capture with real camera functionality
- Implement actual file download

### Camera Integration
- Implement getUserMedia() for real camera access
- Add canvas-based photo capture
- Image processing and filtering
- Error handling for camera permissions

### Real Functionality
- Session management with backend
- Photo upload to backend
- Strip generation and download
- Progress tracking

## Backend Implementation

### File Storage
- Store photos in `/app/backend/uploads/` directory
- Generate photo strips using Python PIL/Canvas
- Create downloadable files

### Photo Processing
- Apply vintage filters (sepia, grain, light leaks)
- Create photobooth strip layouts
- Add "about you..." captions and timestamps

## Integration Points

1. **Session Creation**: Frontend creates session when layout is selected
2. **Photo Capture**: Each photo is uploaded immediately after capture
3. **Strip Generation**: After all photos captured, backend generates final strip
4. **Download**: Frontend provides download link for completed strips

## Error Handling
- Camera permission denied
- Network failures during upload
- Invalid session states
- File storage errors