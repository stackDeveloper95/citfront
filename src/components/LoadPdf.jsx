import React, { useState } from 'react';
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";





export default function PdfProcessorByUrl() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const loadPdfFromUrl = async (pdfUrl) => {
    // const data=await fetch(pdfUrl);
    // const nike10kPDFBlob = new Blob([data], { type: "application/pdf" });
    // const loader = new WebPDFLoader(nike10kPDFBlob, {
    //     // required params = ...
    //     // optional params = ...
    //   });
    //   const docs = await loader.load();
    //   console.log(docs[0]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      loadPdfFromUrl(url);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter PDF URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Load PDF</button>
      </form>

      <h3>Extracted Text:</h3>
      <textarea value={text} rows={10} cols={50} readOnly />
      <h3>Summary:</h3>
      <textarea value={summary} rows={5} cols={50} readOnly />
    </div>
  );
}
