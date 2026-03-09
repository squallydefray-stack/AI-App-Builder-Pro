/* =============================
1. DATABASE EXTENSIONS
============================= */


// Prisma models
model Template {
id String @id @default(cuid())
name String
description String
schema Json
author User @relation(fields: [authorId], references: [id])
authorId String
createdAt DateTime @default(now())
tags String[]
isFeatured Boolean @default(false)
price Float? // Optional for paid templates
}


model MarketplacePurchase {
id String @id @default(cuid())
buyer User @relation(fields: [buyerId], references: [id])
buyerId String
template Template @relation(fields: [templateId], references: [id])
templateId String
purchasedAt DateTime @default(now())
price Float
}
