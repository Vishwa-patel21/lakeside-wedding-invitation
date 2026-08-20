"use client";

import { useEffect, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { weddingConfig } from "@/lib/config";

export default function PhotosPage() {
  const canvasRef = useRef(null);
  const [pageUrl, setPageUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    setPageUrl(url);
    import("qrcode").then((QRCode) => {
      if (!canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, url, {
        width: 280,
        margin: 2,
        color: {
          dark: "#73561d",
          light: "#fffaf0"
        }
      });
    });
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const uploader = form.get("name") || "guest";
    const files = Array.from(form.getAll("photos")).filter((file) => file.size);

    if (!files.length) {
      setStatus("Please choose at least one photo.");
      return;
    }

    if (!isSupabaseConfigured) {
      setStatus("Photo uploads will work after Supabase keys are added.");
      return;
    }

    setIsUploading(true);
    for (const file of files) {
      const safeName = file.name.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
      const path = `${Date.now()}-${uploader.replace(/[^a-z0-9]/gi, "-")}-${safeName}`;
      const { error } = await supabase.storage
        .from(weddingConfig.photos.bucket)
        .upload(path, file, { upsert: false });

      if (error) {
        setIsUploading(false);
        setStatus("One upload failed. Please try again.");
        return;
      }
    }

    event.currentTarget.reset();
    setIsUploading(false);
    setStatus("Thank you. Your photos were uploaded.");
  }

  return (
    <main className="photoPage">
      <section className="photoHero">
        <div>
          <p className="eyebrow">{weddingConfig.couple.initials}</p>
          <h1>Share your wedding photos</h1>
          <p>
            Scan this page at the celebration, then upload your favorite moments
            from the lakeside.
          </p>
        </div>
        <canvas ref={canvasRef} width="280" height="280" aria-label={pageUrl} />
      </section>

      <section className="sectionInner uploadSection">
        <form className="rsvpForm" onSubmit={handleUpload}>
          <label>
            Your name
            <input name="name" required placeholder="Full name" />
          </label>
          <label>
            Photos
            <input name="photos" type="file" accept="image/*" multiple required />
          </label>
          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Photos"}
          </button>
          {status ? <p className="formStatus">{status}</p> : null}
        </form>
      </section>
    </main>
  );
}
