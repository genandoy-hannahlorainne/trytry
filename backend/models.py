from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    photo_index: int
    image_data: str  # base64 encoded
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    file_path: Optional[str] = None

class PhotoCreate(BaseModel):
    session_id: str
    photo_index: int
    image_data: str

class PhotoSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    layout_id: str
    layout_name: str
    photo_count: int
    photos: List[Photo] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False
    strip_url: Optional[str] = None

class SessionCreate(BaseModel):
    layout_id: str
    layout_name: str
    photo_count: int

class StripGenerate(BaseModel):
    session_id: str