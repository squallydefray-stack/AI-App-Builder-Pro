// lib/builder/defaultComponents.ts

import { BuilderComponent } from "../exporter/schema"
import { v4 as uuid } from "uuid"

const baseStyle = {
  x: 0,
  y: 0,
  width: 200,
  height: 120,
}

export function createImage(): BuilderComponent {
  return {
    id: uuid(),
    type: "Image",
    propsPerBreakpoint: {
      base: {
        ...baseStyle,
      },
    },
    layout: {
      mode: "absolute",
      constraints: {
        horizontal: "left",
        vertical: "top",
      },
    },
  }
}

export function createVideo(): BuilderComponent {
  return {
    id: uuid(),
    type: "Video",
    propsPerBreakpoint: {
      base: {
        ...baseStyle,
      },
    },
    layout: {
      mode: "absolute",
      constraints: {
        horizontal: "left",
        vertical: "top",
      },
    },
  }
}

export function createForm(): BuilderComponent {
  return {
    id: uuid(),
    type: "Form",
    propsPerBreakpoint: {
      base: {
        ...baseStyle,
      },
    },
    layout: {
      mode: "absolute",
      constraints: {
        horizontal: "left",
        vertical: "top",
      },
    },
  }
}

export function createCard(): BuilderComponent {
  return {
    id: uuid(),
    type: "Card",
    propsPerBreakpoint: {
      base: {
        ...baseStyle,
        borderRadius: 12,
      },
    },
    layout: {
      mode: "absolute",
      constraints: {
        horizontal: "left",
        vertical: "top",
      },
    },
  }
}