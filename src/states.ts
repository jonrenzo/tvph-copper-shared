// State types — the 12 token-state modifications from the source model.
export enum StateType {
  Creation = "Creation",
  Modification = "Modification",
  Transfer = "Transfer",
  Movement = "Movement",
  Correction = "Correction",
  Purification = "Purification",
  Split = "Split",
  Retirement = "Retirement",
  Sale = "Sale",
  Assign = "Assign",
  ClearAssignment = "ClearAssignment",
  MainAttributeChange = "MainAttributeChange",
}

// Movement subtypes — the 16 concrete movements, each tagged with its parent state.
export enum MovementType {
  AirToGround = "AirToGround",
  BuriedToSurface = "BuriedToSurface",
  InsideToOutside = "InsideToOutside",
  LoadingOnTruck = "LoadingOnTruck",
  OffloadingTruck = "OffloadingTruck",
  WarehouseEnter = "WarehouseEnter",
  LoadingOnShip = "LoadingOnShip",
  OffloadingShip = "OffloadingShip",
  EnterProduction = "EnterProduction",
  ExitProduction = "ExitProduction",
  StrippingOfProtection = "StrippingOfProtection",
  Granulating = "Granulating",
  Packing = "Packing",
  Storing = "Storing",
  Export = "Export",
  Pyrolysis = "Pyrolysis",
}

// Some movements are always Movement or always Purification/Transfer; others
// are "Transfer OR Movement" — resolved at runtime by whether the responsible
// handler changes (see resolveTransferOrMovement below).
export type ParentState =
  | StateType.Movement
  | StateType.Transfer
  | StateType.Purification
  | "TransferOrMovement";

export const MOVEMENT_PARENT: Record<MovementType, ParentState> = {
  [MovementType.AirToGround]: StateType.Movement,
  [MovementType.BuriedToSurface]: StateType.Movement,
  [MovementType.InsideToOutside]: StateType.Movement,
  [MovementType.LoadingOnTruck]: "TransferOrMovement",
  [MovementType.OffloadingTruck]: "TransferOrMovement",
  [MovementType.WarehouseEnter]: "TransferOrMovement",
  [MovementType.LoadingOnShip]: "TransferOrMovement",
  [MovementType.OffloadingShip]: "TransferOrMovement",
  [MovementType.EnterProduction]: StateType.Movement,
  [MovementType.ExitProduction]: StateType.Movement,
  [MovementType.StrippingOfProtection]: StateType.Movement,
  [MovementType.Granulating]: StateType.Purification,
  [MovementType.Packing]: "TransferOrMovement",
  [MovementType.Storing]: "TransferOrMovement",
  [MovementType.Export]: StateType.Transfer,
  [MovementType.Pyrolysis]: StateType.Purification,
};

// For "TransferOrMovement" movements: it's a Transfer if the responsible
// handler changes, otherwise just a Movement.
export function resolveTransferOrMovement(handlerChanged: boolean): StateType {
  return handlerChanged ? StateType.Transfer : StateType.Movement;
}
