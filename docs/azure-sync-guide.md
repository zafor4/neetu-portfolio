# Azure Server Sync Guide

Follow these steps to push code updates from your local computer to your live Azure server (`zaforiq.me`).

---

## 1. On Local Mac (Push Changes)

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

---

## 2. On Azure Server (Pull & Rebuild)

Connect via SSH:
```bash
ssh zaforiqbal@4.252.0.112
```

Pull updates & rebuild containers:
```bash
cd portfolio
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 3. Database Sync (Only if Prisma Schema Changed)

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma db push
```
