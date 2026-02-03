# AI 3D Tutor: JWT Authentication Visualized

Welcome to the **AI 3D Tutor**, a spatial learning platform designed to visualize complex web protocols through 3D environments and real-time AI context. This module focuses on the **JSON Web Token (JWT)** authentication flow.

## 🚀 Project Overview
This project maps the abstract sequence of JWT authentication to a physical 3D environment. By visualizing tokens as physical assets and servers as spatial entities, it builds a stronger mental model for developers. An integrated AI tutor provides real-time context, explaining the technical rationale behind each visual transition.

## ❓ Problem Statement
JWT authentication is often perceived as a "black box." Concepts like statelessness, digital signatures, and self-contained payloads are difficult to visualize using only 2D diagrams. This lack of visual intuition can lead to common security oversights and architectural misconceptions.

## 💡 Solution Concept
We implement a **Spatial Representation of the Auth Flow**:
- **3D Visualization**: Physical assets representing the Client, Auth Server, and Protected Resource.
- **Narrative Sequence**: A structured walkthrough that decomposes the protocol into atomic, observable steps.
- **Interactive Context**: A multi-agent system (3D view + AI) where technical inquiries are answered in the context of the current visual state.

## 🏗 Internal Architecture
The project follows a **decoupled architecture**, separating the 3D presentation layer from the protocol logic:

- **Scene Orchestration**: `Scene.jsx` serves as the orchestrator. It manages the global state and coordinates modular components (`User`, `Gate`, `AuthServer`) via a declarative configuration.
- **Semantic Animation Engine**: Animations are encapsulated into named, story-driven functions (e.g., `moveUserToServer`, `openGate`). This ensures the logic is readable and easily maintainable.
- **State-Synchronized Narration**: The tutor's narration is served via an API, ensuring that visual transitions and textual explanations remain synchronized through a centralized state controller.

## 💻 Tech Stack
- **Frontend**: React, Three.js (via `@react-three/fiber` and `@react-three/drei`)
- **Backend**: Node.js, Express (API for narration and pedagogical context)
- **Styling**: Modern CSS with glassmorphism and responsive design principles.
- **Control**: Ref-based animation targeting for high-performance 3D updates.

## 🌟 Why This Project Matters
This repository demonstrates advanced engineering patterns applied to educational technology:

- **Full-Stack Orchestration**: Synchronizing 3D state with backend APIs and state management.
- **Extensible Architecture**: Implemented a **Model Abstraction Layer**, allowing the swap of primitive geometry for high-fidelity GLTF assets without altering the core animation logic.
- **System Thinking**: Reflects real-world microservice logic, where the view layer respects protocol boundaries and stateless design.

## 🔮 Future Scope
- **Asset Integration**: Swapping primitives for optimized GLTF models.
- **Protocol Expansion**: Implementing OAuth2, OpenID Connect, and PKCE flow visualizations.
- **Payload Inspector**: Real-time 3D decoding of JWT parts (Header, Payload, Signature).
- **Multiplayer State**: Collaborative learning via WebSockets for shared 3D sessions.

---
*Built to make complex web protocols accessible and intuitive.*
