export function EmbeddedVideo() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/0jIeCAOkgcQ?si=MqeVteLD6wf0sSym"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}
