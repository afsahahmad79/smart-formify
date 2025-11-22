"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Type, Mail, FileText, List, CheckCircle, Circle, Hash } from "lucide-react"

const formElements = [
  { id: "text", label: "Text Input", icon: Type },
  { id: "email", label: "Email Input", icon: Mail },
  { id: "textarea", label: "Text Area", icon: FileText },
  { id: "select", label: "Dropdown", icon: List },
  { id: "radio", label: "Radio Group", icon: Circle },
  { id: "checkbox", label: "Checkbox", icon: CheckCircle },
  { id: "number", label: "Number Input", icon: Hash },
]

function DraggableElement({ element }: { element: typeof formElements[0] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: {
      type: "palette",
      elementType: element.id,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all select-none ${
        isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <element.icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{element.label}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function FormElementPalette() {
  return (
    <div className="p-4 space-y-2">
      {formElements.map((element) => (
        <DraggableElement key={element.id} element={element} />
      ))}
    </div>
  )
}
