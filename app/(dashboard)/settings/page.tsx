'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { signOut } = useAuth()

  // Email preferences
  const [emailPrefs, setEmailPrefs] = useState({
    weeklyMatches: true,
    deadlineReminders: true,
    applicationUpdates: true,
    marketing: false,
  })

  const handleSavePreferences = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated.',
    })
    setIsSaving(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Account Deleted',
          description: 'Your account has been successfully deleted.',
        })
        signOut()
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose which emails you&apos;d like to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyMatches">Weekly Match Digest</Label>
              <p className="text-sm text-muted-foreground">
                Get personalized opportunity recommendations weekly.
              </p>
            </div>
            <Switch
              id="weeklyMatches"
              checked={emailPrefs.weeklyMatches}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, weeklyMatches: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="deadlineReminders">Deadline Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded before application deadlines.
              </p>
            </div>
            <Switch
              id="deadlineReminders"
              checked={emailPrefs.deadlineReminders}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, deadlineReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="applicationUpdates">Application Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about your application status changes.
              </p>
            </div>
            <Switch
              id="applicationUpdates"
              checked={emailPrefs.applicationUpdates}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, applicationUpdates: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Product Updates & Tips</Label>
              <p className="text-sm text-muted-foreground">
                Receive tips and updates about new features.
              </p>
            </div>
            <Switch
              id="marketing"
              checked={emailPrefs.marketing}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, marketing: checked })
              }
            />
          </div>

          <Button onClick={handleSavePreferences} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>
            Control your data and privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export Your Data</Label>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your data.
              </p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
