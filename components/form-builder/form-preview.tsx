"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormSchema } from "@/types/form"

interface FormPreviewProps {
  formSchema: FormSchema
}

export function FormPreview({ formSchema }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  const updateFormData = (elementId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [elementId]: value,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{formSchema.title}</CardTitle>
          {formSchema.description && <p className="text-muted-foreground">{formSchema.description}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formSchema.elements.map((element) => (
              <div key={element.id} className="space-y-2">
                <Label htmlFor={element.id}>
                  {element.label}
                  {element.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {element.type === "text" || element.type === "email" || element.type === "number" ? (
                  <Input
                    id={element.id}
                    type={element.type}
                    placeholder={element.placeholder}
                    required={element.required}
                    value={formData[element.id] || ""}
                    onChange={(e) => updateFormData(element.id, e.target.value)}
                  />
                ) : element.type === "textarea" ? (
                  <Textarea
                    id={element.id}
                    placeholder={element.placeholder}
                    required={element.required}
                    value={formData[element.id] || ""}
                    onChange={(e) => updateFormData(element.id, e.target.value)}
                  />
                ) : element.type === "select" ? (
                  <Select
                    value={formData[element.id] || ""}
                    onValueChange={(value) => updateFormData(element.id, value)}
                    required={element.required}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {element.options?.map((option, idx) => (
                        <SelectItem key={idx} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : element.type === "radio" ? (
                  <RadioGroup
                    value={formData[element.id] || ""}
                    onValueChange={(value) => updateFormData(element.id, value)}
                    required={element.required}
                  >
                    {element.options?.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${element.id}-${idx}`} />
                        <Label htmlFor={`${element.id}-${idx}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : element.type === "checkbox" ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={element.id}
                      checked={formData[element.id] || false}
                      onCheckedChange={(checked) => updateFormData(element.id, checked)}
                      required={element.required}
                    />
                    <Label htmlFor={element.id}>{element.label}</Label>
                  </div>
                ) : null}
              </div>
            ))}

            {formSchema.elements.length > 0 && (
              <Button type="submit" className="w-full">
                Submit Form
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
