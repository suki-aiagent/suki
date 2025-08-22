from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List
import uuid
from datetime import datetime
import asyncio
import smtplib
from email.message import EmailMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (kept for existing endpoints)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactMessageIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)

class ContactResponse(BaseModel):
    ok: bool
    message: str | None = None
    error: str | None = None


# Utilities
async def send_email_smtp(name: str, email: str, message_text: str) -> None:
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    user = os.environ.get('GMAIL_USER')
    app_password = os.environ.get('GMAIL_APP_PASSWORD')
    to_email = os.environ.get('CONTACT_TO')
    subject_prefix = os.environ.get('SUBJECT_PREFIX', '[Suki Portfolio]')

    if not user or not app_password or not to_email:
        raise RuntimeError('SMTP_NOT_CONFIGURED')

    msg = EmailMessage()
    msg['Subject'] = f"{subject_prefix} New contact from {name}"
    msg['From'] = user
    msg['To'] = to_email
    msg.set_content(
        f"Name: {name}\nEmail: {email}\n\nMessage:\n{message_text}"
    )

    def _send():
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.login(user, app_password)
            server.send_message(msg)

    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send)


# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/contact", response_model=ContactResponse)
async def post_contact(input: ContactMessageIn):
    try:
        await send_email_smtp(input.name, input.email, input.message)
        return ContactResponse(ok=True, message="Email sent")
    except RuntimeError as re:
        if str(re) == 'SMTP_NOT_CONFIGURED':
            raise HTTPException(status_code=400, detail={"ok": False, "error": "SMTP_NOT_CONFIGURED"})
        logging.exception("Configuration error while sending email")
        raise HTTPException(status_code=500, detail={"ok": False, "error": "CONFIG_ERROR"})
    except Exception as e:
        logging.exception("Failed to send email")
        raise HTTPException(status_code=500, detail={"ok": False, "error": "SMTP_SEND_FAILED"})

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()