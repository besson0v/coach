# Coach v1 architecture

## Runtime split
- Mini App frontend: static web UI (can stay on GitHub Pages)
- Backend/API: VDSina, folder `bots/coach`, Docker-managed
- Storage: local disk on VDSina at first
- Database: PostgreSQL (next step)

## v1 ingestion flow
1. User sends text or file to Telegram bot
2. Bot stores raw inbound payload + file metadata
3. Worker extracts text from PDF/DOCX/images
4. Normalizer classifies payload into one or more entity types
5. User gets short confirmation with parsed summary
6. Parsed entities become visible in Mini App

## Initial entity model
- workouts
- symptoms
- labs
- visits
- documents
- protocols

## Notes
- Keep ports away from 80/443 on VDSina
- Docker only
- Files can start on local disk and later move to object storage if needed
