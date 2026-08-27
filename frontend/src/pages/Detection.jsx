import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  Image as ImageIcon,
  FilmIcon,
  RotateCcwClockIcon,
  ScanLineIcon,
} from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { FileDropzone } from "@/components/detection/FileDropzone"
import { SelectedFileCard } from "@/components/detection/SelectedFileCard"
import { UploadingState } from "@/components/detection/UploadingState"
import { ProcessingState } from "@/components/detection/ProcessingState"
import { DetectionViewer } from "@/components/detection/DetectionViewer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { detectionResult, detectionResultVideo } from "@/data/detections"
import sampleRoadImage from "@/assets/road-sample.svg"

/* ------------------------------------------------------------------ */
/*  Validation constants                                              */
/* ------------------------------------------------------------------ */
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
const ACCEPTED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES].join(",")
const IMAGE_MAX = 10 * 1024 * 1024  // 10 MB
const VIDEO_MAX = 80 * 1024 * 1024  // 80 MB
const UPLOAD_MS = { image: 1400, video: 2800 }
const PROCESS_MS = { image: 2200, video: 3600 }

function validateFile(file) {
  if (!IMAGE_TYPES.includes(file.type) && !VIDEO_TYPES.includes(file.type)) {
    return "Unsupported file type — please drop a JPEG, PNG, WebP, MP4, or WebM file."
  }
  const maxSize = VIDEO_TYPES.includes(file.type) ? VIDEO_MAX : IMAGE_MAX
  if (file.size > maxSize) {
    return `File exceeds the ${Math.round(maxSize / 1024 / 1024)} MB limit.`
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function Detection() {
  const [file, setFile] = useState(null)
  const [phase, setPhase] = useState("idle")   // idle | uploading | processing | success | error
  const [result, setResult] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState(null)
  const failNextRef = useRef(false)
  const requestIdRef = useRef(0)

  const mediaKind = useMemo(
    () => (file?.type.startsWith("video/") ? "video" : "image"),
    [file]
  )

  const previewUrl = useObjectUrl(file)

  // --- Upload progress ramp + transition to processing ---
  useEffect(() => {
    if (phase !== "uploading") return undefined
    const currentRequest = requestIdRef.current
    const totalMs = UPLOAD_MS[mediaKind] ?? UPLOAD_MS.image
    const tickMs = 240
    let elapsed = 0

    setUploadProgress(6)
    const interval = window.setInterval(() => {
      elapsed += tickMs
      setUploadProgress((prev) => {
        const increment = 6 + Math.random() * 10
        const next = prev + increment
        return next >= 100 ? 100 : next
      })
    }, tickMs)

    const timer = window.setTimeout(() => {
      window.clearInterval(interval)
      if (requestIdRef.current !== currentRequest) return
      setUploadProgress(100)
      setPhase("processing")
    }, totalMs)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timer)
    }
  }, [phase, mediaKind])

  // --- Processing → success or error ---
  useEffect(() => {
    if (phase !== "processing") return undefined
    const currentRequest = requestIdRef.current
    const timer = window.setTimeout(
      () => {
        if (requestIdRef.current !== currentRequest) return
        if (failNextRef.current) {
          failNextRef.current = false
          setPhase("error")
        } else {
          setResult(mediaKind === "video" ? detectionResultVideo : detectionResult)
          setPhase("success")
        }
      },
      PROCESS_MS[mediaKind] ?? PROCESS_MS.image
    )
    return () => window.clearTimeout(timer)
  }, [phase, mediaKind])

  // --- Handlers ---
  const selectFile = useCallback((selectedFile) => {
    const error = validateFile(selectedFile)
    if (error) {
      setValidationError(error)
      setFile(null)
      setPhase("idle")
      return
    }
    setValidationError(null)
    setFile(selectedFile)
    setResult(null)
    setUploadProgress(0)
    failNextRef.current = false
    requestIdRef.current += 1
    setPhase("uploading")
  }, [])

  const reset = useCallback(() => {
    requestIdRef.current += 1
    failNextRef.current = false
    setFile(null)
    setResult(null)
    setUploadProgress(0)
    setValidationError(null)
    setPhase("idle")
  }, [])

  const busy = phase === "uploading" || phase === "processing"

  // Resolve the media source for the viewer.
  const viewerMediaUrl = useMemo(() => {
    if (!file) return sampleRoadImage
    if (mediaKind === "video" && previewUrl) return previewUrl
    return sampleRoadImage
  }, [file, mediaKind, previewUrl])

  const capabilities = useMemo(() => [
    { key: "image", label: "Image analysis · ready", icon: ImageIcon },
    { key: "video", label: "Video analysis · beta", icon: FilmIcon },
  ], [])

  return (
    <div className="page-shell">
      <PageHeader
        title="Detection"
        description="Upload a road image or video and inspect the AI detections. The pipeline is mocked end-to-end — no RF-DETR service is connected yet."
      />

      {/* ── Upload UI (visible until success) ─────────────────────── */}
      {phase !== "success" && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Left: dropzone */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Upload media</CardTitle>
              <CardDescription>
                Supported: images (JPEG/PNG/WebP ≤ 10 MB) and videos (MP4/WebM ≤ 80 MB).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {validationError && (
                <Alert variant="destructive" role="alert">
                  <CircleAlertIcon />
                  <AlertTitle>Invalid file</AlertTitle>
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <FileDropzone
                onFileSelected={selectFile}
                disabled={busy}
                accept={ACCEPTED_TYPES}
                label="Drag & drop a road image or video here, or click to browse"
                hint="JPEG, PNG, WebP, MP4 or WebM — nothing leaves your browser."
                capabilities={capabilities}
              />

              {file && (
                <SelectedFileCard
                  file={file}
                  previewUrl={mediaKind === "image" ? previewUrl : undefined}
                  onRemove={busy ? undefined : reset}
                />
              )}
            </CardContent>
          </Card>

          {/* Right: pipeline status */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Analysis pipeline</CardTitle>
              <CardDescription>Mock states for the future backend flow.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {phase === "idle" && !file && (
                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Waiting for a file — drop or select an image or video to begin.
                </p>
              )}

              {file && phase === "idle" && !busy && (
                <p className="text-muted-note">
                  File ready: <span className="font-medium text-foreground">{file.name}</span>
                </p>
              )}

              {phase === "uploading" && (
                <UploadingState
                  fileName={file?.name ?? ""}
                  progress={uploadProgress}
                  kindLabel={mediaKind === "video" ? "Uploading video" : "Uploading"}
                />
              )}

              {phase === "processing" && (
                <ProcessingState
                  fileName={file?.name ?? ""}
                  mediaKind={mediaKind}
                />
              )}

              {phase === "error" && (
                <>
                  <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Analysis failed</AlertTitle>
                    <AlertDescription>
                      The simulated model returned an error. Retry or choose another file.
                    </AlertDescription>
                  </Alert>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setPhase("uploading")}>
                      <RotateCcwClockIcon aria-hidden="true" />
                      Retry analysis
                    </Button>
                    <Button variant="ghost" onClick={reset}>
                      Choose another file
                    </Button>
                  </div>
                </>
              )}

              {busy && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start text-destructive hover:text-destructive"
                  onClick={() => { failNextRef.current = true }}
                >
                  Simulate error state
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Result viewer (visible after success) ────────────────── */}
      {phase === "success" && result && (
        <div className="flex flex-col gap-6">
          <Alert variant="success" className="[&>svg]:text-success">
            <CircleCheckIcon />
            <AlertTitle>Analysis complete</AlertTitle>
            <AlertDescription>
              {`${result.detections.length} objects detected on ${result.road}. Review each bounding box below.`}
            </AlertDescription>
          </Alert>

          <DetectionViewer
            result={result}
            imageUrl={viewerMediaUrl}
            mediaKind={mediaKind}
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={reset}>
              <ScanLineIcon aria-hidden="true" />
              Analyze another file
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                failNextRef.current = true
                setPhase("processing")
              }}
            >
              Re-run (simulate error next)
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tiny hooks                                                        */
/* ------------------------------------------------------------------ */
function useObjectUrl(file) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!file) { setUrl(null); return undefined }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  return url
}
