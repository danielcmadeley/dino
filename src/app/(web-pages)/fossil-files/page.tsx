"use client";

import { Suspense } from "react";
import { Header } from "./_components/layout/header";
import MainContent from "./_components/content/main-content";

function FossilFilesContent() {
  return (
    <div className="flex flex-col h-screen overflow-hidden font-karla bg-stone-50 dark:bg-stone-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <MainContent />
      </div>
    </div>
  );
}

export default function FossilFiles() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FossilFilesContent />
    </Suspense>
  );
}
