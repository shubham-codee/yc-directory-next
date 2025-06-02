"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";


const View = dynamic(() => import("./View"), {
  ssr: false,
  loading: () => <Skeleton className="view_skeleton" />,
});

export default function ViewWrapper({ id }: { id: string }) {
  return <View id={id} />;
}
