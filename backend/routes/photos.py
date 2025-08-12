from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List
import os
from datetime import datetime

from ..models import Photo, PhotoCreate, PhotoSession, SessionCreate, StripGenerate
from ..photo_service import PhotoService
from motor.motor_asyncio import AsyncIOMotorClient

# Get database from main server
import sys
sys.path.append('/app/backend')
from server import db

router = APIRouter(prefix="/api", tags=["photos"])
photo_service = PhotoService()

@router.post("/sessions/create", response_model=PhotoSession)
async def create_session(session_data: SessionCreate):
    """Create a new photo session"""
    session = PhotoSession(
        layout_id=session_data.layout_id,
        layout_name=session_data.layout_name,
        photo_count=session_data.photo_count
    )
    
    await db.photo_sessions.insert_one(session.dict())
    return session

@router.get("/sessions/{session_id}", response_model=PhotoSession)
async def get_session(session_id: str):
    """Get session details"""
    session = await db.photo_sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get photos for this session
    photos = await db.photos.find({"session_id": session_id}).to_list(100)
    session["photos"] = photos
    
    return PhotoSession(**session)

@router.post("/photos/capture", response_model=Photo)
async def capture_photo(photo_data: PhotoCreate):
    """Capture and save a photo"""
    try:
        # Save photo file
        file_path = photo_service.save_photo(
            photo_data.session_id,
            photo_data.photo_index,
            photo_data.image_data
        )
        
        # Create photo record
        photo = Photo(
            session_id=photo_data.session_id,
            photo_index=photo_data.photo_index,
            image_data="",  # Don't store base64 in DB
            file_path=file_path
        )
        
        # Save to database
        await db.photos.insert_one(photo.dict())
        
        # Update session with photo count
        await db.photo_sessions.update_one(
            {"id": photo_data.session_id},
            {"$push": {"photos": photo.dict()}}
        )
        
        return photo
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/photos/generate-strip")
async def generate_strip(strip_data: StripGenerate):
    """Generate a photo strip from session photos"""
    try:
        # Get session
        session = await db.photo_sessions.find_one({"id": strip_data.session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get all photos for session
        photos = await db.photos.find({"session_id": strip_data.session_id}).sort("photo_index", 1).to_list(100)
        
        if len(photos) != session["photo_count"]:
            raise HTTPException(status_code=400, detail="Incomplete photo session")
        
        # Generate strip
        strip_path = photo_service.generate_photo_strip(
            strip_data.session_id,
            photos,
            {
                "photo_count": session["photo_count"],
                "layout_name": session["layout_name"]
            }
        )
        
        # Update session with strip path
        await db.photo_sessions.update_one(
            {"id": strip_data.session_id},
            {"$set": {"strip_url": strip_path, "completed": True}}
        )
        
        return {
            "strip_url": strip_path,
            "download_url": f"/api/photos/download/{strip_data.session_id}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/photos/download/{session_id}")
async def download_strip(session_id: str):
    """Download the completed photo strip"""
    session = await db.photo_sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not session.get("strip_url") or not os.path.exists(session["strip_url"]):
        raise HTTPException(status_code=404, detail="Photo strip not found")
    
    return FileResponse(
        session["strip_url"],
        media_type="image/jpeg",
        filename=f"photobooth_strip_{session_id}.jpg"
    )