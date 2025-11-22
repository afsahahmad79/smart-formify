"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Trash2 } from "lucide-react"
import type { FormElement } from "@/types/form"

interface FormElementConfigProps {
  element: FormElement
  onUpdate: (updates: Partial<FormElement>) => void
  onClose: () => void
}

export function FormElementConfig({ element, onUpdate, onClose }: FormElementConfigProps) {
  const [localOptions, setLocalOptions] = useState(element.options || [])

  const addOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`]
    setLocalOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...localOptions]
    newOptions[index] = value
    setLocalOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index)
    setLocalOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Element Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={element.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Field label"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={element.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={element.required || false}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>
          </CardContent>
        </Card>

        {/* Options for select and radio */}
        {(element.type === "select" || element.type === "radio") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {localOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={localOptions.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Validation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(element.type === "text" || element.type === "textarea") && (
              <>
                <div>
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={element.validation?.minLength || ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...element.validation,
                          minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="maxLength">Maximum Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={element.validation?.maxLength || ""}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...element.validation,
                          maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="No limit"
                  />
                </div>
              </>
            )}

            {element.type === "text" && (
              <div>
                <Label htmlFor="pattern">Pattern (Regex)</Label>
                <Input
                  id="pattern"
                  value={element.validation?.pattern || ""}
                  onChange={(e) =>
                    onUpdate({
                      validation: {
                        ...element.validation,
                        pattern: e.target.value,
                      },
                    })
                  }
                  placeholder="^[A-Za-z]+$"
                />
                <p className="text-xs text-muted-foreground mt-1">Regular expression for validation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
