"use client"

import { componentSchemas } from "./schemas/componentSchemas"
import AnimatedSection from "./animations/AnimatedSection"

import TextField from "./fields/TextField"
import NumberField from "./fields/NumberField"
import BooleanField from "./fields/BooleanField"
import SelectField from "./fields/SelectField"
import SpacingField from "./fields/SpacingField"
import TokenSelectField from "./fields/TokenSelectField"

export default function InspectorSections({
  component,
  breakpoint,
  onChange,
}: any) {
  const schema = componentSchemas[component.type]

  if (!schema) return null

  const props = component.props?.[breakpoint] || {}

  function renderField(field: any) {
    const value = props[field.key]

    switch (field.type) {
      case "text":
        return (
          <TextField
            label={field.label}
            value={value}
            onChange={(v: any) => onChange(field.key, v)}
          />
        )

      case "number":
        return (
          <NumberField
            label={field.label}
            value={value}
            onChange={(v: any) => onChange(field.key, v)}
          />
        )

      case "boolean":
        return (
          <BooleanField
            label={field.label}
            value={value}
            onChange={(v: any) => onChange(field.key, v)}
          />
        )

      case "select":
        return (
          <SelectField
            label={field.label}
            value={value}
            options={field.options}
            onChange={(v: any) => onChange(field.key, v)}
          />
        )

      case "spacing":
        return (
          <SpacingField
            label={field.label}
            value={value}
            onChange={(v: any) => onChange(field.key, v)}
          />
        )

      case "token-color":
      case "token-font":
        return (
          <TokenSelectField
            label={field.label}
            value={value}
            type={field.type}
            onChange={(v: any) => onChange(field.key, v)}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {schema.sections.map((section) => (
        <AnimatedSection key={section.label}>
          <div className="text-xs uppercase text-neutral-500 mb-2">
            {section.label}
          </div>

          <div className="space-y-3">
            {section.fields.map((field) => (
              <div key={field.key}>{renderField(field)}</div>
            ))}
          </div>
        </AnimatedSection>
      ))}
    </div>
  )
}
