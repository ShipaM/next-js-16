"use client";

import { signupAction, SignupState } from "@/app/signup/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState, useRef, useEffect } from "react";
import { ErrorMessage } from "./error-message";
import Link from "next/link";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [state, formAction] = useActionState<SignupState | null, FormData>(
    signupAction,
    null,
  );
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Focus on error message when it appears
  useEffect(() => {
    if (state?.error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [state?.error]);

  return (
    <Card aria-labelledby="signup-title" {...props}>
      <CardHeader>
        <CardTitle id="signup-title">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                name="name"
                required
                autoComplete="name"
                aria-required="true"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                required
                name="email"
                autoComplete="email"
                aria-required="true"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                aria-required="true"
                aria-describedby="password-hint"
              />
              <FieldDescription id="password-hint">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            {state?.error && (
              <ErrorMessage
                ref={errorRef}
                message={state.error}
                tabIndex={-1}
              />
            )}
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
