# MedyEth — Decentralized Medical Records

MedyEth is a full‑stack dApp for permissioned medical records. This README provides a concise developer guide: quick start, essential environment variables, testing, deployment, and troubleshooting.

Overview
- Backend: `backend/` (Express + Mongoose)
- Frontend: `frontend/` (React CRA)
- Smart-contract: invoked from the frontend via MetaMask

Quick start (local)
1. Start backend
```powershell
cd backend
npm install
node app.js
```
2. Start frontend
```powershell
cd frontend
npm install
npm start
```
The frontend dev server proxies `/api` requests to `http://localhost:3001`.

Environment (essential)
- Backend: `MONGODB_URI`, `SECRET_KEY`, `IV`, `JWT_SECRET`, `FRONTEND_URL`
- Frontend (production): `REACT_APP_API_URL`, `REACT_APP_RPC_URL`, `REACT_APP_CONTRACT_ADDRESS`
Add a `.env.example` listing these keys; never commit secrets.

Minimal test flow
1. Register doctor and patient (UI or API).
2. Doctor sends access request.
3. Patient opens dashboard and clicks Grant — MetaMask must be connected to the patient account.

Deployment summary
- DB: MongoDB Atlas
- Backend: Render / Railway / Heroku
- Frontend: Vercel / Netlify
- RPC: Alchemy / Infura
Deploy backend with environment variables set, and point the frontend build to the backend URL via `REACT_APP_API_URL`.

Troubleshooting & security
- Don't commit `.env` or private keys.
- `EADDRINUSE`: free or change the port.
- On‑chain grant errors: ensure the connected MetaMask address matches the patient address and contract/RPC are correct.

Features (short)
- Patient: registration/login, view records, grant/deny access
- Doctor: registration/login, request access, view authorized records, add records
- Blockchain: Solidity smart contract, MetaMask signing, immutable access logs

Tech stack
- Frontend: React, Axios, Ethers.js
- Backend: Node, Express, MongoDB, Mongoose
- Blockchain: Solidity, Ethereum, MetaMask

Project structure (high level)
```
MedyEth/
├─ backend/
├─ frontend/
├─ smart-contract/
└─ README.md
```

Need an `api.js` axios wrapper or a deployment guide? Reply `A` (axios wrapper) or `B` (detailed deploy steps).
