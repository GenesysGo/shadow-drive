import * as Mode from "./Mode"

export { Mode }

export type ModeKind = Mode.Increment | Mode.Decrement | Mode.Initialize
export type ModeJSON =
  | Mode.IncrementJSON
  | Mode.DecrementJSON
  | Mode.InitializeJSON
