"use client";

import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { z } from "zod";

import dynamic from "next/dynamic";
import { formSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/action";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: { error: string; status: string } | undefined, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch( formData, pitch);

      if (result.status == "SUCCESS") {
        toast({
          title: "success",
          description: "your startup has been created successfully",
        });
      } else {
        toast({
          title: "problem",
          description: "problem",
          variant: "destructive",
        });
      }

      router.push(`/startup/${result._id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        console.log(fieldErrors);
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "error",
          description: "please check your input",
          variant: "destructive",
        });

        return { ...prevState, error: "validation failed", status: "ERROR" };
      }

      toast({
        title: "error",
        description: "unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "unexpected error",
        status: "ERROR",
      };
    }
  };

  const [, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
      </div>
      {errors.title && <p className="startup-form_error">{errors.title}</p>}

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
      </div>
      {errors.description && (
        <p className="startup-form_error">{errors.description}</p>
      )}

      <div>
        <label htmlFor="category" className="startup-form_label">
          category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category(Tech, Health, Education)"
        />
      </div>
      {errors.category && (
        <p className="startup-form_error">{errors.category}</p>
      )}

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image Link
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
      </div>
      {errors.link && <p className="startup-form_error">{errors.link}</p>}

      <div data-color-mode="light">
        <label htmlFor="link" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch((value as string) || "")}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
      </div>
      {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-10 ml-1" />
      </Button>
    </form>
  );
};

export default StartupForm;
