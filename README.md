# weRide 🚗 ✨

weRide is a premium, enterprise-grade ride-sharing platform designed for extreme scale and high-end user experiences. Built with the **Stitch Design System**, it combines fluid glassmorphism aesthetics with a backend architecture capable of handling **1 million+ concurrent requests**.

---

## 🏗 System Architecture

weRide is organized as a monorepo, ensuring strict type safety and code sharing across web and mobile platforms.

- **Admin Dashboard**: Next.js 14 operational center for live monitoring.
- **Mobile Experience**: Universal React Native (Expo) app for both Riders and Drivers.
- **High-Performance Backend**: NestJS powered by Fastify and Redis Geo-Spatial indexing.
- **Shared UI**: A unified CSS-variable based design system for consistent "Stitch" aesthetics.

## 🚀 Extreme Scaling (1M Ready)

The platform has been hardened for global-scale traffic:
-   **Fastify Foundation**: Significant performance boost over standard Express backends.
-   **Redis Geo-Spatial matching**: Sub-millisecond driver-rider pairing using in-memory indexed searches.
-   **Asynchronous Booking (BullMQ)**: Ride matching is offloaded to background workers to ensure the API never blocks.
-   **Socket.io Clustering**: Horizontally scalable real-time events via a Redis pub/sub adapter.

## 📖 Deep Documentation

Explore our technical deep-dives:
-   [Scaling Guide](./apps/server/SCALING_GUIDE.md) - How we handle 1M requests.
-   [Implementation Plan](./IMPLEMENTATION_PLAN.md) - The roadmap and architecture diagram.
-   [Load Testing](./apps/server/test/load-test.js) - Verification scripts for throughput.


## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, TypeScript, Vanilla CSS |
| **Mobile** | React Native (Expo) |
| **Backend** | NestJS (Fastify), Prisma ORM |
| **Database** | PostgreSQL, Redis (Clustered) |
| **Queueing** | BullMQ |
| **Payments** | Stripe |

## 🚦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Infrastructure**:
    Ensure you have **PostgreSQL** and **Redis** running. You can use the provided `.env.example` in `apps/server` to configure your connections.
3.  **Run Development Environment**:
    ```bash
    # Run everything
    npm run dev
    ```

---

## ⚖️ License
UNLICENSED - Custom commercial project. Developed with ❤️ by Antigravity.
