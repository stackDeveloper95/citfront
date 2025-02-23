import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './ProjectForm.css'; // Import custom CSS
import { useMutation,useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useSnackbar } from "notistack";


const Inputform =() => {
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
  const getUrl=useMutation(api.messages.getUrl)
  const createEmbedding=useAction(api.myAction.ingest);
  const [fileId,setFileId]=useState("");
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
    const url=await getUrl({
      storageId:storageId
    })
   
    return url;
  };
  const uploadFilepdf = async (file) => {
    const postUrl2 = await generateUploadUrl();
    const result = await fetch(postUrl2, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    const storageId = await result.json();
    // await sendImage({ storageId });
    const url=await getUrl({
      storageId:storageId.storageId
    })
    const id=uuidv4();
    console.log(id)
    setFileId(id);
    console.log(fileId)
   
    const response=await axios.post("http://localhost:3200/",{url:url})
   
    
    await createEmbedding({texts:response.data.result,
      metaData:id
    })
   
    enqueueSnackbar("pdf uploaded", { variant:"success"});
    setPdfId(url);
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
  
  const handleClick=async()=>{
    try{
    if(pdfs){
      await uploadFilepdf(pdfs)
     
      enqueueSnackbar("pdf uploaded", { variant:"success"});
    }
    else{
      enqueueSnackbar("file was not selected", { variant:"error"});
      
    }
   }
    catch(err){
      console.log(err)
    }

  }

  return (
    
    <Form onSubmit={handleSubmit} id="form" className="form-background p-4 rounded">
       { pdfId?<h4  className='text-primary mt-2 c-light'>PDF Uploaded</h4>: <h4 onClick={handleClick}className='text-danger mt-2'>Upload PDF First</h4>}
      <Form.Group controlId="projectName">
        <Form.Label className="text-dark">Project Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-white text-dark"
        />
      </Form.Group>

      <Form.Group controlId="description" className="mt-3">
        <Form.Label className="text-dark">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white text-dark"
        />
      </Form.Group>

      <Form.Group controlId="department" className="mt-3">
        <Form.Label className="text-dark">Department</Form.Label>
        <Form.Control
          as="select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-white text-dark"
        >
          <option value="">Select Department</option>
          <option value="CS">CS</option>
          <option value="IT">IT</option>
          <option value="MECH">MECH</option>
        </Form.Control>
      </Form.Group>

      <Row className="mt-3">
        {members.map((member, index) => (
          <Col key={index} md={6}>
            <Form.Group controlId={`member${index}`}>
              <Form.Label className="text-dark">Member {index + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter member ${index + 1} name`}
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="bg-white text-dark"
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Form.Group controlId="images" className="mt-3">
        <Form.Label className="text-dark">Upload Images</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-white text-dark"
        />
      </Form.Group>

      <Form.Group controlId="pdfs" className="mt-3">
        <Form.Label className="text-dark">Upload PDFs</Form.Label>
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          className="bg-white text-dark"
        />
       { pdfId?<button type="button" className='btn bg-primary mt-2 c-light'>PDF uploaded</button>: <button type="button"onClick={handleClick}className='btn bg-danger mt-2'>upload PDF</button>}
      </Form.Group>

      <Form.Group controlId="projectType" className="mt-3">
        <Form.Label className="text-dark">Project Type</Form.Label>
        <div className="d-flex">
          <Form.Check
            type="radio"
            label="Final Year Project"
            name="projectType"
            value="Final Year Project"
            onChange={(e) => setProjectType(e.target.value)}
            className="me-3 text-dark"
          />
          <Form.Check
            type="radio"
            label="Mini Project"
            name="projectType"
            value="Mini Project"
            onChange={(e) => setProjectType(e.target.value)}
            className="text-dark"
          />
        </div>
      </Form.Group>

      <Button 
  variant="primary" 
  type="submit" 
  className="mt-3"
  disabled={loading} // Disable the button when loading
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

    </Form>
  );
};

export default Inputform;
