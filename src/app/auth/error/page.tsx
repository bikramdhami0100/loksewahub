"use client";

import { LocaleLink } from "@/components/shared/LocaleLink";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            Something went wrong during sign in. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <LocaleLink href="/auth/login">
            <Button className="w-full">Try Again</Button>
          </LocaleLink>
          <LocaleLink href="/">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </LocaleLink>
        </CardContent>
      </Card>
    </div>
  );
}
