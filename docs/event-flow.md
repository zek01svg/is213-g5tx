# Event Flow & Messaging

TownOps uses RabbitMQ to handle eventual consistency and business triggers that don't need to block the user.

## Core Message Flows

### 1. Case Lifecycle

- **Event**: `case.created`
  - **Publisher**: `case-atom`
  - **Consumers**:
    - `alert-atom`: Creates initial SLA monitoring alerts.
    - `metrics-atom`: Increments "New Cases" counter.

- **Event**: `job.assigned`
  - **Publisher**: `assignment-atom`
  - **Consumers**:
    - `resident-atom`: Sends push notification to the reporting resident.
    - `alert-atom`: Resolves "Unassigned Case" alert.

### 2. SLA & Breach Management

- **Event**: `sla.warning`
  - **Publisher**: `alert-atom` (via delayed exchange)
  - **Consumer**:
    - `case-composite`: Triggers internal staff escalation workflow.

## Exchange Configuration

- **Exchange**: `townops.events` (Topic)
- **Routing Keys**: `<entity>.<action>`
  - Example: `case.created`, `alert.triggered`

## Reliability Patterns

1. **Dead Letter Exchanges (DLX)**: Any message that fails processing 3 times is moved to `townops.dlx` for manual investigation.
2. **Idempotency**: All consumers use unique event IDs to prevent duplicate processing.
3. **Acknowledgment**: Manual ACKs are required for critical data mutations.
