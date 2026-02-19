export const buttonVariants = {
  primary: {
    bgColor: "primary",
    textColor: "background",
    rounded: "md",
    padding: "md"
  },
  secondary: {
    bgColor: "surface",
    textColor: "primary",
    rounded: "md",
    padding: "md"
  }
}
if (component.variant && component.type === "button") {
  component.responsiveProps.base = {
    ...buttonVariants[component.variant],
    ...component.responsiveProps.base
  }
}
