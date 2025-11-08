import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import "./form.css"
import { useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useSnackbar } from "notistack";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';


const Inputform = () => {
  const [projectName, setProjectName] = useState('');
  const [pdfId, setPdfId] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [members, setMembers] = useState(['', '', '', '']);
  const [images, setImages] = useState(null);
  const [pdfs, setPdfs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState('');
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const createTask = useMutation(api.project.createTask);
  const getUrl = useMutation(api.messages.getUrl)
  const createEmbedding = useAction(api.myAction.ingest);
  const [fileId, setFileId] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  // const call=async()=>{
  // const data = {
  //   fileId: 'your-file-id',
  //   textdata: ['text1', 'text2']
  // };

  // await convexClient.action('myAction:ingest', data);
  // }
  // call();

  const handleImageChange = (e) => {
    setImages(e.target.files[0]);
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl)


  const handlePdfChange = (e) => {
    setPdfs(e.target.files[0]);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  // Function to upload a file and return its storage ID
  const uploadFile = async (file) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    const { storageId } = await result.json();
    // await sendImage({ storageId });
    const url = await getUrl({
      storageId: storageId
    })

    return url;
  };
  const uploadFilepdf = async (file) => {
    try {
      if (!file) {
        enqueueSnackbar("No file selected!", { variant: "warning" });
        return;
      }

      enqueueSnackbar("Uploading PDF, please wait...", { variant: "info" });

      // 1️⃣ Generate upload URL
      const postUrl2 = await generateUploadUrl();
      if (!postUrl2) throw new Error("Failed to generate upload URL from Convex.");

      // 2️⃣ Upload file to Convex storage
      const result = await fetch(postUrl2, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Failed to upload file to Convex storage.");

      const storageData = await result.json();
      if (!storageData?.storageId) throw new Error("No storage ID returned after upload.");

      // 3️⃣ Get public URL of the uploaded PDF
      const url = await getUrl({ storageId: storageData.storageId });
      if (!url) throw new Error("Failed to retrieve uploaded file URL.");

      // 4️⃣ Create unique ID for file
      const id = uuidv4();
      setFileId(id);
      console.log("📄 Generated File ID:", id);

      // 5️⃣ Send the PDF URL to backend for text extraction
      const response = await axios.post("https://back-3pxv.onrender.com/", { url });
      if (!response?.data?.result) throw new Error("Failed to extract text from PDF via backend.");

      // 6️⃣ Create embeddings using the extracted text
      await createEmbedding({
        texts: response.data.result,
        metaData: id,
      });

      // 7️⃣ Mark as success
      enqueueSnackbar("✅ PDF uploaded and embedded successfully!", { variant: "success" });
      setPdfId(url);

    } catch (err) {
      console.error("❌ Error in uploadFilepdf:", err);
      enqueueSnackbar(`Error: ${err.message || "Something went wrong during upload"}`, { variant: "error" });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdfId) {
      setLoading(true); // Start the loader
      try {
        const imgStorageId = images ? await uploadFile(images) : null;

        console.log({
          projectName,
          desc: description,
          images: imgStorageId,
          pdf: pdfId,
          no1: members[0],
          no2: members[1],
          no3: members[2],
          no4: members[3],
          type: projectType,
        });

        await createTask({
          projectName,
          desc: description,
          images: imgStorageId,
          pdf: pdfId,
          type: projectType,
          fileId: fileId,
          no1: members[0],
          no2: members[1],
          no3: members[2],
          no4: members[3],
          department: department,
        });
        enqueueSnackbar("Form submitted successfully!", { variant: "success" });
        setProjectName('');
        setPdfId('');
        setDescription('');
        setDepartment('');
        setMembers(['', '', '', '']);
        setImages(null);
        setPdfs(null);
        setProjectType('');
      } catch (err) {
        console.error('Error submitting form:', err);
        enqueueSnackbar("Error submitting form", { variant: "error" });
      } finally {
        setLoading(false); // Stop the loader
      }
    } else {
      enqueueSnackbar("PDF is not uploaded", { variant: "error" });
    }
  };

  const handleClick = async () => {
    try {
      if (pdfs) {
        await uploadFilepdf(pdfs)

        enqueueSnackbar("pdf uploaded", { variant: "success" });
      }
      else {
        enqueueSnackbar("file was not selected", { variant: "error" });

      }
    }
    catch (err) {
      console.log(err)
    }

  }

  return (

    <div className="bg-dark d-flex justify-content-center align-items-center w-100 p-4 pt-5">
      <Form onSubmit={handleSubmit} id="form" className="p-4 rounded text-light w-100" style={{ maxWidth: "600px" }}>
        {pdfId ? (
          <h4 className="text-light d-flex justify-content-center align-items-centermt-2">PDF Uploaded</h4>
        ) : (
          <h4 onClick={handleClick} className="text-light d-flex justify-content-center align-items-center mt-2">Upload PDF First</h4>
        )}

        <div className="form-floating mb-3">

          <Form.Control
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-light border-0 border-bottom rounded-0"
            required
          />
          <Form.Label>Project Name</Form.Label>

        </div>

        <div className="form-floating mb-3">
          <Form.Control
            as="textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-transparent text-light border-0 border-bottom rounded-0"
            style={{ height: "100px" }}
            required
          />
          <Form.Label>Description</Form.Label>
        </div>

        <div className="form-floating mb-3">
          <Form.Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="text-light border-0 border-bottom rounded-0 bg-dark"
            required
            style={{ backgroundColor: " rgba(65, 62, 62, 0.1)", backdropFilter: "blur(12px)" }}
          >
            <option value="">Select Department</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
          </Form.Select>
          <Form.Label>Department</Form.Label>
        </div>

        <Row className="mb-3">
          {members.map((member, index) => (
            <Col key={index} md={6}>
              <div className="form-floating mb-3">
                <Form.Control
                  type="text"
                  placeholder={`Member ${index + 1}`}
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  className="bg-transparent text-light border-0 border-bottom rounded-0"
                  required
                />
                <Form.Label>Member {index + 1}</Form.Label>
              </div>
            </Col>
          ))}
        </Row>
        <div className='d-flex justify-content-between align-items-center w-100'>
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-center">
              <Form.Label
                for="file" className="text-light"><FileUploadIcon />  Upload Image </Form.Label></div>
            <Form.Control
              id="file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-transparent text-light border-0 border-bottom rounded-0 d-none"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-center">
              <Form.Label for="files" className="text-light"><UploadFileIcon />Upload PDF</Form.Label></div>
            <Form.Control
              id='files'
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="bg-transparent text-light border-0 border-bottom rounded-0 d-none"
            />
            <div className="d-flex justify-content-center">
              {pdfId ? (
                <button type="button" className="btn bg-primary mt-2 text-light">PDF uploaded</button>
              ) : (
                <button type="button" onClick={handleClick} className="btn bg-danger mt-2 text-light">Upload PDF</button>
              )}
            </div>
          </Form.Group>

        </div>

        <Form.Group className="mb-3 ">
          <div className="d-flex justify-content-center">
            <Form.Label className="text-light">Project Type</Form.Label></div>
          <div className="d-flex justify-content-center">
            <Form.Check
              type="radio"
              label="Final Year Project"
              name="projectType"
              value="Final Year Project"
              onChange={(e) => setProjectType(e.target.value)}
              className="me-3 text-light"
            />
            <Form.Check
              type="radio"
              label="Mini Project"
              name="projectType"
              value="Mini Project"
              onChange={(e) => setProjectType(e.target.value)}
              className="text-light"
            />
          </div>
        </Form.Group>
        <div className=' d-flex justify-content-center align-items-center w-100'>
          <Button
            variant="primary"
            type="submit"
            className="mt-3 d-flex justify-content-center align-items-center "
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Form>
    </div>


  );
};

export default Inputform;
