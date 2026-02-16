# ⚙️ TwinLearn - Core Backend Service

This module acts as the central nervous system of the TwinLearn platform.  
Built with **ASP.NET Core 9**, it serves as the API Gateway, manages business logic, and orchestrates communication with the Python AI Service.


## 🏗️ Architectural Design

The solution follows **Clean Architecture principles** to ensure separation of concerns, maintainability, and testability.

### Layer Breakdown

#### Domain Layer (Core Project)

- Contains Enterprise Logic, Entities (User, Problem, Appointment), Enums.

#### Application Layer

- Application Business Logic organized by Feature Services (e.g., ProblemService, ChecklistService, AuthService)
- Interfaces: Defines contracts for Repositories (Data Access) and External Services (AI Integration)
- DTOs: Data Transfer Objects for API request/response
- Mapping: Object mapping (AutoMapper)

#### Infrastructure Layer

- Implements interfaces defined in the Application layer
- Persistence: Entity Framework Core (PostgreSQL) & Data Seeding
- External Services: HTTP Clients for communicating with the Python AI Service

#### API Layer (Presentation)

- RESTful Controllers acting as entry points
- Configures Dependency Injection (DI) and Middleware pipeline (Swagger)

## 🔗 Integration with AI Service

This backend does not execute AI tasks directly.  
It delegates complex logic (Syntax Check, Task Solver) to the Python Microservice via HTTP requests.

**Interfaces (Application Layer):** IGeminiService, IKbService
