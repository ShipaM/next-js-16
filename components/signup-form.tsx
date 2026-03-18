"use client";

import { signupAction, SignupState } from "@/app/signup/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { ErrorMessage } from "./error-message";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [state, formAction] = useActionState<SignupState | null, FormData>(
    signupAction,
    null,
  );

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="example@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <FieldDescription>
                Password must be at least 8 characters long
              </FieldDescription>
            </Field>
            {state?.error && <ErrorMessage message={state.error} />}
            <FieldGroup>
              <Field>
                <Button type="submit">Create account</Button>
                <FieldDescription className="px-6 text-center">
                  Do you have an account? <a href="/login">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
