import { StateType, MovementType } from "./states";

// A copper batch — 1:1 with an NFT serial. Quantity is tracked as a value
// (hybrid model: NFT identity + quantity inside), geo fields deferred.
export interface Batch {
  id: string;                 // uuid
  tokenId: string;            // HTS token id, e.g. "0.0.xxxx"
  serialNumber: number;       // NFT serial within the token
  parentBatchId: string | null; // set when produced by a Split
  status: BatchStatus;
  attributes: BatchAttributes;
  mainAttribute: "length" | "weight";
  quantity: number;
  currentOwner: string;       // account id / actor reference
  createdAt: string;          // ISO timestamp
}

export type BatchStatus =
  | "active"
  | "retired"
  | "in_escrow"
  | "sold"
  | "split";

export interface BatchAttributes {
  wireType?: string;          // type / standard
  copperPercent?: number;
  weight?: number;
  length?: number;
  originRef?: string;         // source reference (pole id / underground ref)
  accessibility?: string;
  [key: string]: unknown;     // room for future fields (geo deferred)
}

// One lifecycle event — mirrors an HCS message; cached in DB for fast reads.
export interface LifecycleEvent {
  id: string;
  batchId: string;
  stateType: StateType;
  movementType: MovementType | null;
  actor: string;              // role + reference
  payload: EventPayload;
  hcsTopicId: string;
  hcsSequence: number;        // consensus sequence number (proof of order)
  consensusTs: string;        // Hedera consensus timestamp
  txId: string;               // Hedera transaction id
  createdAt: string;
}

export interface EventPayload {
  from?: string;
  to?: string;
  reason?: string;
  proofHash?: string;         // hash of any off-chain artifact
  [key: string]: unknown;
}

// QR tag (v1); tagKind left generic so NFC/RFID slot in later.
export interface Tag {
  id: string;
  tagCode: string;
  tagKind: "qr" | "nfc" | "rfid";
  batchId: string | null;     // null when cleared
  boundAt: string | null;
  clearedAt: string | null;
}

// Mock escrow lifecycle for the Sale flow.
export interface Sale {
  id: string;
  batchId: string;
  seller: string;
  buyer: string;
  contractId: string;
  state: "listed" | "in_escrow" | "payment_confirmed" | "released" | "cancelled";
  paymentRef: string | null;  // mock; hash anchored to HCS
  createdAt: string;
}
