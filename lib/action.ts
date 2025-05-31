"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: "Not signed in",
        status: "error",
      });
    }

    const { title, description, category, link } = Object.fromEntries(
      Array.from(form).filter(([key]) => key != "pitch")
    );

    const slug = slugify(title as string, { lower: true, strict: true });
    const newStartup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({
      _type: "startup",
      ...newStartup,
    });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (err) {
    console.log(err);
    return parseServerActionResponse({
      error: JSON.stringify(err),
      status: "ERROR",
    });
  }
};
