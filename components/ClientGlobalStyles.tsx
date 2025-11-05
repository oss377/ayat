// app/components/ClientGlobalStyles.tsx
'use client';

export default function ClientGlobalStyles() {
  return (
    <>
      <style jsx>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
          min-height: max(884px, 100dvh);
        }
      `}</style>
    </>
  );
}