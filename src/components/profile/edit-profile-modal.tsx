"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useUsernameValidation } from "@/hooks/useUsernameValidation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export interface UserProfile {
  name: string;
  username: string;
  discipline: string;
  bio: string;
  location: string;
  website: string;
}

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => Promise<void> | void;
}

export function EditProfileModal({ open, onOpenChange, profile, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const { username, setUsername, isValidating, isAvailable, suggestions } = useUsernameValidation(profile.username);

  useEffect(() => {
    if (open) {
      setFormData(profile);
      setUsername(profile.username);
    }
  }, [open, profile, setUsername]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      const formatted = value.replace(/[^a-zA-Z0-9_]/g, '');
      setUsername(formatted);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUsername(suggestion);
    setFormData(prev => ({ ...prev, username: suggestion }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // If it's taken, don't submit and let them know
    if (isAvailable === false && !isValidating) {
      return;
    }
    
    if (username.length >= 3) {
      setIsSaving(true);
      try {
        await onSave(formData);
        onOpenChange(false);
      } catch (error) {
        // Error is handled by onSave
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3 bg-secondary/50"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="username" className="text-right text-sm font-medium pt-3">
              Username
            </label>
            <div className="col-span-3 space-y-2">
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`bg-secondary/50 pr-10 ${isAvailable === false && !isValidating ? 'border-red-500/50 focus-visible:ring-red-500/50' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : formData.username.length >= 3 ? (
                    isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )
                  ) : null}
                </div>
              </div>
              {isAvailable === false && !isValidating && suggestions.length > 0 && (
                <div className="text-sm">
                  <p className="text-red-500 mb-1">Username is taken. Try:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => handleSuggestionClick(s)}
                        className="px-2 py-1 bg-secondary rounded-md text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="discipline" className="text-right text-sm font-medium">
              Discipline
            </label>
            <Input
              id="discipline"
              name="discipline"
              value={formData.discipline}
              onChange={handleChange}
              className="col-span-3 bg-secondary/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="location" className="text-right text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3 bg-secondary/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="website" className="text-right text-sm font-medium">
              Website
            </label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="col-span-3 bg-secondary/50"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="bio" className="text-right text-sm font-medium pt-2">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="col-span-3 resize-none bg-secondary/50"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || (isAvailable === false && !isValidating) || username.length < 3}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
