# AI Smart Hotel Platform - Backend API

> This is the **Backend API** repository for the AI-Powered MERN Hotel Booking Platform. Built on a modular **Node.js + Express.js** server and **TypeScript**, it manages all core business logic, **MongoDB** data persistence, secure user authentication, **Stripe** payment processing, and the advanced **AI search** logic.

## 🛠️ Tech Stack (Backend)

* **Runtime & Framework** → Node.js & Express.js (TypeScript)
* **Database** → MongoDB with Mongoose (ODM)
* **Authentication** → Clerk Middleware (for API route protection)
* **A.I Search** → AI Model GPT 5 (via Open AI)
* **Payment Gateway** → Stripe
* **Architecture** → Domain-Driven Design (Modular)
* **Error Handling** → Global Error Middleware
* **Deployment** → Render 🔗 [API Endpoint](https://aidf-5-back-end-iroshan.onrender.com/api)

## 🔗 Frontend & API links

This backend service is consumed by a separate React frontend application.

**Frontend Repository** → 🔗 [ckiroshan/AI-Smart-Hotel-Platform-Frontend](https://github.com/ckiroshan/AI-Financial-Tracker)

## 🏗️ API Data Flow
This server plays a central role in complex functionalities like AI search and secure bookings. The architecture is modular, promoting scalability and maintainability.

### Key Responsibilities:
  * **Security & Auth** → Protects all endpoints using **Clerk Middleware** to verify user sessions.
  * **Business Logic** → Manages hotel listing, filtering, sorting, and user booking data.
  * **Payment Gateway** → Interacts with **Stripe** to create payment intents, confirm payments, and process webhooks for booking status updates.
  * **AI Search Logic** → Processes and matches user's natural language search prompts to hotel records using **AI embeddings**.
  * **Data Persistence** → Handles all CRUD operations with **MongoDB/Mongoose**.

### Core Server Data Flow:

1.  **Client Request** → The Frontend sends a request (e.g., fetch hotels, create booking) to the **NodeJS Server (Backend)**.
2.  **Authentication** → The server uses **Clerk Middleware** to verify the user's authenticated status.
3.  **Core Logic** → The request is processed through the **Controller** and relevant **Service** layer (e.g., Hotel Service, Booking Service).
4.  **AI Search Flow** → For AI-enabled searches, the server leverages its logic to perform semantic matching against the hotel data before fetching results from the DB.
5.  **Payment Flow** → For a booking request, the server communicates with the **Stripe API** to initiate a payment session and later receives status updates via webhooks.
6.  **Database** → All data operations are performed via **Mongoose** to **MongoDB**.
7.  **Response** → The server formats the appropriate response (JSON) and returns it to the Frontend.

## 💻 API Endpoints

The API is protected by **Clerk Authentication Middleware**, meaning most data-mutating and user-specific endpoints require a valid authenticated session.

*Note: A detailed Swagger API documentation is in work & will be updated here soon.*

## 💡 Challenges & Learnings
* **Stripe Webhook Security:** Implementing robust validation and signature verification for incoming Stripe webhook events to securely update booking status.
* **Domain-Driven Architecture:** Structuring the server using the modular approach to clearly separate DTOs, domain models, application services, and infrastructure concerns for high maintainability.
* **AI Data Processing:** Designing the backend logic to efficiently handle embedding-based searches for hotel data, transforming user's text into actionable database queries.
* **TypeScript Migration:** Successfully migrating the initial Node.js/Express.js project to TypeScript for improved code quality, fewer runtime errors, and better developer experience.

## 👨‍💻 Purpose & Contribution
This project was built as I was learning from an AI Bootcamp where I was introduced to cool ways of integrating AI features to full stack applications. Currently this repo doesn't accept external contributions or pull requests. Thank you.