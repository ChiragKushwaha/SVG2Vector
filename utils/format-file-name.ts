const formatFileName = (fileName: string) => {
  return `ic_${fileName.replace(".svg", "").replace(/-/g, "_")}.xml`;
};

export default formatFileName;
