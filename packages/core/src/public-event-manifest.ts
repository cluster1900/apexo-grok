export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@apexo/schema/event"
import { EventManifest } from "@apexo/schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
