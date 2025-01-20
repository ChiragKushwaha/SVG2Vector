import normalizePathData from "./normalize-path-data";

const generateXml = (pathData: string) => {
  // Create Android vector drawable
  const vectorXml = `<?xml version="1.0" encoding="utf-8"?>
<vector
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">

    <path
        android:fillColor="#FF000000"
        android:pathData="${normalizePathData(pathData)}"
    />

</vector>`;
  return vectorXml;
};

export default generateXml;
