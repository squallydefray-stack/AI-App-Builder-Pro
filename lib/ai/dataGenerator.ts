// lib/ai/dataGenerator.ts
import { BuilderSchema, BuilderComponent } from "@lib/exporter/schema"

// Mock helper functions
const generateChartData = () => Array.from({ length: 5 }, (_, i) => ({
  label: `Metric ${i + 1}`,
  value: Math.floor(Math.random() * 100),
}))

const generateTableData = () => Array.from({ length: 5 }, (_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 2 === 0 ? "Active" : "Inactive",
}))

export async function fetchDataForSchema(schema: BuilderSchema): Promise<BuilderSchema> {
  // Clone schema to avoid mutation
  const newSchema: BuilderSchema = JSON.parse(JSON.stringify(schema))

  newSchema.pages.forEach((page) => {
    page.components.forEach((component: BuilderComponent) => {
      switch (component.name.toLowerCase()) {
        case "analytics cards":
          component.props = { data: generateChartData() }
          break
        case "chart section":
          component.props = { chartData: generateChartData() }
          break
        case "recent activity table":
          component.props = { tableData: generateTableData() }
          break
        default:
          component.props = { text: `Sample content for ${component.name}` }
      }
    })
  })

  return newSchema
}
