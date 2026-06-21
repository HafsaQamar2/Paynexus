"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function DemoButton({ label = "View live demo", size = "md", className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function enterDemo() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (!res.ok) throw new Error("Could not start demo");
      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      alert("Something went wrong starting the demo. Please try again.");
    }
  }

  return (
    <Button size={size} onClick={enterDemo} disabled={loading} className={className}>
      {loading ? "Loading demo…" : label}
    </Button>
  );
}
