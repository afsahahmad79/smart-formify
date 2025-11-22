"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Globe, ExternalLink, Mail, Users } from "lucide-react"
import type { FormSchema } from "@/types/form"
import Link from "next/link"

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formSchema: FormSchema
  onPublish: (settings: { allowAnonymous: boolean; collectEmails: boolean }) => void
  onCopyLink: () => void
  onCopyEmbed: () => void
}

export function PublishDialog({
  open,
  onOpenChange,
  formSchema,
  onPublish,
  onCopyLink,
  onCopyEmbed,
}: PublishDialogProps) {
  const [allowAnonymous, setAllowAnonymous] = useState(true)
  const [collectEmails, setCollectEmails] = useState(false)

  const handlePublish = () => {
    onPublish({ allowAnonymous, collectEmails })
  }

  const isPublished = formSchema.status === "published"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>{isPublished ? "Share Your Form" : "Publish Form"}</span>
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? "Your form is live! Share it with your audience using the options below."
              : "Make your form available to collect responses from users."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={isPublished ? "share" : "publish"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publish" disabled={isPublished}>
              Publish Settings
            </TabsTrigger>
            <TabsTrigger value="share">Share & Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="space-y-4">
            {!isPublished ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Form Settings</CardTitle>
                    <CardDescription>Configure how your form will behave when published</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow anonymous responses</Label>
                        <p className="text-sm text-muted-foreground">Users can submit without signing in</p>
                      </div>
                      <Switch checked={allowAnonymous} onCheckedChange={setAllowAnonymous} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Collect email addresses</Label>
                        <p className="text-sm text-muted-foreground">Require email for all submissions</p>
                      </div>
                      <Switch checked={collectEmails} onCheckedChange={setCollectEmails} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Form Preview</CardTitle>
                    <CardDescription>Review your form before publishing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Form title:</span>
                        <span className="font-medium">{formSchema.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Total fields:</span>
                        <span className="font-medium">{formSchema.elements.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Required fields:</span>
                        <span className="font-medium">{formSchema.elements.filter((el) => el.required).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Published
                    </Badge>
                    <span>{formSchema.title}</span>
                  </CardTitle>
                  <CardDescription>
                    Published on {formSchema.publishedAt && new Date(formSchema.publishedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Anonymous responses: {allowAnonymous ? "Allowed" : "Disabled"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>Email collection: {collectEmails ? "Required" : "Optional"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            {isPublished ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Share Link</CardTitle>
                    <CardDescription>Direct link to your form</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input value={formSchema.shareUrl || ""} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="sm" onClick={onCopyLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={formSchema.shareUrl || "#"} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this link with anyone you want to fill out your form
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Embed Code</CardTitle>
                    <CardDescription>Embed your form on any website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative">
                      <Textarea
                        value={formSchema.embedCode || ""}
                        readOnly
                        className="font-mono text-xs resize-none"
                        rows={3}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={onCopyEmbed}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Copy and paste this code into your website's HTML to embed the form
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Sharing</CardTitle>
                    <CardDescription>Share on social media platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                      >
                        <a
                          href={`https://twitter.com/intent/tweet?text=Check out this form: ${formSchema.title}&url=${formSchema.shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Share on Twitter
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${formSchema.shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Share on LinkedIn
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Publish your form first to access sharing options</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {!isPublished ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={formSchema.elements.length === 0}>
                <Globe className="h-4 w-4 mr-2" />
                Publish Form
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
