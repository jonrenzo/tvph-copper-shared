import { Batch, LifecycleEvent } from "./types";
import { StateType, MovementType } from "./states";

// ---------------------------------------------------------------------------
// API CONTRACT — agreed in Sprint 0. Both web and mobile build against these
// shapes (mock first, live later). Change shapes HERE first, then implement.
// ---------------------------------------------------------------------------

// POST /batches  — Creation
export interface CreateBatchRequest {
  attributes: Batch["attributes"];
  mainAttribute: Batch["mainAttribute"];
  quantity: number;
  owner: string;
  actor: string;
}
export interface CreateBatchResponse {
  batch: Batch;
  event: LifecycleEvent; // the Creation event
}

// GET /batches
export interface ListBatchesResponse {
  batches: Batch[];
}

// GET /batches/:id
export interface GetBatchResponse {
  batch: Batch;
}

// GET /batches/:id/events  — the audit timeline
export interface GetEventsResponse {
  events: LifecycleEvent[]; // ordered by hcsSequence
}

// POST /batches/:id/actions  — every lifecycle action after Creation
export interface BatchActionRequest {
  stateType: StateType;
  movementType?: MovementType;
  actor: string;
  handlerChanged?: boolean; // for Transfer-vs-Movement resolution
  to?: string;              // new owner (Transfer / Sale release)
  reason?: string;
  proofHash?: string;
  attributeChanges?: Partial<Batch["attributes"]>; // Correction / Modification
}
export interface BatchActionResponse {
  batch: Batch;
  event: LifecycleEvent;
}

// Sale flow endpoints
export interface ListForSaleRequest { seller: string; buyer: string; }
export interface SaleActionResponse {
  saleId: string;
  state: string;
  event: LifecycleEvent;
}

// Standard error shape
export interface ApiError {
  error: string;
  detail?: string;
}
