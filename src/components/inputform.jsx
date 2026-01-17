import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import "./form.css";
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
  const createTask = useMutation(api.project.createTask);
  const getUrl = useMutation(api.messages.getUrl);
  const createEmbedding = useAction(api.myAction.ingest);
  const [fileId, setFileId] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleImageChange = (e) => setImages(e.target.files[0]);
  const handlePdfChange = (e) => setPdfs(e.target.files[0]);

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const uploadFile = async (file) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    const { storageId } = await result.json();
    const url = await getUrl({ storageId });
    return url;
  };

  const uploadFilepdf = async (file) => {
    try {
      if (!file) {
        enqueueSnackbar("No file selected!", { variant: "warning" });
        return;
      }

      enqueueSnackbar("Uploading PDF, please wait...", { variant: "info" });

      const postUrl2 = await generateUploadUrl();
      if (!postUrl2) throw new Error("Failed to generate upload URL from Convex.");

      const result = await fetch(postUrl2, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Failed to upload file to Convex storage.");

      const storageData = await result.json();
      if (!storageData?.storageId) throw new Error("No storage ID returned after upload.");

      const url = await getUrl({ storageId: storageData.storageId });
      if (!url) throw new Error("Failed to retrieve uploaded file URL.");

      const id = uuidv4();
      setFileId(id);

      const response = await axios.post("https://back-3pxv.onrender.com/", { url });
      if (!response?.data?.result) throw new Error("Failed to extract text from PDF via backend.");

      await createEmbedding({
        texts: response.data.result,
        metaData: id,
      });

      enqueueSnackbar("✅ PDF uploaded and embedded successfully!", { variant: "success" });
      setPdfId(url);

    } catch (err) {
      console.error("Error in uploadFilepdf:", err);
      enqueueSnackbar(`Error: ${err.message || "Something went wrong during upload"}`, { variant: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdfId) {
      setLoading(true);
      try {
        const imgStorageId = images ? await uploadFile(images) : null;

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
        setLoading(false);
      }
    } else {
      enqueueSnackbar("PDF is not uploaded", { variant: "error" });
    }
  };

  const handleClick = async () => {
    try {
      if (pdfs) {
        await uploadFilepdf(pdfs);
        enqueueSnackbar("pdf uploaded", { variant: "success" });
      } else {
        enqueueSnackbar("file was not selected", { variant: "error" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page-shell">
      <div className="upload-intro">
        <p className="pill">Upload</p>
        <h2 className="section-title">Ship your project in minutes.</h2>
        <p className="section-subtitle">Attach a cover image, drop your PDF, and we will prepare it for chat with a unique shareable profile.</p>
      </div>

      <div className="d-flex justify-content-center">
        <Form onSubmit={handleSubmit} id="form" className="p-4 text-light w-100">
          {pdfId ? (
            <h4 className="text-light text-center">PDF uploaded</h4>
          ) : (
            <h4 onClick={handleClick} className="text-light text-center">Upload PDF first</h4>
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
              style={{ height: "120px" }}
              required
            />
            <Form.Label>Description</Form.Label>
          </div>

          <div className="form-floating mb-3">
            <Form.Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-light border-0 border-bottom rounded-0 bg-transparent"
              required
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

          <div className='d-flex flex-wrap justify-content-between align-items-center w-100 gap-3'>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-center">
                <Form.Label htmlFor="file" className="text-light"><FileUploadIcon /> Upload Image</Form.Label></div>
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
                <Form.Label htmlFor="files" className="text-light"><UploadFileIcon /> Upload PDF</Form.Label></div>
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
            <div className="d-flex justify-content-center gap-3">
              <Form.Check
                type="radio"
                label="Final Year"
                name="projectType"
                value="Final Year Project"
                onChange={(e) => setProjectType(e.target.value)}
                className="text-light"
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
              className="mt-2 d-flex justify-content-center align-items-center "
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
    </div>
  );
};

export default Inputform;
