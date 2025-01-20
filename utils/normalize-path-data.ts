const normalizePathData = (pathData: string): string => {
  // Scale down the path data from 512 to 24 viewport
  const scale = 24 / 512;

  return pathData.replace(/[\d.]+/g, (match) => {
    const num = parseFloat(match);
    return (num * scale).toFixed(2);
  });
};

export default normalizePathData;
