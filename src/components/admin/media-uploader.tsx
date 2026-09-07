"use client";

import { useId, useState } from "react";
import { CheckCircle2, LoaderCircle, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MediaKind = "image" | "audio" | "video";
const accepts: Record<MediaKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  audio: "audio/mpeg,audio/mp4,audio/wav,audio/ogg",
  video: "video/mp4,video/webm",
};
const labels: Record<MediaKind, string> = {
  image: "Imagem de capa",
  audio: "Narração premium do artigo",
  video: "Vídeo complementar",
};

export function MediaUploader({
  kind,
  name,
  required = false,
}: {
  kind: MediaKind;
  name: string;
  required?: boolean;
}) {
  const id = useId();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );

  async function upload(file: File) {
    const limit = kind === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > limit || !accepts[kind].split(",").includes(file.type)) {
      setStatus("error");
      return;
    }

    setStatus("uploading");
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${kind}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const supabase = createClient();
    const { error } = await supabase.storage
      .from("editorial-media")
      .upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      setStatus("error");
      return;
    }
    const { data } = supabase.storage.from("editorial-media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("done");
  }

  return (
    <div className="media-uploader">
      <input type="hidden" name={name} value={url} required={required} />
      <label htmlFor={id}>
        <span>{labels[kind]}</span>
        <strong>
          {status === "uploading" ? (
            <LoaderCircle className="auth-spinner" aria-hidden="true" />
          ) : status === "done" ? (
            <CheckCircle2 aria-hidden="true" />
          ) : (
            <UploadCloud aria-hidden="true" />
          )}
          {status === "uploading"
            ? "Enviando…"
            : status === "done"
              ? "Arquivo pronto"
              : "Selecionar arquivo"}
        </strong>
        <small>
          {kind === "image"
            ? "JPG, PNG, WEBP ou AVIF · até 10 MB"
            : kind === "audio"
              ? "MP3, M4A, WAV ou OGG · até 50 MB"
              : "MP4 ou WEBM · até 50 MB"}
        </small>
      </label>
      <input
        id={id}
        className="sr-only"
        type="file"
        accept={accepts[kind]}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      {status === "error" ? (
        <p role="alert">
          Não foi possível enviar. Confira o formato, o tamanho e sua sessão.
        </p>
      ) : null}
    </div>
  );
}

